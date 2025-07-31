// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../context/AuthContext";
// import "../styles/Login.css";

// const Login = () => {
//   const [credentials, setCredentials] = useState({
//     username: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         credentials
//       );
//       login(res.data); // Store user in context and localStorage
//       navigate("/dashboard");
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "Login failed. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login to Your Account</h2>
//       <form className="login-form" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="username"
//           placeholder="Username"
//           value={credentials.username}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={credentials.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">Login</button>
//         {error && <p className="error-message">{error}</p>}
//       </form>
//     </div>
    
//   );
// };

// export default Login;



import React from "react";
import "../styles/Login.css";

function Login() {
  const handleLogin = (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username && password) {
      alert(`Welcome, ${username}! Login successful.`);
      document.querySelector(".login-form form").reset();
    }
  };

  return (
    <div className="App">
      {/* Slider form above lamp */}
      <form
        className="slider-form"
        onInput={(e) =>
          document.body.setAttribute("data-light", e.target.value)
        }
      >
        <div className="icon sun">
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
          <div className="ray"></div>
        </div>
        <input type="range" id="slider" defaultValue="0" min="0" max="10" />
      </form>

      {/* Lamp in the center */}
      <div className="lamp-wrapper">
        <div className="lamp-rope"></div>
        <div className="lamp">
          <div className="lamp-part -top">
            <div className="lamp-part -top-part"></div>
            <div className="lamp-part -top-part right"></div>
          </div>
          <div className="lamp-part -body"></div>
          <div className="lamp-part -body right"></div>
          <div className="lamp-part -bottom"></div>
          <div className="blub"></div>
        </div>
        <div className="wall-light-shadow"></div>
      </div>

      {/* Login form below lamp */}
      <div className="login-form">
        <h2>Welcome</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
