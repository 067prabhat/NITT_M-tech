import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from "../context/authContext"; // Assuming you have this context for authentication
import './Login.css'
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student"); // Default role is "student"
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setCurrentUser } = useAuth(); // Use authentication context

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:3001/login', { email, password, role }); // Pass role to backend

            // Destructure token, userId, and role from the response
            const { token, userId, role: userRole } = res.data;

            if (token && userId) {
                // Ensure the role from the backend matches the selected role
                if (userRole !== role) {
                    alert("Role mismatch. Please try logging in with the correct role.");
                    return;
                }

                console.log("Login Successful");

                // Store userId, token, and role in localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);
                localStorage.setItem("role", userRole);  // Store role in localStorage

                // Update auth context
                setCurrentUser({ userId, userRole });

            
                navigate('/home')
            } else {
                alert('Incorrect password or email! Please try again.');
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert(err?.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center text-center vh-100"
                 style={{
                     marginTop: "80px",
                     background: "url('https://media.istockphoto.com/id/1365169514/video/learning-from-books-or-textbooks-and-the-internet-helps-create-new-ideas-slowly-moving.jpg?s=640x640&k=20&c=boT0zUPwwEHuIS-LXCbBdsx8D2KgtBLi_gNY2KR1bSA=') center/cover no-repeat, linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3))"
                 }}>
                <div className="bg-light p-3 rounded" style={{ width: '35%', marginLeft: '-35%' }}>
                    <h2 className="mb-3 text-primary">Login</h2>

                    {/* Role Selection Buttons */}
                    <div className="role-selection mb-3">
                        <button
                            className={`role-btn ${role === 'student' ? 'active' : ''}`}
                            onClick={() => setRole('student')}
                        >
                            Student
                        </button>
                        <button
                            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                            onClick={() => setRole('admin')}
                        >
                            Admin
                        </button>
                        <button
                            className={`role-btn ${role === 'content_admin' ? 'active' : ''}`}
                            onClick={() => setRole('content_admin')}
                        >
                           Content Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
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

                        <button disabled={loading} type="submit" className="btn btn-primary">
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </form>
                    <p className="container my-2">Don&apos;t have an account?</p>
                    <Link to="/register" className="btn btn-secondary">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
