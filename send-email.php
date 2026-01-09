<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Sanitize inputs
$firstName = trim(strip_tags($_POST['firstName'] ?? ''));
$lastName  = trim(strip_tags($_POST['lastName'] ?? ''));
$email     = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone     = trim(strip_tags($_POST['phone'] ?? ''));
$message   = trim(strip_tags($_POST['message'] ?? ''));

// Validation
$errors = [];

if (strlen($firstName) < 2) $errors[] = 'Vorname fehlt.';
if (strlen($lastName) < 2)  $errors[] = 'Nachname fehlt.';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Ungültige E-Mail-Adresse.';
if (strlen($message) < 10)  $errors[] = 'Nachricht zu kurz.';

if ($errors) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(' ', $errors)
    ]);
    exit;
}

$mail = new PHPMailer(true);

try {
    if (!ob_get_level()) ob_start();

    // SMTP CONFIG (PressLogic / Gmail – unchanged logic)
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'presslogic36@gmail.com';
    $mail->Password   = 'qsoz cpnl dvwd ibfs'; // Gmail App Password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->SMTPDebug = 0;

    // Sender
    $mail->setFrom('no-reply@presslogic.de', 'PressLogic Website');
    $mail->addReplyTo($email, $firstName . ' ' . $lastName);

    // Recipients
    $mail->addAddress('kfz.bab@gmail.com');
     $mail->addAddress('altinejup@gmail.com');

    // Email content
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = '📩 Neue Kontaktanfrage – Website';
$mail->Body = "
<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden;'>
    <!-- Header -->
    <div style='background-color:#4CAF50;color:white;padding:20px;text-align:center;'>
        <h2 style='margin:0;font-size:24px;'>📩 Neue Kontaktanfrage</h2>
        <p style='margin:5px 0;font-size:14px;'>von Ihrer Website</p>
    </div>

    <!-- Body Content -->
    <div style='padding:20px;color:#333;'>
        <p><strong>Name:</strong> {$firstName} {$lastName}</p>
        <p><strong>E-Mail:</strong> {$email}</p>
        " . (!empty($phone) ? "<p><strong>Telefon:</strong> {$phone}</p>" : "") . "
        <hr style='border:0;border-top:1px solid #eee;margin:15px 0;'>
        <p><strong>Nachricht:</strong></p>
        <p style='white-space:pre-line;background:#f9f9f9;padding:10px;border-radius:5px;border:1px solid #eee;'>{$message}</p>
    </div>

    <!-- Footer -->
    <div style='background-color:#f2f2f2;color:#555;padding:10px 20px;text-align:center;font-size:12px;'>
        Gesendet am: " . date('d.m.Y H:i:s') . "<br>
        <a href='https://www.bab-gutachter.de' style='color:#4CAF50;text-decoration:none;'>bab-gutachter.de</a>
    </div>
</div>
";

    $mail->AltBody =
        "Neue Kontaktanfrage\n\n" .
        "Name: {$firstName} {$lastName}\n" .
        "Email: {$email}\n" .
        (!empty($phone) ? "Telefon: {$phone}\n" : "") .
        "\nNachricht:\n{$message}";

    $mail->send();

    if (ob_get_length()) ob_end_clean();

    echo json_encode([
        'success' => true,
        'message' => 'Ihre Nachricht wurde erfolgreich gesendet.'
    ]);

} catch (Exception $e) {
    error_log('Mailer Error: ' . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'E-Mail konnte nicht gesendet werden.'
    ]);
}
