<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends ApiController
{
    /**
     * Get all categories for authenticated user
     */
    public function index(Request $request)
    {
        $categories = $request->user()
            ->categories()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->success($categories);
    }

    /**
     * Create a new category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'sort_order' => 'integer|min:0',
        ]);

        $category = $request->user()->categories()->create([
            ...$validated,
            'slug' => $this->generateSlug($validated['name']),
        ]);

        return $this->success($category, 'Category created successfully', 201);
    }

    /**
     * Update a category
     */
    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            return $this->error('Category not found', null, 404);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        if (isset($validated['name']) && $validated['name'] !== $category->name) {
            $validated['slug'] = $this->generateSlug($validated['name']);
        }

        $category->update($validated);

        return $this->success($category, 'Category updated successfully');
    }

    /**
     * Delete a category
     */
    public function destroy(Request $request, Category $category)
    {
        if ($category->user_id !== $request->user()->id) {
            return $this->error('Category not found', null, 404);
        }

        $category->delete();

        return $this->success(null, 'Category deleted successfully');
    }

    /**
     * Generate a unique slug
     */
    private function generateSlug(string $name): string
    {
        $slug = str()->slug($name);
        $original = $slug;
        $count = 1;

        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$original}-{$count}";
            $count++;
        }

        return $slug;
    }
}
