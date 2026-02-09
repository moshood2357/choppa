<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class InstagramService
{
    private string $baseUrl = 'https://graph.instagram.com';
    private string $accessToken;
    private string $apiVersion = 'v18.0';

    public function __construct()
    {
        $this->accessToken = config('services.instagram.access_token');
    }

    /**
     * Get business account information
     */
    public function getBusinessAccount(string $businessAccountId): array
    {
        $response = Http::get(
            "{$this->baseUrl}/{$this->apiVersion}/{$businessAccountId}",
            ['access_token' => $this->accessToken]
        );

        return $response->json();
    }

    /**
     * Get products from Instagram catalog
     */
    public function getProducts(string $businessAccountId, array $params = []): array
    {
        $response = Http::get(
            "{$this->baseUrl}/{$this->apiVersion}/{$businessAccountId}/products",
            array_merge(['access_token' => $this->accessToken], $params)
        );

        return $response->json();
    }

    /**
     * Get a specific product
     */
    public function getProduct(string $productId): array
    {
        $response = Http::get(
            "{$this->baseUrl}/{$this->apiVersion}/{$productId}",
            ['access_token' => $this->accessToken]
        );

        return $response->json();
    }

    /**
     * Get product catalog
     */
    public function getCatalog(string $catalogId): array
    {
        $response = Http::get(
            "{$this->baseUrl}/{$this->apiVersion}/{$catalogId}",
            ['access_token' => $this->accessToken]
        );

        return $response->json();
    }

    /**
     * Create a product
     */
    public function createProduct(string $catalogId, array $productData): array
    {
        $response = Http::post(
            "{$this->baseUrl}/{$this->apiVersion}/{$catalogId}/products",
            array_merge(['access_token' => $this->accessToken], $productData)
        );

        return $response->json();
    }

    /**
     * Update a product
     */
    public function updateProduct(string $productId, array $productData): array
    {
        $response = Http::post(
            "{$this->baseUrl}/{$this->apiVersion}/{$productId}",
            array_merge(['access_token' => $this->accessToken], $productData)
        );

        return $response->json();
    }

    /**
     * Get Instagram shop information
     */
    public function getShop(string $shopId): array
    {
        $response = Http::get(
            "{$this->baseUrl}/{$this->apiVersion}/{$shopId}",
            ['access_token' => $this->accessToken]
        );

        return $response->json();
    }
}
