import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginCustomer } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/home" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginCustomer(form);
      await refreshUser();
      navigate("/home");
    } catch {
      setError("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h1>Welcome back</h1>
        {location.state?.registered && <p className="success">Account created! Please log in.</p>}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-block" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        <p className="muted center">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}
