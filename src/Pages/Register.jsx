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
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const perks = [
    "Easy online appointment booking",
    "Pet health records in one place",
    "Reminders for vaccinations & checkups",
    "24/7 emergency support access",
];

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        register({ fname, lname, email, password });
        navigate("/login");
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", backgroundColor: "#f5f7fb" }}>

            {/* ── LEFT PANEL ── */}
            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    flex: "0 0 45%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "linear-gradient(155deg, #0d1b2a 0%, #1b5e20 55%, #0097a7 100%)",
                    p: 6,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
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

                <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>
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
                            maxWidth: 360,
                            borderRadius: "24px",
                            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                            mb: 5,
                        }}
                    />

                    <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.5rem", lineHeight: 1.3, mb: 3 }}>
                        Join thousands of happy pet owners
                    </Typography>

                    <Box sx={{ textAlign: "left" }}>
                        {perks.map((perk) => (
                            <Box key={perk} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                                <CheckCircleIcon sx={{ color: "#64d9fb", fontSize: 20, flexShrink: 0 }} />
                                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
                                    {perk}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
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
                    overflowY: "auto",
                }}
            >
                <Box sx={{ width: "100%", maxWidth: 420, py: 2 }}>
                    {/* Mobile logo */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4 }}>
                        <PetsIcon sx={{ color: "#1565c0", fontSize: 28 }} />
                        <Typography fontWeight={800} fontSize="1.1rem" color="#0d1b2a">
                            PetPals Clinic
                        </Typography>
                    </Box>

                    <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0d1b2a", mb: 0.5 }}>
                        Create an account
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mb: 3.5, fontSize: "0.95rem" }}>
                        Join us today — it's free and takes less than a minute
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        {/* Name row */}
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel>First name</FieldLabel>
                                <TextField
                                    fullWidth
                                    placeholder="John"
                                    value={fname}
                                    onChange={(e) => setFname(e.target.value)}
                                    sx={fieldStyle}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutlinedIcon sx={{ color: "#9aa5b4", fontSize: 20 }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel>Last name</FieldLabel>
                                <TextField
                                    fullWidth
                                    placeholder="Doe"
                                    value={lname}
                                    onChange={(e) => setLname(e.target.value)}
                                    sx={fieldStyle}
                                />
                            </Box>
                        </Box>

                        {/* Email */}
                        <Box sx={{ mt: 2.5 }}>
                            <FieldLabel>Email address</FieldLabel>
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
                        </Box>

                        {/* Password */}
                        <Box sx={{ mt: 2.5 }}>
                            <FieldLabel>Password</FieldLabel>
                            <TextField
                                fullWidth
                                placeholder="Min. 8 characters"
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
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                {showPassword
                                                    ? <VisibilityOff sx={{ fontSize: 18, color: "#9aa5b4" }} />
                                                    : <Visibility sx={{ fontSize: 18, color: "#9aa5b4" }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {/* Confirm Password */}
                        <Box sx={{ mt: 2.5 }}>
                            <FieldLabel>Confirm password</FieldLabel>
                            <TextField
                                fullWidth
                                placeholder="Re-enter your password"
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={fieldStyle}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon sx={{ color: "#9aa5b4", fontSize: 20 }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small">
                                                {showConfirm
                                                    ? <VisibilityOff sx={{ fontSize: 18, color: "#9aa5b4" }} />
                                                    : <Visibility sx={{ fontSize: 18, color: "#9aa5b4" }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {/* Submit */}
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
                                background: "linear-gradient(135deg, #1b5e20, #0097a7)",
                                boxShadow: "0 8px 24px rgba(27,94,32,0.35)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #145214, #00838f)",
                                    boxShadow: "0 12px 32px rgba(27,94,32,0.45)",
                                    transform: "translateY(-1px)",
                                },
                                transition: "all 0.25s ease",
                            }}
                        >
                            Create account
                        </Button>

                        {/* Divider */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
                            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e5e9ef" }} />
                            <Typography sx={{ fontSize: "0.8rem", color: "#9aa5b4", whiteSpace: "nowrap" }}>
                                or sign up with
                            </Typography>
                            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e5e9ef" }} />
                        </Box>

                        {/* Google */}
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

                        <Typography textAlign="center" mt={4} sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                            Already have an account?{" "}
                            <Box
                                component="span"
                                onClick={() => navigate("/login")}
                                sx={{ color: "#1565c0", fontWeight: 700, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                            >
                                Sign in
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const FieldLabel = ({ children }) => (
    <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#0d1b2a", mb: 0.8 }}>
        {children}
    </Typography>
);

const fieldStyle = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
        fontSize: "0.95rem",
        "& fieldset": { borderColor: "#dde3ed" },
        "&:hover fieldset": { borderColor: "#b0bec5" },
        "&.Mui-focused fieldset": { borderColor: "#1b5e20", borderWidth: "1.5px" },
    },
};

export default Register;
