import React, { useState } from "react";
import Login from "./Login.jsx";
import Signin from "./Signup.jsx";

function Home() {
  const [showSignin, setShowSignin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const goToSignIn = () => {
    setShowSignin(true);
    setShowLogin(false);
  };

  const goToLogin = () => {
    setShowLogin(true);
    setShowSignin(false);
  };

  return (
    <>
      {/* If both are false → show Home page */}
      {!showSignin && !showLogin ? (
        <>
          <img src="./Logo React.png" alt="Logo" />
          <h1>Trendy Cart</h1>

          <button id="btn1" onClick={goToSignIn}>
            Sign-Up
          </button>
          <br />
          <br />
          <button id="btn2" onClick={goToLogin}>
            Log-in
          </button>
        </>
      ) : showSignin ? (
        // Show Signin Page
        <Signin/>
      ) : (
        // Show Login Page
        <Login />
      )}
    </>
  );
}

export default Home;
