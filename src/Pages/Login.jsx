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
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email);
        navigate("/book");
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
            {/* MAIN CARD */}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1000,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" }, // responsive
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
                        justifyContent: "center",
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
                        alt="login visual"
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
                            Welcome back!
                        </Typography>

                        <Typography color="text.secondary" mb={4} align="center">
                            Enter your email and password
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                placeholder="Username or email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                            <Typography
                                variant="body2"
                                sx={{
                                    textAlign: "right",
                                    mt: 1,
                                    color: "#1976d2",
                                    cursor: "pointer",
                                }}
                            >
                                Forgot Password?
                            </Typography>

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
                                Login
                            </Button>

                            <Divider sx={{ my: 3 }}>or login with</Divider>

                            <Button fullWidth variant="outlined" sx={{ py: 1.5 }}>
                                Google
                            </Button>

                            <Typography textAlign="center" mt={3}>
                                Don’t have an account?{" "}
                                <span 
                                    style={{ color: "#1976d2", cursor: "pointer" }}
                                    onClick={() => navigate("/register")}>
                                    Sign up
                                </span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;