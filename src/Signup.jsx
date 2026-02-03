import React, { useState } from "react";
import Trendycart from "./Trendycart"; // import your Trendycart component
import "./Signupstyle.scss"; // import styles

function Signin() {
  // usestate to store input values
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [signedUp, setSignedUp] = useState(false); // controls view change


  // preventdefault for stop the refreshed
  const handleSignup = (e) => {
    e.preventDefault();

    // here check name or email or password or confirm is empty then alert will shown on the page 
    // and also here in name or anything is empty because usestate is empty then we willl type or enter something then setname or anything update the name or anything
    if (!name || !mail || !password || !confirm) {
      alert(" Please fill out all fields!");
      return;
    }

// here check the password not equal to confirm if not equal then alert will show
    if (password !== confirm) {
      alert(" Password not match");

      // here why return means if the password not match  then it give alert and then alert (signup success) son only we use return
      // return means code stop then signup alert will come
      return;
    }

    //  Success → go to Trendycart
    alert(` Welcome ${name}! Signup Successful!`);
    // setSignedup true it go to trendy cart page
    setSignedUp(true);

    // Clear fields 
    setName("");
    setMail("");
    setPassword("");
    setConfirm("");
  };

  // signed up is true then trendy cart will be shown
  if (signedUp) {
    return <Trendycart />;
  }

  return (
  <div id="signup">
    <div id="signup1">
      <form onSubmit={handleSignup}>
      Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)}placeholder="Enter your name"/>
      Email:<input type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Enter your email"/>
      Password:<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password"/>
      Confirm Password:<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password"/>

 <button id="btnsignup" type="submit" >Sign Up</button>
 </form>
      </div>
    </div>
  );
}

export default Signin;
