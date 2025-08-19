import React, { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

const API_URL = "http://localhost:5000/api";
const socket = io("http://localhost:5000");

// User context for authentication
const UserContext = createContext();
export function useUser() {
  return useContext(UserContext);
}

// Sample courses for fallback/demo
const SAMPLE_COURSES = [
  {
    _id: "1",
    title: "Introduction to Programming",
    description: "Learn the basics of programming using Python.",
    instructor: { name: "Alice Johnson" }
  },
  {
    _id: "2",
    title: "Web Development Bootcamp",
    description: "Become a full-stack web developer with HTML, CSS, JS, and React.",
    instructor: { name: "Bob Smith" }
  },
  {
    _id: "3",
    title: "Data Science Essentials",
    description: "Explore data analysis, visualization, and machine learning.",
    instructor: { name: "Carol Lee" }
  }
];

function CourseList() {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then(res => res.json())
      .then(data => {
        // If backend returns empty, use sample courses for demo
        if (Array.isArray(data) && data.length === 0) {
          setCourses(SAMPLE_COURSES);
        } else {
          setCourses(data);
        }
      })
      .catch(() => setCourses(SAMPLE_COURSES));
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
            <p><b>Instructor:</b> {c.instructor?.name || "N/A"} 👨‍🏫</p>
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
      .then(setCourse)
      .catch(() => {
        // fallback to sample course if not found
        setCourse(SAMPLE_COURSES.find(c => c._id === courseId));
      });
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Add credentials: "include" if your backend uses cookies for auth
        // credentials: "include",
        body: JSON.stringify(form)
      });
      // Check for network errors
      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        setError(data.error || data.message || "Registration failed");
        setLoading(false);
        return;
      }
      navigate("/login");
    } catch (err) {
      setError("Could not connect to server. Please check your backend is running and CORS is configured.");
    }
    setLoading(false);
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
        <button className="fancy-btn" type="submit" disabled={loading}>
          {loading ? "Registering..." : "🎉 Register 🎉"}
        </button>
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

  // Logout handler
  const handleLogout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <>
        <style>{`
          body {
            font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #1a2233 0%, #232946 100%);
            min-height: 100vh;
            color: #e0e6ed;
          }
          .fancy-title {
            font-size: 2.5rem;
            text-align: center;
            margin: 2rem 0 1rem 0;
            color: #8da9c4;
            text-shadow: 2px 2px 10px #232946, 0 0 20px #232946;
            animation: pop 1s infinite alternate;
          }
          @keyframes pop {
            0% { transform: scale(1);}
            100% { transform: scale(1.05);}
          }
          nav {
            background: linear-gradient(90deg, #232946 0%, #1a2233 100%);
            padding: 1.2rem 0;
            text-align: center;
            margin-bottom: 2rem;
            box-shadow: 0 4px 20px #23294680;
          }
          nav a {
            color: #e0e6ed;
            font-weight: bold;
            font-size: 1.2rem;
            margin: 0 1.5rem;
            text-decoration: none;
            transition: color 0.2s;
          }
          nav a:hover {
            color: #8da9c4;
            text-shadow: 0 0 10px #8da9c4;
          }
          .course-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 2rem;
          }
          .fancy-card {
            background: linear-gradient(135deg, #232946 0%, #1a2233 100%);
            border-radius: 2rem;
            box-shadow: 0 8px 32px #23294680, 0 1.5px 8px #1a223380;
            padding: 2rem 2.5rem;
            margin: 1.5rem 0;
            max-width: 350px;
            min-width: 270px;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 3px solid #8da9c4;
            animation: float 2s infinite alternate;
          }
          @keyframes float {
            0% { transform: translateY(0);}
            100% { transform: translateY(-10px);}
          }
          .fancy-card:hover {
            transform: scale(1.04) rotate(-2deg);
            box-shadow: 0 16px 48px #232946cc;
          }
          .fancy-btn {
            background: linear-gradient(90deg, #232946 0%, #1a2233 100%);
            color: #e0e6ed;
            border: none;
            border-radius: 1.5rem;
            padding: 0.7rem 2rem;
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 1rem;
            cursor: pointer;
            box-shadow: 0 2px 8px #23294680;
            transition: background 0.2s, transform 0.2s, color 0.2s;
            text-decoration: none;
            display: inline-block;
          }
          .fancy-btn:hover {
            background: linear-gradient(90deg, #8da9c4 0%, #232946 100%);
            color: #232946;
            transform: scale(1.08) rotate(2deg);
            box-shadow: 0 4px 16px #8da9c480;
          }
          .fancy-input {
            border: 2px solid #8da9c4;
            border-radius: 1rem;
            padding: 0.6rem 1rem;
            font-size: 1rem;
            margin-top: 0.3rem;
            margin-bottom: 1rem;
            width: 100%;
            background: #161b22;
            color: #e0e6ed;
            transition: border 0.2s, box-shadow 0.2s;
          }
          .fancy-input:focus {
            border: 2px solid #e0e6ed;
            box-shadow: 0 0 8px #8da9c480;
            outline: none;
          }
          .form-group label {
            font-weight: bold;
            color: #8da9c4;
          }
          .error-message {
            color: #fff;
            background: #232946;
            border-radius: 1rem;
            padding: 0.7rem 1rem;
            margin: 1rem 0;
            font-weight: bold;
            text-align: center;
            box-shadow: 0 2px 8px #23294680;
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
            color: #8da9c4;
            text-align: center;
            margin-top: 3rem;
            animation: pop 1s infinite alternate;
          }
        `}</style>
        <nav>
          <Link to="/">Courses</Link> |{" "}
          <Link to="/courses">All Courses</Link> |{" "}
          {!user && <><Link to="/register">Register</Link> | <Link to="/login">Login</Link></>}
          {user && (
            <>
              <span style={{ color: "#8da9c4", marginLeft: "1rem" }}>
                Welcome, {user.name}
              </span>
              <button className="fancy-btn" style={{ marginLeft: "1rem" }} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
        <Routes>
          <Route path="/" element={<CourseList />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId" element={<CourseDetailWrapper />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
        </Routes>
      </>
    </UserContext.Provider>
  );
}

export default App;
