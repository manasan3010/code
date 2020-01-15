<?php
require_once 'vendor/autoload.php';

// Get $id_token via HTTPS POST.
$CLIENT_ID = '798572815118-891r2sk6jp6t91qro2c8vv8slehar1tk.apps.googleusercontent.com';
$id_token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjIwMTEwOTFkYTAzYmFhNDA5MTllNmZmODM2YzhlN2Y5YWZhYmE5YTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNzk4NTcyODE1MTE4LTg5MXIyc2s2anA2dDkxcXJvMmM4dnY4c2xlaGFyMXRrLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNzk4NTcyODE1MTE4LTg5MXIyc2s2anA2dDkxcXJvMmM4dnY4c2xlaGFyMXRrLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE4MDM0MzQyODU5NDYyNjgzMzE4IiwiZW1haWwiOiJtYW5hc2FuMzAxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InRBZ2tLRzZVTVJQUjltcXlVY3YzaUEiLCJuYW1lIjoiTWFuYXNhbiBTaXZhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21BTE4yVEwxYjhtQ0U5NVdXOGh5bFZ5S3h0cEUwVThKRkVXcDA0WkJRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik1hbmFzYW4iLCJmYW1pbHlfbmFtZSI6IlNpdmEiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU3NjY3NDE1MCwiZXhwIjoxNTc2Njc3NzUwLCJqdGkiOiJiYmRmZWM5NzI0Njk2MTVkZjRhYjhmYzhmMDEyMWQxM2I2ZTFjYmM0In0.vewjFfrKQYsqcCYcSqNInm9jnsfgnjcJX7ETwZ5chK4bcNk8pueMqls5c-GXLdJ3KGb3IjD48GZTz1kWbY7ion_ZO5NgLaMGogYRPvyd790FimUFuWF9UcV96PlD7uKWhqvqBei8P5NDeEQStJze3QFqXmSvZtkkyOyjGKKOfgU3BwJfy5mUs67ZgF9HkKm2-6rfiyFb6AMvkC1syLaeEbCEhCCyvWTUk0W28QKPzeXErijfgfEYSqCxT4UYAye9crtxNvMyDaQU974AJGzot28xKUU58GEU21TSki2MopbCZQltuPc9Fs54siIxgQ3pvUzbeOpZhaq-EICsLr_STA';


$client = new Google_Client(['client_id' => $CLIENT_ID]);  // Specify the CLIENT_ID of the app that accesses the backend
$payload = $client->verifyIdToken($id_token);
if ($payload) {
    $userid = $payload['sub'];
    // If request specified a G Suite domain:
    //$domain = $payload['hd'];
    print_r($payload);
} else {

    // Invalid ID token
}
echo "<br><br><img src=\"{$payload['picture']}\" >";
