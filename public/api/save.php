<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$rawInput = file_get_contents('php://input');
if (empty($rawInput)) {
    http_response_code(400);
    echo json_encode(['error' => 'No JSON data received']);
    exit();
}

$decoded = json_decode($rawInput, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit();
}

$targetDir = __DIR__ . '/../data';
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0755, true);
}

$targetFile = $targetDir . '/cms.json';
$success = file_put_contents($targetFile, json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

if ($success !== false) {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'CMS configuration saved to Hostinger server successfully']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write cms.json file on server']);
}
