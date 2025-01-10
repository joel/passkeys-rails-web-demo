import { Controller } from "@hotwired/stimulus"
import * as WebAuthnJSON from "@github/webauthn-json";

// Connects to data-controller="registration"
export default class extends Controller {
  static targets = [ "username" ]

  connect() {
    console.log("Registration controller connected");
  }

  register(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the username from the form input
    const username = this.usernameTarget.value;

    // Request challenge from the backend
    fetch("/passkeys/challenge", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: username })
    })
    .then(response => {
      return response.json();
    })
    .then(credentialOptions => {
      // Use WebAuthn to initiate credential creation
      console.log("Credential options:", credentialOptions);
      return WebAuthnJSON.create({ publicKey: credentialOptions });
    })
    .then(credential => {
      // Finish registration by sending credential to backend /register
      console.log("Credential:", credential);
      return this.finishRegistration(credential, username);
    })
    .catch(error => {
      console.error("Error during WebAuthn process:", error);
    });
  }

  finishRegistration(credential, username) {
    console.log("Finishing registration with credential:", credential);

    // Send the credentials back to the backend to finish registration
    return fetch("/passkeys/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        credential: credential,
        authenticatable: {
          class: "User",
          params: {
            username: username,
          },
        },
      }),
      credentials: "same-origin",
    }).then((response) => {
      if (response.ok) {
        console.log("Registration successful");
        window.location.href = "/";
      } else {
        throw new Error("Registration verification failed");
      }
    });
  }
}
