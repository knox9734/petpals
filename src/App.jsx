import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Chip } from "@mui/material";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import BookAppointment from "./Pages/BookAppointment";
import Dashboard from "./Pages/Dashboard";
import StaffPanel from "./Pages/StaffPanel";
import StaffRegister from "./Pages/StaffRegister";
import { useAuth } from "./Context/AuthContext";

const App = () => {
  const { user, logout } = useAuth();
  const isStaff = user?.is_staff || user?.is_superuser;

  // Where to land after login
  const homeRoute = isStaff ? "/staff" : "/dashboard";

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Pet Clinic</Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {!user && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!user && <Button color="inherit" component={Link} to="/register">Register</Button>}
          {user && !isStaff && <Button color="inherit" component={Link} to="/book">Book Appointment</Button>}
          {user && !isStaff && <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>}
          {isStaff && (
            <Button color="inherit" component={Link} to="/staff">
              Staff Panel
              <Chip label="Staff" size="small"
                sx={{ ml: 0.8, height: 18, fontSize: "0.65rem", fontWeight: 700, backgroundColor: "#ffc107", color: "#0d1b2a", pointerEvents: "none" }} />
            </Button>
          )}
          {user && <Button color="inherit" onClick={logout}>Logout</Button>}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/login"          element={user ? <Navigate to={homeRoute} /> : <Container sx={{ mt: 4 }}><Login /></Container>} />
        <Route path="/register"       element={user ? <Navigate to={homeRoute} /> : <Container sx={{ mt: 4 }}><Register /></Container>} />
        <Route path="/staff/register" element={user ? <Navigate to={homeRoute} /> : <Container sx={{ mt: 4 }}><StaffRegister /></Container>} />
        <Route path="/dashboard"      element={!user ? <Navigate to="/login" /> : isStaff ? <Navigate to="/staff" /> : <Container sx={{ mt: 4 }}><Dashboard /></Container>} />
        <Route path="/book"           element={!user ? <Navigate to="/login" /> : isStaff ? <Navigate to="/staff" /> : <Container sx={{ mt: 4 }}><BookAppointment /></Container>} />
        <Route path="/staff"          element={!user ? <Navigate to="/login" /> : !isStaff ? <Navigate to="/dashboard" /> : <StaffPanel />} />
      </Routes>
    </>
  );
};

export default App;
