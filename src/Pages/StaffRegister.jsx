import React, { useState } from "react";
import {
    Box, TextField, Button, Typography,
    InputAdornment, IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PetsIcon from "@mui/icons-material/Pets";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const perks = [
    "Manage all clinic appointments",
    "Update appointment status in real-time",
    "Create and track patient invoices",
    "View revenue and billing history",
];

const FieldLabel = ({ children }) => (
    <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: "#0d1b2a", mb: 0.8 }}>{children}</Typography>
);

const fieldStyle = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px", backgroundColor: "#f8fafc", fontSize: "0.95rem",
        "& fieldset": { borderColor: "#dde3ed" },
        "&:hover fieldset": { borderColor: "#b0bec5" },
        "&.Mui-focused fieldset": { borderColor: "#f57c00", borderWidth: "1.5px" },
    },
};

const StaffRegister = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [fname, setFname]                   = useState("");
    const [lname, setLname]                   = useState("");
    const [email, setEmail]                   = useState("");
    const [password, setPassword]             = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [staffCode, setStaffCode]           = useState("");
    const [showPassword, setShowPassword]     = useState(false);
    const [showConfirm, setShowConfirm]       = useState(false);
    const [showCode, setShowCode]             = useState(false);
    const [submitting, setSubmitting]         = useState(false);
    const [error, setError]                   = useState("");
    const [success, setSuccess]               = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!staffCode.trim()) { setError("Staff registration code is required."); return; }
        if (password !== confirmPassword) { setError("Passwords do not match."); return; }

        setSubmitting(true);
        try {
            const user = await register({ fname, lname, email, password, confirm_password: confirmPassword, staff_code: staffCode });
            if (user?.is_staff) {
                setSuccess(true);
            } else {
                setError("Registration succeeded but staff access was not granted. Check the code and try again.");
            }
        } catch (err) {
            const msg =
                err?.staff_code?.[0] || err?.staff_code ||
                err?.email?.[0]      ||
                err?.password?.[0]   ||
                err?.non_field_errors?.[0] ||
                err?.detail          ||
                "Something went wrong. Please try again.";
            setError(typeof msg === "string" ? msg : JSON.stringify(msg));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", display: "flex", backgroundColor: "#f5f7fb" }}>

            {/* ── LEFT PANEL ── */}
            <Box sx={{
                display: { xs: "none", md: "flex" },
                flex: "0 0 45%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(155deg, #0d1b2a 0%, #e65100 55%, #f57c00 100%)",
                p: 6,
                position: "relative",
                overflow: "hidden",
            }}>
                {[...Array(5)].map((_, i) => (
                    <PetsIcon key={i} sx={{
                        position: "absolute",
                        fontSize: `${80 + i * 40}px`,
                        opacity: 0.05,
                        top: `${8 + i * 18}%`,
                        left: i % 2 === 0 ? `${-5 + i * 10}%` : "auto",
                        right: i % 2 !== 0 ? `${5 + i * 8}%` : "auto",
                        transform: `rotate(${i * 30}deg)`,
                        pointerEvents: "none",
                    }} />
                ))}

                <Box sx={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 400 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 4 }}>
                        <PetsIcon sx={{ color: "#ffd54f", fontSize: 36 }} />
                        <Typography fontWeight={800} fontSize="1.4rem" color="white">PetPals Clinic</Typography>
                    </Box>

                    {/* Staff badge */}
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2.5, py: 1, borderRadius: "40px", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", mb: 4 }}>
                        <AdminPanelSettingsOutlinedIcon sx={{ color: "#ffd54f", fontSize: 20 }} />
                        <Typography sx={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}>Staff Portal</Typography>
                    </Box>

                    <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1.3, mb: 3 }}>
                        Join the PetPals Staff Team
                    </Typography>

                    <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", mb: 4, lineHeight: 1.7 }}>
                        Use your staff registration code provided by the clinic administrator to create your account.
                    </Typography>

                    <Box sx={{ textAlign: "left" }}>
                        {perks.map((perk) => (
                            <Box key={perk} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                                <CheckCircleIcon sx={{ color: "#ffd54f", fontSize: 20, flexShrink: 0 }} />
                                <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem" }}>{perk}</Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Back to patient login */}
                    <Box onClick={() => navigate("/login")} sx={{ mt: 4, p: 2, borderRadius: "12px", cursor: "pointer", backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", transition: "all 0.2s", "&:hover": { backgroundColor: "rgba(255,255,255,0.13)" } }}>
                        <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.82rem" }}>
                            Not a staff member?{" "}
                            <Box component="span" sx={{ color: "#ffd54f", fontWeight: 700 }}>Patient login →</Box>
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* ── RIGHT PANEL ── */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", p: { xs: 3, md: 6 }, overflowY: "auto" }}>
                <Box sx={{ width: "100%", maxWidth: 460, py: 2 }}>

                    {/* Mobile logo */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4 }}>
                        <AdminPanelSettingsOutlinedIcon sx={{ color: "#f57c00", fontSize: 28 }} />
                        <Typography fontWeight={800} fontSize="1.1rem" color="#0d1b2a">Staff Portal</Typography>
                    </Box>

                    {success ? (
                        /* ── SUCCESS ── */
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <Box sx={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #e65100, #f57c00)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                                <TaskAltIcon sx={{ color: "white", fontSize: 40 }} />
                            </Box>
                            <Typography fontWeight={800} fontSize="1.6rem" color="#0d1b2a" mb={1}>Staff Account Created!</Typography>
                            <Typography color="text.secondary" fontSize="0.95rem" mb={1}>
                                Your staff account has been set up with clinic access.
                            </Typography>
                            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8, px: 2, py: 0.6, borderRadius: "20px", backgroundColor: "#fff8e1", border: "1px solid #ffe082", mb: 4 }}>
                                <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 16, color: "#f57c00" }} />
                                <Typography sx={{ fontSize: "0.82rem", color: "#e65100", fontWeight: 700 }}>Staff access granted</Typography>
                            </Box>
                            <Button variant="contained" onClick={() => navigate("/staff")} fullWidth
                                sx={{ py: 1.5, borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "1rem", background: "linear-gradient(135deg, #e65100, #f57c00)", boxShadow: "0 8px 24px rgba(230,81,0,0.3)", "&:hover": { transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                                Go to Staff Panel
                            </Button>
                            <Button variant="text" onClick={() => navigate("/login")} fullWidth
                                sx={{ mt: 1.5, textTransform: "none", fontWeight: 600, color: "#f57c00" }}>
                                Back to Login
                            </Button>
                        </Box>
                    ) : (
                        /* ── FORM ── */
                        <>
                            <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0d1b2a", mb: 0.5 }}>Staff Registration</Typography>
                            <Typography sx={{ color: "text.secondary", mb: 3.5, fontSize: "0.95rem" }}>
                                Create your staff account with your clinic-issued access code
                            </Typography>

                            {error && (
                                <Box sx={{ mb: 2.5, p: 1.5, borderRadius: "10px", backgroundColor: "#fde8e8", border: "1px solid #f5c6c6" }}>
                                    <Typography sx={{ color: "#c62828", fontSize: "0.85rem", fontWeight: 500 }}>{error}</Typography>
                                </Box>
                            )}

                            <Box component="form" onSubmit={handleSubmit}>
                                {/* Name row */}
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <FieldLabel>First name</FieldLabel>
                                        <TextField fullWidth placeholder="Jane" value={fname} onChange={(e) => setFname(e.target.value)} sx={fieldStyle}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={{ color: "#9aa5b4", fontSize: 20 }} /></InputAdornment> }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <FieldLabel>Last name</FieldLabel>
                                        <TextField fullWidth placeholder="Smith" value={lname} onChange={(e) => setLname(e.target.value)} sx={fieldStyle} />
                                    </Box>
                                </Box>

                                {/* Email */}
                                <Box sx={{ mt: 2.5 }}>
                                    <FieldLabel>Work email address</FieldLabel>
                                    <TextField fullWidth placeholder="staff@petpals.com" type="email"
                                        value={email} onChange={(e) => setEmail(e.target.value)} sx={fieldStyle}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={{ color: "#9aa5b4", fontSize: 20 }} /></InputAdornment> }} />
                                </Box>

                                {/* Password */}
                                <Box sx={{ mt: 2.5 }}>
                                    <FieldLabel>Password</FieldLabel>
                                    <TextField fullWidth placeholder="Min. 8 characters"
                                        type={showPassword ? "text" : "password"}
                                        value={password} onChange={(e) => setPassword(e.target.value)} sx={fieldStyle}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: "#9aa5b4", fontSize: 20 }} /></InputAdornment>,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                                                        {showPassword ? <VisibilityOff sx={{ fontSize: 18, color: "#9aa5b4" }} /> : <Visibility sx={{ fontSize: 18, color: "#9aa5b4" }} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }} />
                                </Box>

                                {/* Confirm Password */}
                                <Box sx={{ mt: 2.5 }}>
                                    <FieldLabel>Confirm password</FieldLabel>
                                    <TextField fullWidth placeholder="Re-enter your password"
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} sx={fieldStyle}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: "#9aa5b4", fontSize: 20 }} /></InputAdornment>,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" size="small">
                                                        {showConfirm ? <VisibilityOff sx={{ fontSize: 18, color: "#9aa5b4" }} /> : <Visibility sx={{ fontSize: 18, color: "#9aa5b4" }} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }} />
                                </Box>

                                {/* Staff Code — highlighted */}
                                <Box sx={{ mt: 3, p: 2.5, borderRadius: "14px", backgroundColor: "#fff8e1", border: "1px solid #ffe082" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                                        <VpnKeyOutlinedIcon sx={{ fontSize: 18, color: "#f57c00" }} />
                                        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: "#e65100" }}>Staff Access Code *</Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: "0.78rem", color: "#b45309", mb: 1.5 }}>
                                        Enter the code provided by your clinic administrator.
                                    </Typography>
                                    <TextField fullWidth placeholder="e.g. staff@petpals2024"
                                        type={showCode ? "text" : "password"}
                                        value={staffCode} onChange={(e) => setStaffCode(e.target.value)}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px", backgroundColor: "white", fontSize: "0.95rem",
                                                "& fieldset": { borderColor: "#ffc107" },
                                                "&:hover fieldset": { borderColor: "#f57c00" },
                                                "&.Mui-focused fieldset": { borderColor: "#e65100", borderWidth: "1.5px" },
                                            },
                                        }}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start"><VpnKeyOutlinedIcon sx={{ color: "#f57c00", fontSize: 20 }} /></InputAdornment>,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setShowCode(!showCode)} edge="end" size="small">
                                                        {showCode ? <VisibilityOff sx={{ fontSize: 18, color: "#9aa5b4" }} /> : <Visibility sx={{ fontSize: 18, color: "#9aa5b4" }} />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }} />
                                </Box>

                                {/* Submit */}
                                <Button fullWidth variant="contained" type="submit" size="large" disabled={submitting}
                                    sx={{
                                        mt: 3.5, py: 1.6, borderRadius: "12px", fontWeight: 700, fontSize: "1rem", textTransform: "none",
                                        background: "linear-gradient(135deg, #e65100, #f57c00)",
                                        boxShadow: "0 8px 24px rgba(230,81,0,0.35)",
                                        "&:hover": { background: "linear-gradient(135deg, #bf360c, #e65100)", transform: "translateY(-1px)" },
                                        "&.Mui-disabled": { opacity: 0.7 },
                                        transition: "all 0.25s ease",
                                    }}>
                                    {submitting ? "Creating staff account…" : "Create Staff Account"}
                                </Button>

                                <Typography textAlign="center" mt={3} sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                                    Already have an account?{" "}
                                    <Box component="span" onClick={() => navigate("/login")} sx={{ color: "#f57c00", fontWeight: 700, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                                        Sign in
                                    </Box>
                                </Typography>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default StaffRegister;
