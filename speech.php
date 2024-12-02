<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// Log requests for debugging
$log_file = __DIR__ . "/debug.log";
file_put_contents($log_file, "Request received\n", FILE_APPEND);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!empty($data['text'])) {
        $text = $data['text'];
        $filename = __DIR__ . "/speech_" . date("Y-m-d_H-i-s") . ".txt";

        if (file_put_contents($filename, $text) !== false) {
            file_put_contents($log_file, "File saved successfully: $filename\n", FILE_APPEND);
            echo json_encode(["success" => true, "filename" => basename($filename)]);
        } else {
            file_put_contents($log_file, "File write failed: $filename\n", FILE_APPEND);
            echo json_encode(["success" => false, "message" => "Failed to write file."]);
        }
    } else {
        file_put_contents($log_file, "Empty text received.\n", FILE_APPEND);
        echo json_encode(["success" => false, "message" => "No text provided."]);
    }
} else {
    file_put_contents($log_file, "Invalid request method.\n", FILE_APPEND);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
