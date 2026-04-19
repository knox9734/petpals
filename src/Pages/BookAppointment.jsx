import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    InputAdornment,
    MenuItem,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const serviceOptions = [
    "General Checkup",
    "Vaccination",
    "Surgery",
    "Dental Care",
    "Grooming",
    "Emergency Care",
    "Other",
];

const highlights = [
    "Experienced, board-certified vets",
    "Flexible morning & evening slots",
    "Instant confirmation via email",
    "Free follow-up consultation",
];

const BookAppointment = () => {
    const navigate = useNavigate();

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [petName, setPetName] = useState("");
    const [service, setService] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Appointment booked for ${fname} ${lname} on ${date} at ${time}`);
        navigate("/dashboard");
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
                    background: "linear-gradient(155deg, #0d1b2a 0%, #4527a0 55%, #0097a7 100%)",
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
                        src="/Images/bg-home.webp"
                        alt="Vet with pet"
                        sx={{
                            width: "100%",
                            maxWidth: 360,
                            borderRadius: "24px",
                            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                            mb: 5,
                            objectFit: "cover",
                            height: 240,
                        }}
                    />

                    <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1.3, mb: 3 }}>
                        Book Your Pet's Visit in Minutes
                    </Typography>

                    <Box sx={{ textAlign: "left" }}>
                        {highlights.map((h) => (
                            <Box key={h} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                                <CheckCircleIcon sx={{ color: "#64d9fb", fontSize: 20, flexShrink: 0 }} />
                                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>
                                    {h}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Call card */}
                    <Box
                        sx={{
                            mt: 4,
                            p: 2.5,
                            borderRadius: "16px",
                            backgroundColor: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            backdropFilter: "blur(8px)",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "12px",
                                backgroundColor: "rgba(100,217,251,0.2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <PhoneOutlinedIcon sx={{ color: "#64d9fb", fontSize: 22 }} />
                        </Box>
                        <Box sx={{ textAlign: "left" }}>
                            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>
                                Prefer to call?
                            </Typography>
                            <Typography sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>
                                +94 00 000 0000
                            </Typography>
                        </Box>
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
                <Box sx={{ width: "100%", maxWidth: 460, py: 2 }}>
                    {/* Mobile logo */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4 }}>
                        <PetsIcon sx={{ color: "#4527a0", fontSize: 28 }} />
                        <Typography fontWeight={800} fontSize="1.1rem" color="#0d1b2a">
                            PetPals Clinic
                        </Typography>
                    </Box>

                    <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0d1b2a", mb: 0.5 }}>
                        Book an Appointment
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mb: 3.5, fontSize: "0.95rem" }}>
                        Fill in the details below and we'll confirm your slot
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>

                        {/* Name row */}
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel>First name</FieldLabel>
                                <TextField
                                    fullWidth placeholder="John"
                                    value={fname} onChange={(e) => setFname(e.target.value)}
                                    sx={fieldStyle}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={iconSx} /></InputAdornment>,
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel>Last name</FieldLabel>
                                <TextField
                                    fullWidth placeholder="Doe"
                                    value={lname} onChange={(e) => setLname(e.target.value)}
                                    sx={fieldStyle}
                                />
                            </Box>
                        </Box>

                        {/* Email */}
                        <Box sx={{ mt: 2.5 }}>
                            <FieldLabel>Email address</FieldLabel>
                            <TextField
                                fullWidth placeholder="you@example.com" type="email"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                sx={fieldStyle}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={iconSx} /></InputAdornment>,
                                }}
                            />
                        </Box>

                        {/* Pet name */}
                        <Box sx={{ mt: 2.5 }}>
                            <FieldLabel>Pet's name</FieldLabel>
                            <TextField
                                fullWidth placeholder="e.g. Buddy"
                                value={petName} onChange={(e) => setPetName(e.target.value)}
                                sx={fieldStyle}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><PetsIcon sx={iconSx} /></InputAdornment>,
                                }}
                            />
                        </Box>

                        {/* Service */}
                        <Box sx={{ mt: 2.5 }}>
                            <FieldLabel>Service type</FieldLabel>
                            <TextField
                                select fullWidth
                                value={service} onChange={(e) => setService(e.target.value)}
                                sx={fieldStyle}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><MedicalServicesOutlinedIcon sx={iconSx} /></InputAdornment>,
                                }}
                                SelectProps={{ displayEmpty: true }}
                            >
                                <MenuItem value="" disabled>Select a service</MenuItem>
                                {serviceOptions.map((opt) => (
                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* Date & Time row */}
                        <Box sx={{ display: "flex", gap: 2, mt: 2.5 }}>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel>Preferred date</FieldLabel>
                                <TextField
                                    fullWidth type="date"
                                    value={date} onChange={(e) => setDate(e.target.value)}
                                    sx={fieldStyle}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><CalendarTodayOutlinedIcon sx={iconSx} /></InputAdornment>,
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <FieldLabel>Preferred time</FieldLabel>
                                <TextField
                                    fullWidth type="time"
                                    value={time} onChange={(e) => setTime(e.target.value)}
                                    sx={fieldStyle}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start"><AccessTimeOutlinedIcon sx={iconSx} /></InputAdornment>,
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Submit */}
                        <Button
                            fullWidth variant="contained" type="submit" size="large"
                            sx={{
                                mt: 4, py: 1.6,
                                borderRadius: "12px",
                                fontWeight: 700, fontSize: "1rem",
                                textTransform: "none",
                                background: "linear-gradient(135deg, #4527a0, #0097a7)",
                                boxShadow: "0 8px 24px rgba(69,39,160,0.35)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #311b92, #00838f)",
                                    boxShadow: "0 12px 32px rgba(69,39,160,0.45)",
                                    transform: "translateY(-1px)",
                                },
                                transition: "all 0.25s ease",
                            }}
                        >
                            Confirm Appointment
                        </Button>

                        {/* Divider */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
                            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e5e9ef" }} />
                            <Typography sx={{ fontSize: "0.8rem", color: "#9aa5b4", whiteSpace: "nowrap" }}>
                                or call us directly
                            </Typography>
                            <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e5e9ef" }} />
                        </Box>

                        <Button
                            fullWidth variant="outlined" size="large"
                            sx={{
                                py: 1.5, borderRadius: "12px",
                                fontWeight: 600, fontSize: "0.95rem",
                                textTransform: "none",
                                color: "#0d1b2a", borderColor: "#dde3ed",
                                backgroundColor: "white",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                                gap: 1.5,
                                "&:hover": { borderColor: "#c5cdd9", backgroundColor: "#f9fbfc" },
                            }}
                        >
                            <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
                            +94 00 000 0000
                        </Button>

                        <Typography textAlign="center" mt={4} sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                            Need help?{" "}
                            <Box
                                component="span"
                                onClick={() => navigate("/")}
                                sx={{ color: "#4527a0", fontWeight: 700, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
                            >
                                Back to home
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

const iconSx = { color: "#9aa5b4", fontSize: 20 };

const fieldStyle = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
        fontSize: "0.95rem",
        "& fieldset": { borderColor: "#dde3ed" },
        "&:hover fieldset": { borderColor: "#b0bec5" },
        "&.Mui-focused fieldset": { borderColor: "#4527a0", borderWidth: "1.5px" },
    },
};

export default BookAppointment;
