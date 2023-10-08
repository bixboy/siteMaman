<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Récupérer les données du formulaire
  $email = $_POST["email"];
  $phone = $_POST["phone"];
  $name = $_POST["name"];
  $message = $_POST["message"];

  // Destinataire de l'e-mail
  $to = "jblepb@yahoo.com";

  // Sujet de l'e-mail
  $subject = $_POST["name"] . " - " . $_POST["subject"];

  // Corps de l'e-mail
  $body = "Nom: $name\n";
  $body .= "E-mail: $email\n";
  $body .= "Numéro de téléphone: $phone\n\n";
  $body .= "Message:\n$message";

  // Entêtes de l'e-mail
  $headers = "From: $email\r\n";
  $headers .= "Reply-To: $email\r\n";

  // Envoyer l'e-mail
  if (mail($to, $subject, $body, $headers)) {
    // L'e-mail a été envoyé avec succès
    header('Location:contact.html');
    echo "Merci, votre message a été envoyé avec succès !";
  } else {
    // Une erreur s'est produite lors de l'envoi de l'e-mail
    header('Location:contact.html');
    echo "Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.";
  }
}
?>