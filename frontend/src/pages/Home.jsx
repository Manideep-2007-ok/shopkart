import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      <h1>Welcome, {user.fullName}</h1>
      <div className="profile">
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
      <Link to="/products" className="btn">Start Shopping</Link>
    </div>
  );
}
