<?php
require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'] ?? '';
    $note = $_POST['note'] ?? '';

    if (empty($id)) {
        die("invalid_id");
    }

    // Debug dữ liệu nhận được
    error_log("ID: $id, Note: $note"); // Kiểm tra log trên server

    $stmt = $conn->prepare("UPDATE calday SET note_in = ? WHERE id = ?");
    $stmt->bind_param("si", $note, $id);

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "error: " . $stmt->error;
    }
    $stmt->close();
}
?>
