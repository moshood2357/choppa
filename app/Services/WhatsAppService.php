<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class WhatsAppService
{
    private string $baseUrl = 'https://graph.instagram.com';
    private string $apiVersion = 'v18.0';
    private string $accessToken;
    private string $phoneNumberId;
    private string $businessAccountId;

    public function __construct()
    {
        $this->accessToken = config('services.whatsapp.access_token');
        $this->phoneNumberId = config('services.whatsapp.phone_number_id');
        $this->businessAccountId = config('services.whatsapp.business_account_id');
    }

    /**
     * Send a text message
     */
    public function sendTextMessage(string $recipientPhone, string $message): array
    {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}",
        ])->post(
            "{$this->baseUrl}/{$this->apiVersion}/{$this->phoneNumberId}/messages",
            [
                'messaging_product' => 'whatsapp',
                'to' => $recipientPhone,
                'type' => 'text',
                'text' => ['body' => $message],
            ]
        );

        return $response->json();
    }

    /**
     * Send a template message
     */
    public function sendTemplateMessage(
        string $recipientPhone,
        string $templateName,
        string $languageCode = 'en',
        array $parameters = []
    ): array {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}",
        ])->post(
            "{$this->baseUrl}/{$this->apiVersion}/{$this->phoneNumberId}/messages",
            [
                'messaging_product' => 'whatsapp',
                'to' => $recipientPhone,
                'type' => 'template',
                'template' => [
                    'name' => $templateName,
                    'language' => ['code' => $languageCode],
                    'components' => [
                        [
                            'type' => 'body',
                            'parameters' => $parameters,
                        ],
                    ],
                ],
            ]
        );

        return $response->json();
    }

    /**
     * Send media message
     */
    public function sendMediaMessage(
        string $recipientPhone,
        string $type,
        string $mediaUrl
    ): array {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}",
        ])->post(
            "{$this->baseUrl}/{$this->apiVersion}/{$this->phoneNumberId}/messages",
            [
                'messaging_product' => 'whatsapp',
                'to' => $recipientPhone,
                'type' => $type,
                $type => ['link' => $mediaUrl],
            ]
        );

        return $response->json();
    }

    /**
     * Send interactive message (buttons)
     */
    public function sendButtonMessage(
        string $recipientPhone,
        string $bodyText,
        array $buttons
    ): array {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}",
        ])->post(
            "{$this->baseUrl}/{$this->apiVersion}/{$this->phoneNumberId}/messages",
            [
                'messaging_product' => 'whatsapp',
                'to' => $recipientPhone,
                'type' => 'interactive',
                'interactive' => [
                    'type' => 'button',
                    'body' => ['text' => $bodyText],
                    'action' => [
                        'buttons' => $buttons,
                    ],
                ],
            ]
        );

        return $response->json();
    }

    /**
     * Get message status
     */
    public function getMessageStatus(string $messageId): array
    {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}",
        ])->get("{$this->baseUrl}/{$this->apiVersion}/{$messageId}");

        return $response->json();
    }

    /**
     * Upload media
     */
    public function uploadMedia(string $filePath, string $type): array
    {
        /** @var Response $response */
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$this->accessToken}",
        ])->attach(
            'file',
            fopen($filePath, 'r'),
            basename($filePath)
        )->post(
            "{$this->baseUrl}/{$this->apiVersion}/{$this->phoneNumberId}/media",
            [
                'messaging_product' => 'whatsapp',
                'type' => $type,
            ]
        );

        return $response->json();
    }
}
