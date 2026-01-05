<?php
/**
 * Contact Form Email Handler
 * 
 * This is a placeholder PHP script for handling form submissions.
 * Replace this with your actual email sending logic.
 * 
 * For production use, consider:
 * - Using PHPMailer library
 * - Adding proper validation and sanitization
 * - Implementing CSRF protection
 * - Adding rate limiting to prevent spam
 */

header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get form data
$firstName = isset($_POST['firstName']) ? htmlspecialchars(trim($_POST['firstName'])) : '';
$lastName = isset($_POST['lastName']) ? htmlspecialchars(trim($_POST['lastName'])) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$phone = isset($_POST['phone']) ? htmlspecialchars(trim($_POST['phone'])) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

// Basic validation
$errors = [];

if (empty($firstName) || strlen($firstName) < 2) {
    $errors[] = 'Bitte geben Sie Ihren Vornamen ein.';
}

if (empty($lastName) || strlen($lastName) < 2) {
    $errors[] = 'Bitte geben Sie Ihren Nachnamen ein.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Bitte geben Sie eine Nachricht ein (mindestens 10 Zeichen).';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit;
}

// Email configuration
$to = 'info@bab-gutachter.de'; // Replace with your email address
$subject = 'Neue Kontaktanfrage von ' . $firstName . ' ' . $lastName;
$emailBody = "Neue Kontaktanfrage von der Website:\n\n";
$emailBody .= "Name: " . $firstName . " " . $lastName . "\n";
$emailBody .= "E-Mail: " . $email . "\n";
if (!empty($phone)) {
    $emailBody .= "Telefon: " . $phone . "\n";
}
$emailBody .= "\nNachricht:\n" . $message . "\n";
$emailBody .= "\n---\nGesendet am: " . date('d.m.Y H:i:s');

$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mailSent = mail($to, $subject, $emailBody, $headers);

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Ihre Nachricht wurde erfolgreich gesendet.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Fehler beim Senden der E-Mail. Bitte versuchen Sie es später erneut.'
    ]);
}
?>

