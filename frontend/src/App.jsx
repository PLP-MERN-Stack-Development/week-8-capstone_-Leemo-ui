import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
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
      <h2>Courses</h2>
      <div>
        {courses.map(c => (
          <div className="card" key={c._id}>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            <Link to={`/courses/${c._id}`}>View</Link>
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
  if (!course) return <div>Loading...</div>;
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p><b>Instructor:</b> {course.instructor?.name || "N/A"}</p>
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
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Register</button>
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
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
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
    </Router>
  );
}

export default App;
