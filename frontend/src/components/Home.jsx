import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import "./Home.css";
import "./ApplicationForm";

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
          <img src="images/NITT_Homepage.png" alt="" />
      </header>

      <div className="moving-text-wrapper">
        <div className="moving-text">
          🚨 Important Update: Please check the Notice Board for upcoming events! 🚨
          &nbsp;&nbsp;&nbsp;🆘 For assistance, contact our Helpline: <strong>1800-123-4567</strong> 🆘
          &nbsp;&nbsp;&nbsp;🏆 NIT Trichy is ranked <strong>9th</strong> in the NIRF Engineering Rankings 2023. 🏆
        </div>
      </div>

      <div className="container my-5">
        <div className="row">
        <div className="col-md-3">
  <section className="notice-board">
    <div>
      <div className="mainhead">
        <h4 className="section-title">
          <img src="images/Noticeboard.jpeg" className="section-icon" />Notice Board
        </h4>
      </div>
   <ul className="notice-list">
  <Link to="/notices" className="notice-item">
    Mid-term exams start next week. <img src="https://research.mgu.ac.in/wp-content/uploads/2021/07/new-icon-gif-4.gif" alt="New" />
  </Link>
  <Link to="/hostel-schedule" className="notice-item">
    Hostel scheduled on 5th Feb. <img src="https://research.mgu.ac.in/wp-content/uploads/2021/07/new-icon-gif-4.gif" alt="New" />
  </Link>
  <Link to="/work-ai" className="notice-item">
    Work AI: Register by 10th Feb. <img src="https://research.mgu.ac.in/wp-content/uploads/2021/07/new-icon-gif-4.gif" alt="New" />
  </Link>
  <Link to="/course-enrollment" className="notice-item">
    Date of course enrollment: 15th Feb. <img src="https://research.mgu.ac.in/wp-content/uploads/2021/07/new-icon-gif-4.gif" alt="New" />
  </Link>
</ul>
    </div>
  </section>
</div>

          <div className="col-md-6">
            <section className="image-slideshow">
              <Carousel>
                <Carousel.Item>
                  <img className="d-block" src="images/Library.jpeg" alt="Slide 1" />
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block" src="images/TP.jpeg" alt="Slide 2" />
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block" src="images/Nitt1.jpeg" alt="Slide 3" />
                </Carousel.Item>
              </Carousel>
            </section>
          </div>

          <div className="col-md-3">
  <section className="student-corner">
    <div>
      <div className="mainhead">
        <h4 className="section-title">
          <img src="images/Studentcorner.jpeg" className="section-icon" />Student Corner
        </h4>
      </div>
  <ul className="student-list">
  <Link to="/study-materials" className="student-item">Access your study materials</Link>
  <Link to="/assignments" className="student-item">Submit assignments</Link>
  <Link to="/timetable" className="student-item">Check your timetable</Link>
  <Link to="/grades" className="student-item">View your grades</Link>
</ul>
</div>
 </section>
</div>
</div>
</div>

<div className="apply-now-wrapper">
        <Link to="/ApplicationForm" className="apply-now-text">
        <img src="https://websitearchive2020.nepa.gov.jm/new/images/gif/new4.gif" alt="New" /> Apply Now for M.tech in Data Science and Machine Learning ! <img src="https://websitearchive2020.nepa.gov.jm/new/images/gif/new4.gif" alt="New" />
        </Link>
   </div>
      <div className="container my-5">
        <section className="about-section">
          <h2 className="text-center">About Us</h2>
          <div className="row align-items-center">
            <div className="col-md-6">
              <h3>Vision</h3>
              <p>To be a university globally trusted for technical excellence where learning and research integrate to sustain society and industry.</p>
              <h3>Mission</h3>
              <ul>
                <li>To offer undergraduate, postgraduate, doctoral and modular programs in emerging areas.</li>
                <li>To create a converging learning environment to serve a dynamically evolving society.</li>
                <li>To promote innovation for sustainable solutions.</li>
                <li>To be an intellectual ecosystem where human capabilities develop holistically.</li>
              </ul>
              <Link to="/About" className="btn btn-primary btn-sm mt-2">Read More</Link>
            </div>
            <div className="col-md-6 text-center">
              <img src="images/NITT-Main-Gate.jpeg" alt="About Us" className="about-image" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
