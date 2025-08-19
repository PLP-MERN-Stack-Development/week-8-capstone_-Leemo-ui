import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

const API_URL = "http://localhost:5000/api";
const socket = io("http://localhost:5000");

function CourseList() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then(res => res.json())
      .then(setCourses);
    socket.on("courseCreated", (course) => {
      setCourses(prev => [...prev, course]);
    });
    return () => socket.off("courseCreated");
  }, []);
  return (
    <div>
      <h2 className="fancy-title">🚀 Explore Our Courses! 🚀</h2>
      <div className="course-list">
        {courses.map(c => (
          <div className="card fancy-card" key={c._id}>
            <h3>{c.title} 🎓</h3>
            <p>{c.description}</p>
            <Link className="fancy-btn" to={`/courses/${c._id}`}>✨ View ✨</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseDetail({ courseId }) {
  const [course, setCourse] = useState(null);
  useEffect(() => {
    fetch(`${API_URL}/courses/${courseId}`)
      .then(res => res.json())
      .then(setCourse);
  }, [courseId]);
  if (!course) return <div className="loading">Loading... ⏳</div>;
  return (
    <div className="card fancy-card">
      <h2>{course.title} 🎉</h2>
      <p>{course.description}</p>
      <p><b>Instructor:</b> {course.instructor?.name || "N/A"} 👨‍🏫</p>
    </div>
  );
}

function CourseDetailWrapper() {
  const { courseId } = useParams();
  return <CourseDetail courseId={courseId} />;
}

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="card fancy-card">
      <h2>📝 Register Now!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input className="fancy-input" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input className="fancy-input" name="email" value={form.email} onChange={handleChange} type="email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="fancy-input" name="password" value={form.password} onChange={handleChange} type="password" />
        </div>
        {error && <div className="error-message">{error} 😱</div>}
        <button className="fancy-btn" type="submit">🎉 Register 🎉</button>
      </form>
    </div>
  );
}

function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="card fancy-card">
      <h2>🔑 Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input className="fancy-input" name="email" value={form.email} onChange={handleChange} type="email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input className="fancy-input" name="password" value={form.password} onChange={handleChange} type="password" />
        </div>
        {error && <div className="error-message">{error} 😱</div>}
        <button className="fancy-btn" type="submit">🚀 Login 🚀</button>
      </form>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  return (
    <>
      <style>{`
        body {
          font-family: 'Poppins', 'Comic Sans MS', cursive, sans-serif;
          background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
          min-height: 100vh;
        }
        .fancy-title {
          font-size: 2.5rem;
          text-align: center;
          margin: 2rem 0 1rem 0;
          color: #ff5e62;
          text-shadow: 2px 2px 10px #fff176, 0 0 20px #ff5e62;
          animation: pop 1s infinite alternate;
        }
        @keyframes pop {
          0% { transform: scale(1);}
          100% { transform: scale(1.05);}
        }
        nav {
          background: linear-gradient(90deg, #ff5e62 0%, #ff9966 100%);
          padding: 1.2rem 0;
          text-align: center;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px #ff5e6240;
        }
        nav a {
          color: #fff;
          font-weight: bold;
          font-size: 1.2rem;
          margin: 0 1.5rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        nav a:hover {
          color: #fff176;
          text-shadow: 0 0 10px #fff176;
        }
        .course-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2rem;
        }
        .fancy-card {
          background: linear-gradient(135deg, #fff176 0%, #fcb69f 100%);
          border-radius: 2rem;
          box-shadow: 0 8px 32px #ff5e6240, 0 1.5px 8px #fcb69f80;
          padding: 2rem 2.5rem;
          margin: 1.5rem 0;
          max-width: 350px;
          min-width: 270px;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 3px solid #ff5e62;
          animation: float 2s infinite alternate;
        }
        @keyframes float {
          0% { transform: translateY(0);}
          100% { transform: translateY(-10px);}
        }
        .fancy-card:hover {
          transform: scale(1.04) rotate(-2deg);
          box-shadow: 0 16px 48px #ff5e6290;
        }
        .fancy-btn {
          background: linear-gradient(90deg, #ff5e62 0%, #ff9966 100%);
          color: #fff;
          border: none;
          border-radius: 1.5rem;
          padding: 0.7rem 2rem;
          font-size: 1.1rem;
          font-weight: bold;
          margin-top: 1rem;
          cursor: pointer;
          box-shadow: 0 2px 8px #ff5e6240;
          transition: background 0.2s, transform 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .fancy-btn:hover {
          background: linear-gradient(90deg, #fff176 0%, #ff5e62 100%);
          color: #ff5e62;
          transform: scale(1.08) rotate(2deg);
          box-shadow: 0 4px 16px #fff17680;
        }
        .fancy-input {
          border: 2px solid #ff5e62;
          border-radius: 1rem;
          padding: 0.6rem 1rem;
          font-size: 1rem;
          margin-top: 0.3rem;
          margin-bottom: 1rem;
          width: 100%;
          background: #fffbe7;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .fancy-input:focus {
          border: 2px solid #fff176;
          box-shadow: 0 0 8px #fff17680;
          outline: none;
        }
        .form-group label {
          font-weight: bold;
          color: #ff5e62;
        }
        .error-message {
          color: #fff;
          background: #ff5e62;
          border-radius: 1rem;
          padding: 0.7rem 1rem;
          margin: 1rem 0;
          font-weight: bold;
          text-align: center;
          box-shadow: 0 2px 8px #ff5e6240;
          animation: shake 0.5s;
        }
        @keyframes shake {
          0% { transform: translateX(0);}
          25% { transform: translateX(-5px);}
          50% { transform: translateX(5px);}
          75% { transform: translateX(-5px);}
          100% { transform: translateX(0);}
        }
        .loading {
          font-size: 2rem;
          color: #ff5e62;
          text-align: center;
          margin-top: 3rem;
          animation: pop 1s infinite alternate;
        }
      `}</style>
      <nav>
        <Link to="/">Courses</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/login">Login</Link>
      </nav>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:courseId" element={<CourseDetailWrapper />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
      </Routes>
    </>
  );
}

export default App;
