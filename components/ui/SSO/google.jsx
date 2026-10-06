import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const GoogleSSO = ({ onSuccess, onFailure }) => {


  const handleGoogleSuccess = async (googleUser) => {
    console.log("Google User Data:", googleUser);  // Check what you get

    const response = await fetch("https://your-api.com/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        googleId: googleUser.sub,  // Unique Google ID
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture,
      }),
    });

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);  // Store JWT
      console.log("Login Successful!");
      // Redirect user to dashboard
    } else {
      console.error("Login failed", data);
    }
  };

  const handleFailure = (response) => {
    console.error("Google Login Failed:", response);
    onFailure(response);
  };

  const clientId = "628350519521-8tap5k734rkhp861cq10jsqvlqt2b0ml.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log('credentialResponse', credentialResponse);

            const decoded = jwtDecode(credentialResponse.credential);
            console.log('================= Decoded =====================', decoded);
            handleSuccess(decoded);
          }}
          onError={() => {
            handleFailure("Login Failed");
          }}
          style={{ width: "100%" }} // Ensure full width
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleSSO;
