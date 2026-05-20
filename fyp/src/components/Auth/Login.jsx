import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Backend_Url } from './../../../utils/utils';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${Backend_Url}/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          userType: response.data.userType,
          role: response.data.userType,
          isVerified: response.data.isVerified
        };

        login(userData, response.data.token);

        toast.success('Login successful!');

        switch (userData.userType) {
          case 'patient':
          case 'user':
            navigate('/patient/dashboard');
            break;
          case 'doctor':
            navigate('/doctor/dashboard');
            break;
          case 'pharmacy':
            navigate('/pharmacy/dashboard');
            break;
          case 'laboratory':
            navigate('/laboratory/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          default:
            navigate(from);
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 px-4">
    
    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 text-white">

      <h2 className="text-3xl font-bold text-center mb-2">
        Welcome Back 👋
      </h2>

      <p className="text-center text-white/70 mb-6">
        Login to MediCare
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm mb-1 text-white/80">
            E-mail
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                       text-white placeholder-white/50
                       focus:outline-none focus:ring-2 focus:ring-white/40
                       transition"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm mb-1 text-white/80">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20
                       text-white placeholder-white/50
                       focus:outline-none focus:ring-2 focus:ring-white/40
                       transition"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-semibold
                     bg-gradient-to-r from-cyan-400 to-blue-500
                     hover:from-cyan-300 hover:to-blue-400
                     transition-all duration-300
                     shadow-lg shadow-blue-500/30
                     disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-spinner fa-spin"></i>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

      </form>

      {/* Footer */}
      <p className="text-center text-sm text-white/70 mt-6">
        Don't have an account?{" "}
        <Link
          to="/role-selection"
          className="text-cyan-300 hover:text-cyan-200 font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  </div>
);
};

export default Login;
