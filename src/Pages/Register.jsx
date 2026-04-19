import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock, Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Register = () => {
    const { register } = useAuth(); // assuming you have a register function
    const navigate = useNavigate();

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        register({ fname, lname, email, password });
        navigate("/login"); // redirect to login after successful registration
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1000,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                }}
            >
                {/* LEFT COLUMN */}
                <Box
                    sx={{
                        flex: 1,
                        p: 6,
                        display: "flex",
                        flexDirection: "column",
                        //justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" mb={2}>
                        Compassionate Care for Your Pets 🐾
                    </Typography>

                    <Typography sx={{ maxWidth: 400 }}>
                        Professional veterinary services with love and dedication.
                    </Typography>

                    <Box
                        component="img"
                        src="/Images/login.jpg"
                        alt="register visual"
                        sx={{
                            mt: 5,
                            width: "100%",
                            maxWidth: 350,
                            borderRadius: 4,
                        }}
                    />
                </Box>

                {/* RIGHT COLUMN */}
                <Box
                    sx={{
                        flex: 1,
                        p: 6,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ width: "100%", maxWidth: 400 }}>
                        <Typography variant="h4" fontWeight="bold" mb={1} align="center">
                            Create an Account
                        </Typography>

                        <Typography color="text.secondary" mb={4} align="center">
                            Join Today
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                placeholder="First Name"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Last Name"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Confirm Password"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                sx={{
                                    mt: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: "bold",
                                }}
                            >
                                Register
                            </Button>

                            <Divider sx={{ my: 3 }}>or sign up with</Divider>

                            <Button fullWidth variant="outlined" sx={{ py: 1.5 }}>
                                Google
                            </Button>

                            <Typography textAlign="center" mt={3}>
                                Already have an account?{" "}
                                <span
                                    style={{ color: "#1976d2", cursor: "pointer" }}
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;