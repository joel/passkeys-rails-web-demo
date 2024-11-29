import { Controller } from "@hotwired/stimulus"
import * as WebAuthnJSON from "@github/webauthn-json";

// Connects to data-controller="registration"
export default class extends Controller {
  static targets = [ "username" ]

  connect() {
  }

  register(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the username from the form input
    const username = this.usernameTarget.value;

    // CSRF Token
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

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
      if (!response.ok) {
        throw new Error("Failed to retrieve challenge from server");
      }
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
    .then(() => {
      // Redirect to the RegistrationsController#create to finalize registration
      this.finalizeRegistration(username);
    })
    .catch(error => {
      console.error("Error during WebAuthn process:", error);
    });
  }

  finishRegistration(credential, username) {
    console.log("Finishing registration with credential:", credential);

    // CSRF Token for safety
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Send the credentials back to the backend to finish registration
    return fetch("/passkeys/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
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
      if (!response.ok) {
        throw new Error("Registration verification failed");
      }
    });
  }

  finalizeRegistration(username) {
    // CSRF Token
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Complete the registration by calling the RegistrationsController#create endpoint
    fetch("/registration", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({ username: username }),
      credentials: "same-origin",
    })
      .then((response) => {
        if (response.ok) {
          // Redirect to the homepage or another relevant page
          window.location.replace("/users");
        } else {
          throw new Error("Error finalizing registration");
        }
      })
      .catch((error) => {
        console.error("Error finalizing registration:", error);
      });
  }
}
