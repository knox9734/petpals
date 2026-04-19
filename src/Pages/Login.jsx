import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PetsIcon from "@mui/icons-material/Pets";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
                backgroundColor: "#f5f7fb",
            }}
        >
            {/* ── LEFT PANEL ── */}
            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    flex: "0 0 45%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "linear-gradient(155deg, #0d1b2a 0%, #1565c0 60%, #0097a7 100%)",
                    p: 6,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative paw watermarks */}
                {[...Array(5)].map((_, i) => (
                    <PetsIcon
                        key={i}
                        sx={{
                            position: "absolute",
                            fontSize: `${80 + i * 40}px`,
                            opacity: 0.05,
                            top: `${8 + i * 18}%`,
                            left: i % 2 === 0 ? `${-5 + i * 10}%` : "auto",
                            right: i % 2 !== 0 ? `${5 + i * 8}%` : "auto",
                            transform: `rotate(${i * 30}deg)`,
                            pointerEvents: "none",
                        }}
                    />
                ))}

                <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 420 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 5 }}>
                        <PetsIcon sx={{ color: "#64d9fb", fontSize: 36 }} />
                        <Typography fontWeight={800} fontSize="1.4rem" color="white">
                            PetPals Clinic
                        </Typography>
                    </Box>

                    <Box
                        component="img"
                        src="/Images/login.jpg"
                        alt="Pets at clinic"
                        sx={{
                            width: "100%",
                            maxWidth: 380,
                            borderRadius: "24px",
                            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                            mb: 5,
                        }}
                    />

                    <Typography
                        sx={{ color: "white", fontWeight: 800, fontSize: "1.7rem", lineHeight: 1.3, mb: 2 }}
                    >
                        Compassionate Care for Your Beloved Pets
                    </Typography>

                    <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.8 }}>
                        Professional veterinary services delivered with love, expertise, and genuine dedication.
                    </Typography>
                </Box>
            </Box>

            {/* ── RIGHT PANEL ── */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: { xs: 3, md: 6 },
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 420 }}>
                    {/* Mobile logo */}
                    <Box
                        sx={{
                            display: { xs: "flex", md: "none" },
                            alignItems: "center",
                            gap: 1,
                            mb: 4,
                        }}
                    >
                        <PetsIcon sx={{ color: "#1565c0", fontSize: 28 }} />
                        <Typography fontWeight={800} fontSize="1.1rem" color="#0d1b2a">
                            PetPals Clinic
                        </Typography>
                    </Box>

                    <Typography
                        sx={{ fontSize: "2rem", fontWeight: 800, color: "#0d1b2a", mb: 0.5 }}
                    >
                        Welcome back
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mb: 4, fontSize: "0.95rem" }}>
                        Sign in to your account to continue
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Email field */}
                        <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#0d1b2a", mb: 0.8 }}>
                            Email address
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="you@example.com"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailOutlinedIcon sx={{ color: "#9aa5b4", fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Password field */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2.5, mb: 0.8 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#0d1b2a" }}>
                                Password
                            </Typography>
                            <Typography
                                sx={{ fontSize: "0.82rem", color: "#1565c0", cursor: "pointer", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}
                            >
                                Forgot password?
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            placeholder="Enter your password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={fieldStyle}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon sx={{ color: "#9aa5b4", fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword
                                                ? <VisibilityOff sx={{ fontSize: 18, color: "#9aa5b4" }} />
                                                : <Visibility sx={{ fontSize: 18, color: "#9aa5b4" }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Sign in button */}
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            size="large"
                            sx={{
                                mt: 4,
                                py: 1.6,
                                borderRadius: "12px",
                                fontWeight: 700,
                                fontSize: "1rem",
                                textTransform: "none",
                                background: "linear-gradient(135deg, #1565c0, #0097a7)",
                                boxShadow: "0 8px 24px rgba(21,101,192,0.35)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #0d47a1, #00838f)",
                                    boxShadow: "0 12px 32px rgba(21,101,192,0.45)",
                                    transform: "translateY(-1px)",
                                },
                                transition: "all 0.25s ease",
                            }}
                        >
                            Sign in
                        </Button>

                        {/* Divider */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
                            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e5e9ef" }} />
                            <Typography sx={{ fontSize: "0.8rem", color: "#9aa5b4", whiteSpace: "nowrap" }}>
                                or continue with
                            </Typography>
                            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e5e9ef" }} />
                        </Box>

                        {/* Google button */}
                        <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            sx={{
                                py: 1.5,
                                borderRadius: "12px",
                                fontWeight: 600,
                                fontSize: "0.95rem",
                                textTransform: "none",
                                color: "#0d1b2a",
                                borderColor: "#dde3ed",
                                backgroundColor: "white",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                                display: "flex",
                                gap: 1.5,
                                "&:hover": {
                                    borderColor: "#c5cdd9",
                                    backgroundColor: "#f9fbfc",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src="https://www.google.com/favicon.ico"
                                alt="Google"
                                sx={{ width: 18, height: 18 }}
                            />
                            Continue with Google
                        </Button>

                        {/* Sign up link */}
                        <Typography textAlign="center" mt={4} sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                            Don't have an account?{" "}
                            <Box
                                component="span"
                                onClick={() => navigate("/register")}
                                sx={{ color: "#1565c0", fontWeight: 700, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                            >
                                Create one
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const fieldStyle = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
        fontSize: "0.95rem",
        "& fieldset": { borderColor: "#dde3ed" },
        "&:hover fieldset": { borderColor: "#b0bec5" },
        "&.Mui-focused fieldset": { borderColor: "#1565c0", borderWidth: "1.5px" },
    },
};

export default Login;
