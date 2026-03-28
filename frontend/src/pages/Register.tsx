import { useState } from "react";
import { registerUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
});


  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  console.log(form)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registration successful");
      navigate("/");
    } catch (error:any) {
      console.log(error.response?.data);
    alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
       <input
        name="firstName"
        placeholder="First Name"
        onChange={handleChange}
        />

        <input
        name="lastName"
        placeholder="Last Name"
        onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;