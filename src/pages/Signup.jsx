import { useState } from "react";
import { signup } from "../utils/Api";
import { useNavigate,Link } from "react-router-dom";


const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "",   confirmPassword: '',});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
        const navigate = useNavigate();
        const [errors, setErrors] = useState("");
   

  const validate = () => {
    const { email, password, confirmPassword } = form;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
     const validationError = validate();
    if (validationError) {
      setErrors(validationError);
      
    setLoading(false);
      return;
    }
    const result = await signup(form);
    setLoading(false);
    if (result.token) {
        
      setMessage("Signup successful!");
       setTimeout(() => navigate('/login'), 400);
      // navigate to dashboard if needed
    } else {
      setMessage(result.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
       required />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        required/>
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        required/>
           <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          {loading? "Signing Up.." : "Signup"}
        </button>
        <p className="text-sm text-red-500 mt-2">{message}</p>
        {errors && <p className="text-sm text-red-500 mt-2">{errors}</p>}
              Already have an account? <Link to="/login">Sign In</Link>
      </form>
      

    </div>
  );
};

export default Signup;
