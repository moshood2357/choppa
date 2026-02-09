<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends ApiController
{
    /**
     * Get all products for authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Product::where('user_id', $user->id);

        // Filtering
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', (bool)$request->is_active);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('sku', 'like', "%{$request->search}%");
            });
        }

        $products = $query->paginate($request->get('per_page', 15));

        return $this->paginated($products);
    }

    /**
     * Create a new product
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'sku' => 'nullable|unique:products',
            'images' => 'nullable|array',
            'low_stock_threshold' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $product = $request->user()->products()->create([
            ...$validated,
            'slug' => $this->generateSlug($validated['name']),
        ]);

        return $this->success($product, 'Product created successfully', 201);
    }

    /**
     * Get a specific product
     */
    public function show(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            return $this->error('Product not found', null, 404);
        }

        return $this->success($product);
    }

    /**
     * Update a product
     */
    public function update(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            return $this->error('Product not found', null, 404);
        }

        $validated = $request->validate([
            'category_id' => 'nullable|exists:categories,id',
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'quantity' => 'integer|min:0',
            'sku' => "nullable|unique:products,sku,{$product->id}",
            'images' => 'nullable|array',
            'low_stock_threshold' => 'integer|min:0',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $product->name) {
            $validated['slug'] = $this->generateSlug($validated['name']);
        }

        $product->update($validated);

        return $this->success($product, 'Product updated successfully');
    }

    /**
     * Delete a product
     */
    public function destroy(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            return $this->error('Product not found', null, 404);
        }

        $product->delete();

        return $this->success(null, 'Product deleted successfully');
    }

    /**
     * Get low stock products
     */
    public function lowStock(Request $request)
    {
        $products = $request->user()
            ->products()
            ->lowStock()
            ->paginate($request->get('per_page', 15));

        return $this->paginated($products, 'Low stock products');
    }

    /**
     * Adjust product stock
     */
    public function adjustStock(Request $request, Product $product)
    {
        if ($product->user_id !== $request->user()->id) {
            return $this->error('Product not found', null, 404);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer',
            'reason' => 'nullable|string',
        ]);

        $product->adjustStock($validated['quantity'], 'adjust', $validated['reason'] ?? null);

        return $this->success($product, 'Stock adjusted successfully');
    }

    /**
     * Generate a unique slug
     */
    private function generateSlug(string $name): string
    {
        $slug = str()->slug($name);
        $original = $slug;
        $count = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$count}";
            $count++;
        }

        return $slug;
    }
}
