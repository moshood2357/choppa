<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class PaystackService
{
    private string $baseUrl = 'https://api.paystack.co';
    private string $secretKey;

    public function __construct()
    {
        $this->secretKey = config('services.paystack.secret_key');
    }

    /**
     * Initialize a transaction
     */
    public function initializeTransaction(
        string $email,
        int $amount,
        ?string $reference = null,
        array $metadata = []
    ): array {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->secretKey}",
        ])->post("{$this->baseUrl}/transaction/initialize", [
            'email' => $email,
            'amount' => $amount * 100, // Convert to kobo
            'reference' => $reference ?? uniqid(),
            'metadata' => $metadata,
        ]);

        return $response->json();
    }

    /**
     * Verify a transaction
     */
    public function verifyTransaction(string $reference): array
    {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->secretKey}",
        ])->get("{$this->baseUrl}/transaction/verify/{$reference}");

        return $response->json();
    }

    /**
     * Get transaction details
     */
    public function getTransaction(int $transactionId): array
    {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->secretKey}",
        ])->get("{$this->baseUrl}/transaction/{$transactionId}");

        return $response->json();
    }

    /**
     * Create a transfer
     */
    public function createTransfer(
        string $recipient,
        int $amount,
        string $reason = ''
    ): array {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->secretKey}",
        ])->post("{$this->baseUrl}/transfer", [
            'source' => 'balance',
            'recipient' => $recipient,
            'amount' => $amount * 100,
            'reason' => $reason,
        ]);

        return $response->json();
    }

    /**
     * Create transfer recipient
     */
    public function createTransferRecipient(
        string $type,
        string $accountNumber,
        string $bankCode,
        string $name
    ): array {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->secretKey}",
        ])->post("{$this->baseUrl}/transferrecipient", [
            'type' => $type,
            'account_number' => $accountNumber,
            'bank_code' => $bankCode,
            'name' => $name,
        ]);

        return $response->json();
    }

    /**
     * List banks
     */
    public function getBanks(?string $country = 'NG'): array
    {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->secretKey}",
        ])->get("{$this->baseUrl}/bank", [
            'country' => $country,
        ]);

        return $response->json();
    }
}
