import { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  PackageSearch,
  Briefcase,
  Users,
  Wrench,
  X,
} from "lucide-react";
import api from "./services/api";
import { useAuth } from "./context/AuthContext";

const menu = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/notices", label: "Notices", icon: Bell },
  { path: "/events", label: "Events", icon: CalendarDays },
  { path: "/complaints", label: "Complaints", icon: Wrench },
  { path: "/lost-found", label: "Lost & Found", icon: PackageSearch },
  { path: "/placements", label: "Placements", icon: Briefcase },
  { path: "/appointments", label: "Appointments", icon: CalendarDays },
  { path: "/classrooms", label: "Classrooms", icon: ClipboardList },
  { path: "/lab-equipment", label: "Lab Equipment", icon: Wrench },
];


function ClassroomPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    date: "",
    timeSlot: "",
    purpose: "",
  });

  useEffect(() => {
    api.get("/classrooms")
      .then((res) => setClassrooms(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const reserve = async (id) => {
    if (!form.date || !form.timeSlot || !form.purpose) {
      alert("Please fill all reservation details.");
      return;
    }

    try {
      await api.post(`/classrooms/${id}/reserve`, form);
      alert("Classroom reservation submitted successfully!");
      setForm({ date: "", timeSlot: "", purpose: "" });
      setSelected(null);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to reserve classroom");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Classroom Reservations</h1>
          <p>Reserve classrooms for academic activities.</p>
        </div>
      </div>

      <div className="data-grid">
        {classrooms.length === 0 ? (
          <div className="card">
            <p>No classrooms available.</p>
          </div>
        ) : (
          classrooms.map((room) => (
            <div className="card" key={room._id}>
              <h3>{room.roomNumber || room.name || room.classroomName || "Classroom"}</h3>

              {room.building && <p>🏢 {room.building}</p>}
              {room.capacity && <p>👥 Capacity: {room.capacity}</p>}
              {room.description && <p>{room.description}</p>}

              <button
                className="btn primary"
                onClick={() => setSelected(room._id)}
              >
                Reserve
              </button>

              {selected === room._id && (
                <div style={{ marginTop: "18px" }}>

                  {room.reservations?.length > 0 && (
                    <div style={{
                      marginBottom: "18px",
                      padding: "12px",
                      background: "#f8fafc",
                      borderRadius: "10px"
                    }}>
                      <strong>Reservations</strong>
                      {room.reservations.map((reservation) => (
                        <div
                          key={reservation._id}
                          style={{
                            marginTop: "10px",
                            padding: "10px",
                            background: "white",
                            borderRadius: "8px"
                          }}
                        >
                          <div>📅 {reservation.date}</div>
                          <div>🕐 {reservation.timeSlot}</div>
                          <div>📝 {reservation.purpose}</div>

                          <select
                            value={reservation.status || "Pending"}
                            onChange={async (e) => {
                              const newStatus = e.target.value;

                              try {
                                const response = await api.put(
                                  `/classrooms/${room._id}/reservations/${reservation._id}`,
                                  { status: newStatus }
                                );

                                setClassrooms((current) =>
                                  current.map((r) =>
                                    r._id === room._id
                                      ? {
                                          ...r,
                                          reservations:
                                            r.reservations.map((x) =>
                                              x._id === reservation._id
                                                ? {
                                                    ...x,
                                                    status:
                                                      response.data?.status ||
                                                      newStatus,
                                                  }
                                                : x
                                            ),
                                        }
                                      : r
                                  )
                                );
                              } catch (err) {
                                alert(
                                  err.response?.data?.message ||
                                  "Unable to update reservation"
                                );
                              }
                            }}
                            style={{
                              marginTop: "8px",
                              padding: "8px",
                              borderRadius: "8px",
                              border: "1px solid #dbe1ea",
                              width: "100%"
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      border: "1px solid #dbe1ea",
                      borderRadius: "8px",
                    }}
                  />

                  <select
                    value={form.timeSlot}
                    onChange={(e) =>
                      setForm({ ...form, timeSlot: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      border: "1px solid #dbe1ea",
                      borderRadius: "8px",
                      background: "white",
                    }}
                  >
                    <option value="">Select time slot</option>
                    <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
                    <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                    <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                    <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Purpose"
                    value={form.purpose}
                    onChange={(e) =>
                      setForm({ ...form, purpose: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      border: "1px solid #dbe1ea",
                      borderRadius: "8px",
                    }}
                  />

                  <button
                    className="btn primary"
                    onClick={() => reserve(room._id)}
                  >
                    Submit Reservation
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


function LabEquipmentPage() {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    api.get("/lab-equipment")
      .then((res) => setEquipment(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const bookEquipment = async (id) => {
    try {
      await api.post(`/lab-equipment/${id}/book`);
      alert("Equipment booked successfully!");

      const res = await api.get("/lab-equipment");
      setEquipment(res.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to book equipment");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Lab Equipment</h1>
          <p>View and book available laboratory equipment.</p>
        </div>
      </div>

      <div className="data-grid">
        {equipment.length === 0 ? (
          <div className="card">
            <p>No laboratory equipment available.</p>
          </div>
        ) : (
          equipment.map((item) => (
            <div className="card" key={item._id}>
              <h3>{item.equipmentName || "Equipment"}</h3>

              <p>
                Available: {item.available ?? 0} / {item.quantity ?? 0}
              </p>

              {item.description && <p>{item.description}</p>}

              {item.bookings?.length > 0 && (
                <div style={{
                  marginTop: "15px",
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "10px"
                }}>
                  <strong>Bookings</strong>

                  {item.bookings.map((booking) => (
                    <div
                      key={booking._id}
                      style={{
                        marginTop: "8px",
                        padding: "8px",
                        background: "white",
                        borderRadius: "8px"
                      }}
                    >
                      <div>📅 {booking.date || "Booking"}</div>
                      <div>📌 {booking.status || "Booked"}</div>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="btn primary"
                disabled={(item.available ?? 0) <= 0}
                onClick={() => bookEquipment(item._id)}
              >
                {(item.available ?? 0) > 0 ? "Book Equipment" : "Unavailable"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><GraduationCap size={25} /></div>
          <div>
            <strong>CampusConnect</strong>
            <span>Smart Campus Hub</span>
          </div>
          <button className="close-menu" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav>
          {menu.map(({ path, label, icon: Icon }) => (
            <button
              key={path}
              className="nav-item"
              onClick={() => {
                navigate(path);
                setOpen(false);
              }}
            >
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>

        <button
          className="logout"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
          <div>
            <h2>CampusConnect</h2>
            <span>{user?.role?.toUpperCase()} PORTAL</span>
          </div>
          <div className="profile">
            <div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.email}</small>
            </div>
          </div>
        </header>

        <section className="content">{children}</section>
      </main>
    </div>
  );
}

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="brand-icon"><GraduationCap size={25} /></div>
          <strong>CampusConnect</strong>
        </div>
        <div>
          <button className="btn secondary" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn primary" onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-text">
          <div className="eyebrow">SMART CAMPUS RESOURCE HUB</div>
          <h1>Everything your campus needs, <span>connected.</span></h1>
          <p>
            One centralized platform for notices, events, complaints,
            placements, appointments, resources and everyday campus services.
          </p>
          <div className="hero-actions">
            <button className="btn primary big" onClick={() => navigate("/login")}>
              Enter CampusConnect
            </button>
            <button className="btn secondary big" onClick={() => navigate("/register")}>
              Create Account
            </button>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-head">
            <div className="brand-icon"><GraduationCap size={22} /></div>
            <div>
              <strong>Campus Overview</strong>
              <span>Everything in one place</span>
            </div>
          </div>
          <div className="mini-grid">
            <div><Bell /><b>Notices</b><span>Stay updated</span></div>
            <div><CalendarDays /><b>Events</b><span>Never miss out</span></div>
            <div><Briefcase /><b>Placements</b><span>Career updates</span></div>
            <div><Wrench /><b>Services</b><span>Raise requests</span></div>
          </div>
        </div>
      </div>

      <div className="features">
        <div><Users /><b>Role-based access</b><span>Student, faculty and admin portals</span></div>
        <div><Megaphone /><b>Centralized communication</b><span>Important campus information</span></div>
        <div><ClipboardList /><b>Digital services</b><span>Requests and reservations online</span></div>
      </div>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon"><GraduationCap size={25} /></div>
          <strong>CampusConnect</strong>
        </div>
        <div>
          <div className="eyebrow">SMART CAMPUS PLATFORM</div>
          <h1>Your campus.<br /><span>One connection.</span></h1>
          <p>Access campus services, announcements, placements and resources from one secure platform.</p>
        </div>
      </div>

      <div className="auth-card">
        <button className="back-link" onClick={() => navigate("/")}>← Back to home</button>
        <h2>Welcome back</h2>
        <p>Sign in to your CampusConnect account.</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn primary full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")}>Create one</button>
        </p>
      </div>
    </div>
  );
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await api.post("/auth/register", form);
      setMessage("Account created successfully. You can now sign in.");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon"><GraduationCap size={25} /></div>
          <strong>CampusConnect</strong>
        </div>
        <div>
          <div className="eyebrow">JOIN YOUR CAMPUS</div>
          <h1>Get connected.<br /><span>Get involved.</span></h1>
          <p>Create your student account and access digital campus services.</p>
        </div>
      </div>

      <div className="auth-card">
        <button className="back-link" onClick={() => navigate("/")}>← Back to home</button>
        <h2>Create account</h2>
        <p>Register as a student to get started.</p>

        {error && <div className="error-box">{error}</div>}
        {message && <div className="success-box">{message}</div>}

        <form onSubmit={submit}>
          <label>Full Name</label>
          <input
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={6}
            required
          />

          <button className="btn primary full">Create Account</button>
        </form>

        <p className="auth-footer">
          Already registered?{" "}
          <button onClick={() => navigate("/login")}>Sign in</button>
        </p>
      </div>
    </div>
  );
}

function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card centered">
        <div className="brand-icon large"><GraduationCap size={30} /></div>
        <h2>Password recovery</h2>
        <p>Password recovery can be connected to Nodemailer when the email workflow is enabled.</p>
        <button className="btn primary full" onClick={() => navigate("/login")}>
          Back to Login
        </button>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    notices: 0,
    events: 0,
    placements: 0,
    complaints: 0,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [n, e, p, c] = await Promise.all([
          api.get("/notices"),
          api.get("/events"),
          api.get("/placements"),
          api.get("/complaints"),
        ]);

        setStats({
          notices: n.data.length,
          events: e.data.length,
          placements: p.data.length,
          complaints: c.data.length,
        });
      } catch {
        // Dashboard remains usable if one endpoint is unavailable.
      }
    };

    load();
  }, []);

  const cards = [
    { label: "Notices", value: stats.notices, icon: Bell, path: "/notices" },
    { label: "Events", value: stats.events, icon: CalendarDays, path: "/events" },
    { label: "Placements", value: stats.placements, icon: Briefcase, path: "/placements" },
    { label: "Complaints", value: stats.complaints, icon: Wrench, path: "/complaints" },
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">OVERVIEW</div>
          <h1>Good to see you, {user?.name?.split(" ")[0]} 👋</h1>
          <p>Here’s what’s happening across your campus.</p>
        </div>
      </div>

      <div className="stat-grid">
        {cards.map(({ label, value, icon: Icon, path }) => (
          <button className="stat-card" key={label} onClick={() => navigate(path)}>
            <div className="stat-icon"><Icon size={21} /></div>
            <div><span>{label}</span><strong>{value}</strong></div>
            <small>View →</small>
          </button>
        ))}
      </div>

      <div className="welcome-panel">
        <div>
          <span className="eyebrow">CAMPUSCONNECT</span>
          <h2>Your campus services, simplified.</h2>
          <p>
            Explore announcements, upcoming events, placement opportunities
            and digital campus services from the sidebar.
          </p>
        </div>
        <GraduationCap size={90} strokeWidth={1} />
      </div>
    </>
  );
}

function ModulePage({ title, description, endpoint, icon: Icon }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(endpoint)
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err.response?.data?.message || "Unable to load data"));
  }, [endpoint]);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">CAMPUS SERVICE</div>
          <h1><Icon size={28} /> {title}</h1>
          <p>{description}</p>
        </div>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="data-grid">
        {items.length === 0 && !error ? (
          <div className="empty-card">No {title.toLowerCase()} available.</div>
        ) : (
          items.map((item) => (
            <div className="data-card" key={item._id}>

              {title === "Placements" ? (
                <>
                  <h3>{item.company || item.companyName || item.organization || item.name || "Company"}</h3>

                  <p>
                    <strong>{item.position || item.role || "Software Engineer"}</strong>
                  </p>

                  {item.description && (
                    <p>{item.description}</p>
                  )}

                  <div className="data-meta">
                    {item.package && <span>💰 {item.package}</span>}
                    {item.salary && <span>💰 {item.salary}</span>}
                    {item.location && <span>📍 {item.location}</span>}
                    {item.eligibility && <span>🎓 CGPA: {item.eligibility}</span>}
                  </div>

                  <button
                    className="btn primary"
                    style={{ marginTop: "18px", whiteSpace: "nowrap", minWidth: "120px" }}
                    onClick={async () => {
                      try {
                        await api.post(`/placements/${item._id}/apply`);
                        alert("Application submitted successfully!");
                      } catch (err) {
                        alert(
                          err.response?.data?.message ||
                          "Unable to apply"
                        );
                      }
                    }}
                  >
                    Apply Now
                  </button>
                </>
              ) : (
                <>
                  <h3>
                    {item.title ||
                      item.name ||
                      item.company ||
                      item.equipmentName ||
                      "Campus Update"}
                  </h3>

                  <p>
                    {item.description ||
                      item.message ||
                      item.role ||
                      "Campus information"}
                  </p>

                  <div className="data-meta">
                    {item.date && <span>📅 {item.date}</span>}
                    {item.location && <span>📍 {item.location}</span>}
                    {item.status && <span className="badge">{item.status}</span>}
                  </div>

                  {title === "Appointments" && (
                    <select
                      value={item.status || "Pending"}
                      onChange={async (e) => {
                        const newStatus = e.target.value;

                        try {
                          const response = await api.put(
                            `/appointments/${item._id}`,
                            { status: newStatus }
                          );

                          setItems((current) =>
                            current.map((x) =>
                              x._id === item._id
                                ? {
                                    ...x,
                                    status:
                                      response.data?.status || newStatus,
                                  }
                                : x
                            )
                          );
                        } catch (err) {
                          alert(
                            err.response?.data?.message ||
                            "Unable to update appointment"
                          );
                        }
                      }}
                      style={{
                        marginTop: "15px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #dbe1ea",
                        width: "100%",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  )}

                  {title === "Complaints" && (
                    <select
                      value={item.status || "Pending"}
                      onChange={async (e) => {
                        const newStatus = e.target.value;

                        try {
                          const response = await api.put(
                            `/complaints/${item._id}`,
                            { status: newStatus }
                          );

                          setItems((current) =>
                            current.map((x) =>
                              x._id === item._id
                                ? {
                                    ...x,
                                    status:
                                      response.data?.status || newStatus,
                                  }
                                : x
                            )
                          );
                        } catch (err) {
                          console.error(err);
                          alert(
                            err.response?.data?.message ||
                            "Unable to update complaint"
                          );
                        }
                      }}
                      style={{
                        marginTop: "15px",
                        padding: "10px",
                        borderRadius: "8px",
                        border: "1px solid #dbe1ea",
                        width: "100%",
                        background: "white",
                        cursor: "pointer",
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  )}
                </>
              )}

            </div>
          ))
        )}
      </div>
    </>
  );
}

function Protected({ children }) {
  const { user } = useAuth();
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/student" element={<Protected><Dashboard /></Protected>} />
      <Route path="/faculty" element={<Protected><Dashboard /></Protected>} />
      <Route path="/admin" element={<Protected><Dashboard /></Protected>} />

      <Route path="/notices" element={
        <Protected><ModulePage title="Notices" description="Important announcements from your campus." endpoint="/notices" icon={Bell} /></Protected>
      } />

      <Route path="/events" element={
        <Protected><ModulePage title="Events" description="Discover upcoming campus events and activities." endpoint="/events" icon={CalendarDays} /></Protected>
      } />

      <Route path="/complaints" element={
        <Protected><ModulePage title="Complaints" description="Track and manage campus service requests." endpoint="/complaints" icon={Wrench} /></Protected>
      } />

      <Route path="/lost-found" element={
        <Protected><ModulePage title="Lost & Found" description="Find or report items around campus." endpoint="/lost-found" icon={PackageSearch} /></Protected>
      } />

      <Route path="/placements" element={
        <Protected><ModulePage title="Placements" description="Explore the latest placement opportunities." endpoint="/placements" icon={Briefcase} /></Protected>
      } />

      <Route path="/appointments" element={
        <Protected><ModulePage title="Appointments" description="Manage your campus appointments." endpoint="/appointments" icon={ClipboardList} /></Protected>
      } />

      <Route path="/classrooms" element={
        <Protected><ClassroomPage /></Protected>
      } />

      <Route path="/lab-equipment" element={
        <Protected><LabEquipmentPage /></Protected>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
