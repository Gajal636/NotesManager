import React, { useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/register", form);
      setMessage("✅ " + res.data.message);
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.message || "Registration failed"));
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          minLength="6"
          required
        />
        
        <button 
          type="submit" 
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
        >
          Register
        </button>
        
        {message && (
          <p className="mt-3 text-sm text-center p-2 rounded bg-gray-100">
            {message}
          </p>
        )}
        
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => navigate('/login')} 
              className="text-green-500 hover:underline font-medium"
            >
              Login here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
