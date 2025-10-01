<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: contact.html');
    exit;
}

$honeypot = isset($_POST['website']) ? trim($_POST['website']) : '';
if ($honeypot !== '') {
    header('Location: contact.html?status=spam#formulaire');
    exit;
}

$submittedAt = isset($_POST['submittedAt']) ? (int) $_POST['submittedAt'] : 0;
if ($submittedAt > 0 && (time() - $submittedAt) < 3) {
    header('Location: contact.html?status=spam#formulaire');
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';
$consent = isset($_POST['consent']);

if (!$consent || $name === '' || $email === '' || $phone === '' || $message === '') {
    header('Location: contact.html?status=error#formulaire');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    header('Location: contact.html?status=error#formulaire');
    exit;
}

$sanitizedName = filter_var($name, FILTER_SANITIZE_SPECIAL_CHARS);
$sanitizedPhone = filter_var($phone, FILTER_SANITIZE_SPECIAL_CHARS);
$sanitizedMessage = filter_var($message, FILTER_SANITIZE_SPECIAL_CHARS);

$to = 'mainemerveille@gmail.com';
$subject = 'Demande de contact - ' . $sanitizedName;

$body = "Nom : {$sanitizedName}\n";
$body .= "E-mail : {$email}\n";
$body .= "Téléphone : {$sanitizedPhone}\n\n";
$body .= "Message :\n{$sanitizedMessage}\n";

$headers = "From: mainemerveille@gmail.com\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    header('Location: contact.html?status=success#formulaire');
    exit;
}

header('Location: contact.html?status=error#formulaire');
exit;
?>
