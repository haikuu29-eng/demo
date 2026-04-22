<?php
/**
 * VTH OmgevingsCheck — AI Proxy
 *
 * Plaatst dit bestand op dezelfde webserver als index-tablet.html.
 * Vul in de app-instellingen bij "AI Proxy URL" de URL naar dit bestand in:
 *   bijv. https://uw-server.nl/vth/ai-proxy.php
 *
 * De proxy stuurt het verzoek door naar de Anthropic API en voegt
 * de benodigde CORS-headers toe zodat de browser de respons accepteert.
 */

// CORS-headers: staat de app toe om dit endpoint te benaderen
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, x-api-key, anthropic-version');
header('Content-Type: application/json; charset=utf-8');

// Preflight OPTIONS-verzoek afhandelen
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Lees het verzoek van de app
$body = file_get_contents('php://input');
$apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
$anthropicVersion = $_SERVER['HTTP_ANTHROPIC_VERSION'] ?? '2023-06-01';

if (empty($apiKey)) {
    http_response_code(400);
    echo json_encode(['error' => 'Geen API-key meegestuurd']);
    exit;
}

// Stuur door naar Anthropic API
$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $body,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey,
        'anthropic-version: ' . $anthropicVersion,
        'anthropic-dangerous-allow-browser: true',
    ],
    CURLOPT_TIMEOUT        => 60,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(['error' => 'Proxy-verbindingsfout: ' . $curlError]);
    exit;
}

http_response_code($httpCode);
echo $response;
