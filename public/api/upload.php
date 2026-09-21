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

// Target folder specified by client (e.g. "projects/moshari", "bio", "assets/uploads")
$folder = isset($_POST['folder']) ? trim($_POST['folder']) : 'projects/uploads';

// Sanitize folder path to prevent directory traversal security risks
$folder = preg_replace('/[^a-zA-Z0-9_\-\/]/', '', $folder);
$folder = trim($folder, '/');
if (empty($folder)) {
    $folder = 'projects/uploads';
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit();
}

$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo json_encode(['error' => 'File upload error code: ' . $file['error']]);
    exit();
}

// Validate file extension
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4', 'mov'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['error' => 'File type not allowed. Allowed extensions: JPG, PNG, WEBP, GIF, SVG, MP4, MOV']);
    exit();
}

// Target directory path relative to public root
$publicRoot = realpath(__DIR__ . '/..');
$targetDirectory = $publicRoot . '/' . $folder;

if (!file_exists($targetDirectory)) {
    mkdir($targetDirectory, 0755, true);
}

// Check if overwrite or explicit targetFilename is requested (default overwrite to true so replacing keeps the exact same name)
$overwrite = !isset($_POST['overwrite']) || $_POST['overwrite'] === 'true' || $_POST['overwrite'] === '1';
$targetFilename = isset($_POST['targetFilename']) ? trim($_POST['targetFilename']) : '';

if (!empty($targetFilename)) {
    // Use target filename specified by client
    $filename = basename($targetFilename);
    $destination = $targetDirectory . '/' . $filename;
} else {
    // Preserve exact original filename or create safe version
    $filename = $file['name'];
    $destination = $targetDirectory . '/' . $filename;

    // If file exists and overwrite is explicitly disabled, append timestamp
    if (file_exists($destination) && !$overwrite) {
        $originalName = pathinfo($file['name'], PATHINFO_FILENAME);
        $safeName = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $originalName);
        $filename = $safeName . '_' . time() . '.' . $ext;
        $destination = $targetDirectory . '/' . $filename;
    }
}

if (move_uploaded_file($file['tmp_name'], $destination)) {
    $relativeUrl = '/' . $folder . '/' . $filename;
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'url' => $relativeUrl,
        'filename' => $filename,
        'folder' => $folder,
        'message' => 'Image uploaded directly to Hostinger server folder'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file on server']);
}
