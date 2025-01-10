import { Controller } from "@hotwired/stimulus"
import * as WebAuthnJSON from "@github/webauthn-json";

// Connects to data-controller="registration"
export default class extends Controller {
  static targets = [ "username" ]

  connect() {
    console.log("Session controller connected");
  }

  authenticate(event) {
    event.preventDefault(); // Prevent default form submission

    // Request challenge from the backend
    fetch("/passkeys/challenge", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ })
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
      return WebAuthnJSON.get({ publicKey: credentialOptions });
    })
    .then(credential => {
      // Finish registration by sending credential to backend /register
      console.log("Credential:", credential);
      return this.finishAuthentication(credential);
    })
    .catch(error => {
      console.error("Error during WebAuthn process:", error);
    });
  }

  finishAuthentication(credential) {
    console.log("Finishing authentication with credential:", credential);

    // params.require(%i[id rawId type response])
    // params.require(:response).require(%i[authenticatorData clientDataJSON signature userHandle])
    // params.permit(:id, :rawId, :type, { response: %i[authenticatorData clientDataJSON signature userHandle] })

    // Send the credentials back to the backend to finish authentication
    return fetch("/passkeys/authenticate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credential),
    }).then((response) => {
      if (response.ok) {
        console.log("Authentication verification success: ", response.text());
        // Redirect to the homepage or another relevant page
        window.location.replace("/");
      } else {
        console.error("Authentication verification failed: " + response.text());
        throw new Error("Authentication verification failed");
      }
    });
  }
}
