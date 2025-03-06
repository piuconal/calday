<?php
$servername = "127.0.0.1";
$username = "root";
$password = "";
$database = "korean_dashboard";

// Kết nối database
$conn = new mysqli($servername, $username, $password, $database);

// Kiểm tra lỗi kết nối
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
?>
