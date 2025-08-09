import { useState} from "react";
import { login } from "../utils/Api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
      const {login:authLogin} = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    const result = await login(form);
    setLoading(false);

    if(result.token){
      authLogin(result.token);
        localStorage.setItem("token", result.token);
        setMessage("Successful");
        setTimeout(() => navigate('/'), 200)
    }
    else{
        setMessage(result.message || "Signup Failed")
    }
  };
 

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
     
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />
      
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
         {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-red-500 mt-2">{message}</p>
      </form>
    </div>
  );
};

export default Login;
