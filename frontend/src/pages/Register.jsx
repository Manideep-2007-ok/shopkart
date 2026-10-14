import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorMessage, registerCustomer } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      await registerCustomer(form);
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      setServerError(errorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    ["fullName", "Full Name", "text"],
    ["email", "Email", "email"],
    ["password", "Password", "password"],
    ["phone", "Phone Number", "tel"],
  ];

  return (
    <div className="auth-page">
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <h1>Create your account</h1>
        {fields.map(([name, label, type]) => (
          <div className="field" key={name}>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} type={type} value={form[name]} onChange={handleChange} className={errors[name] ? "invalid" : ""} />
            {errors[name] && <small className="error">{errors[name]}</small>}
          </div>
        ))}
        {serverError && <p className="error">{serverError}</p>}
        <button className="btn btn-block" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
        <p className="muted center">Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
