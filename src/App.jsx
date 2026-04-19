import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import BookAppointment from "./Pages/BookAppointment";
import Dashboard from "./Pages/Dashboard";
import { useAuth } from "./Context/AuthContext";

const App = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Pet Clinic</Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {!user && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!user && <Button color="inherit" component={Link} to="/register">Register</Button>}
          {user && <Button color="inherit" component={Link} to="/book">Book Appointment</Button>}
          {user && <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>}
          {user && <Button color="inherit" onClick={logout}>Logout</Button>}
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Container sx={{ mt: 4 }}><Login /></Container>} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Container sx={{ mt: 4 }}><Register /></Container>} />
        <Route path="/dashboard" element={!user ? <Navigate to="/login" /> : <Container sx={{ mt: 4 }}><Dashboard /></Container>} />
        <Route path="/book" element={<Container sx={{ mt: 4 }}><BookAppointment /></Container>} />
      </Routes>
    </>
  );
};

export default App;