import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Add state for role selection
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useAuth(); // Ensure this is used
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3001/register", {
        name,
        email,
        password,
        role, // Include role in request data
      });

      if (res.data === "Already registered") {
        alert("E-mail already registered! Please Login.");
        navigate("/login");
        return;
      }

      // Extract userId and token
      const { userId, token } = res.data;

      if (!userId) {
        throw new Error("User ID is missing from the response");
      }

      // Store userId and token
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      // Update auth context
      setCurrentUser(userId);

      setLoading(false);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div >
      <div
        className="d-flex justify-content-center align-items-center text-center vh-100 "
        style={{
           marginTop: "80px",
          background:
            "url('https://media.istockphoto.com/id/1365169514/video/learning-from-books-or-textbooks-and-the-internet-helps-create-new-ideas-slowly-moving.jpg?s=640x640&k=20&c=boT0zUPwwEHuIS-LXCbBdsx8D2KgtBLi_gNY2KR1bSA=') center/cover no-repeat, linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3))",
        }}
      >
        <div className="bg-light p-3 rounded" style={{ width: "35%", marginLeft: "-35%" }}>
          <h2 className="mb-3 text-primary">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputEmail1" className="form-label">
                <strong>Full Name</strong>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                className="form-control"
                id="exampleInputname"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputEmail1" className="form-label">
                <strong>Email Id</strong>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                className="form-control"
                id="exampleInputEmail1"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputPassword1" className="form-label">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {/* Dropdown to select the role (student/admin) */}
            <div className="mb-3 text-start">
              <label htmlFor="role" className="form-label">
                <strong>Role</strong>
              </label>
              <select
                id="role"
                className="form-select"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                required
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="content_admin">Content_Admin</option>
              </select>
            </div>

            <button disabled={loading} type="submit" className="btn btn-primary">
              {loading ? "Loading..." : "Register"}
            </button>
          </form>

          <p className="container my-2">Already have an account?</p>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
