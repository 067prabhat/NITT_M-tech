import Home from './Home';
import Login from './Login';
import Register from './Register';
import Courses from './courses';
import DataScience from './DataScience';
import Contact from './Contact';
import About from './About';
import NewCourse from './NewCourse';
import Navbar from './Navbar';
import Footer from './Footer';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import { BrowserRouter, Routes, Route, useNavigate, useRoutes } from "react-router-dom";
import { useAuth } from '../context/authContext';
import { useEffect } from 'react';
function App() {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    // If there's a userId in localStorage, update the auth state
    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    // If no user is logged in and trying to access protected routes, redirect to Register or Login
    if (!userIdFromStorage && !["/login", "/register"].includes(window.location.pathname)) {
      navigate("/register");
    }

    // If the user is already logged in and tries to access Login page, redirect to home
    if (userIdFromStorage && window.location.pathname === "/login") {
      navigate("/");
    }

    // Allow users to access Login and Register pages even if they are not logged in
    if (!userIdFromStorage && ["login", "register"].includes(window.location.pathname.slice(1))) {
      return;
    }
  }, [currentUser, navigate, setCurrentUser]);
  return (
    <div style={{ marginTop: '-3.5rem' }}>
      <>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/Courses" element={<Courses />} />
          <Route path="/DataScience" element={<DataScience />} /> 
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/add-course" element={<NewCourse />} />
          <Route path='/dashboard' element = {<Dashboard/>}/>
          <Route path='/AdminDashboard' element={<AdminDashboard/>}/>
        </Routes>
       
      <Footer/>
      </>
    </div>
  );
}

export default App;
