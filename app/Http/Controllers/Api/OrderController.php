<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends ApiController
{
    /**
     * Get all orders for authenticated user
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Order::where('user_id', $user->id);

        // Filtering
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        if ($request->has('channel')) {
            $query->where('channel', $request->channel);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('order_number', 'like', "%{$request->search}%")
                  ->orWhere('customer_name', 'like', "%{$request->search}%")
                  ->orWhere('customer_phone', 'like', "%{$request->search}%");
            });
        }

        $orders = $query->with('items')->orderByDesc('created_at')->paginate($request->get('per_page', 15));

        return $this->paginated($orders);
    }

    /**
     * Get a specific order
     */
    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return $this->error('Order not found', null, 404);
        }

        $order->load('items');

        return $this->success($order);
    }

    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email',
            'customer_phone' => 'required|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.attributes' => 'nullable|array',
            'shipping_address' => 'required|array',
            'shipping_address.street' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.state' => 'required|string',
            'shipping_address.postal_code' => 'required|string',
            'notes' => 'nullable|string',
            'channel' => 'in:web,instagram,whatsapp',
        ]);

        $user = $request->user();
        $subtotal = 0;
        $items = [];

        // Validate and prepare items
        foreach ($validated['items'] as $item) {
            $product = $user->products()->find($item['product_id']);
            
            if (!$product) {
                return $this->error('One or more products not found', null, 404);
            }

            if ($product->quantity < $item['quantity']) {
                return $this->error("Insufficient stock for {$product->name}", null, 422);
            }

            $itemSubtotal = $product->price * $item['quantity'];
            $subtotal += $itemSubtotal;

            $items[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'unit_price' => $product->price,
                'quantity' => $item['quantity'],
                'subtotal' => $itemSubtotal,
                'attributes' => $item['attributes'] ?? null,
            ];
        }

        // Create order
        $order = $user->orders()->create([
            'order_number' => $this->generateOrderNumber($user->id),
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'subtotal' => $subtotal,
            'tax' => 0,
            'shipping_cost' => 0,
            'total' => $subtotal,
            'shipping_address' => $validated['shipping_address'],
            'notes' => $validated['notes'],
            'channel' => $validated['channel'] ?? 'web',
        ]);

        // Create order items
        foreach ($items as $item) {
            $order->items()->create($item);
        }

        $order->load('items');

        return $this->success($order, 'Order created successfully', 201);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return $this->error('Order not found', null, 404);
        }

        $validated = $request->validate([
            'status' => 'in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return $this->success($order, 'Order status updated');
    }

    /**
     * Mark order as paid
     */
    public function markAsPaid(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            return $this->error('Order not found', null, 404);
        }

        $validated = $request->validate([
            'payment_method' => 'required|in:card,transfer,crypto,cash,whatsapp',
            'transaction_id' => 'nullable|string',
        ]);

        $order->markAsPaid($validated['payment_method'], $validated['transaction_id'] ?? null);

        return $this->success($order, 'Order marked as paid');
    }

    /**
     * Get order statistics
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        $stats = [
            'total_orders' => $user->orders()->count(),
            'pending_orders' => $user->orders()->pending()->count(),
            'paid_orders' => $user->orders()->paid()->count(),
            'total_revenue' => $user->orders()->paid()->sum('total'),
            'orders_by_channel' => [
                'web' => $user->orders()->where('channel', 'web')->count(),
                'instagram' => $user->orders()->where('channel', 'instagram')->count(),
                'whatsapp' => $user->orders()->where('channel', 'whatsapp')->count(),
            ],
        ];

        return $this->success($stats);
    }

    /**
     * Generate a unique order number
     */
    private function generateOrderNumber(int $userId): string
    {
        $prefix = 'ORD';
        $timestamp = now()->format('YmdHis');
        $random = str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        
        return "{$prefix}-{$timestamp}-{$random}";
    }
}
