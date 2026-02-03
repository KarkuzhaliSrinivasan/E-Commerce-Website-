import React, { useState } from "react";
import Trendycart from "./Trendycart"; // import your Trendycart component

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false); // controls what to show

  const handleLogin = () => {
    if (email && password) {
  // here check email and password are empty? then if empty it shows alert message if not empty it convert true firstly we set it as false 
      setLoggedIn(true); // switch to Trendycart view
      setEmail("");      // clear email field
      setPassword("");   // clear password field
    } else {
      alert("Please enter email and password");
    }
  };
// after that true it goes to Trendycart page
  if (loggedIn) {
    return <Trendycart onLogout={() => setLoggedIn(false)} />;
  }

  // Otherwise, show login form
  return (
    <div id="Logid">
      <div id="Logid1">
        <h2>Login Page</h2>
        <input   id="input1" type="text" value={email}   required   onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email"/>
        <input  id="input2" type="password" value={password}  required  onChange={(e) => setPassword(e.target.value)} placeholder="Enter Your Password"/>
        <button  id="btn1logid"onClick={handleLogin} >Login</button>
      </div>
    </div>
  );
}

export default Login;
