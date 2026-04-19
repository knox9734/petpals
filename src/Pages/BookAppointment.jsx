import React, { useState, useEffect, useContext } from "react";
import {
    Box, TextField, Button, Typography,
    InputAdornment, MenuItem, CircularProgress,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { useNavigate } from "react-router-dom";
import { petAPI, appointmentAPI } from "../api";
import { AuthContext } from "../Context/AuthContext";

const SERVICE_OPTIONS = [
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

const BookAppointment = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [pets, setPets]         = useState([]);
    const [petsLoading, setPetsLoading] = useState(true);

    const [petId, setPetId]       = useState("");
    const [service, setService]   = useState("");
    const [date, setDate]         = useState("");
    const [time, setTime]         = useState("");
    const [notes, setNotes]       = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError]       = useState("");
    const [success, setSuccess]   = useState(false);

    useEffect(() => {
        petAPI.list()
            .then(setPets)
            .catch(() => setPets([]))
            .finally(() => setPetsLoading(false));
    }, []);

    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!petId || !service || !date || !time) {
            setError("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            await appointmentAPI.create({
                pet:     petId,
                service,
                date,
                time,
                notes,
            });
            setSuccess(true);
        } catch (err) {
            const msg = err?.detail || err?.error
                || Object.values(err || {})?.[0]?.[0]
                || "Failed to book appointment. Please try again.";
            setError(msg);
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
                background: "linear-gradient(155deg, #0d1b2a 0%, #4527a0 55%, #0097a7 100%)",
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
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mb: 5 }}>
                        <PetsIcon sx={{ color: "#64d9fb", fontSize: 36 }} />
                        <Typography fontWeight={800} fontSize="1.4rem" color="white">PetPals Clinic</Typography>
                    </Box>

                    <Box component="img" src="/Images/bg-home.webp" alt="Vet with pet"
                        sx={{ width: "100%", maxWidth: 360, borderRadius: "24px", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", mb: 5, objectFit: "cover", height: 240 }} />

                    <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.6rem", lineHeight: 1.3, mb: 3 }}>
                        Book Your Pet's Visit in Minutes
                    </Typography>

                    <Box sx={{ textAlign: "left" }}>
                        {highlights.map((h) => (
                            <Box key={h} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                                <CheckCircleIcon sx={{ color: "#64d9fb", fontSize: 20, flexShrink: 0 }} />
                                <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}>{h}</Typography>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ mt: 4, p: 2.5, borderRadius: "16px", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: "12px", backgroundColor: "rgba(100,217,251,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <PhoneOutlinedIcon sx={{ color: "#64d9fb", fontSize: 22 }} />
                        </Box>
                        <Box sx={{ textAlign: "left" }}>
                            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>Prefer to call?</Typography>
                            <Typography sx={{ color: "white", fontWeight: 700, fontSize: "1rem" }}>+94 00 000 0000</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* ── RIGHT PANEL ── */}
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", p: { xs: 3, md: 6 }, overflowY: "auto" }}>
                <Box sx={{ width: "100%", maxWidth: 460, py: 2 }}>

                    {/* Mobile logo */}
                    <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, mb: 4 }}>
                        <PetsIcon sx={{ color: "#4527a0", fontSize: 28 }} />
                        <Typography fontWeight={800} fontSize="1.1rem" color="#0d1b2a">PetPals Clinic</Typography>
                    </Box>

                    {success ? (
                        /* ── SUCCESS STATE ── */
                        <Box sx={{ textAlign: "center", py: 4 }}>
                            <Box sx={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #4527a0, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                                <TaskAltIcon sx={{ color: "white", fontSize: 40 }} />
                            </Box>
                            <Typography fontWeight={800} fontSize="1.6rem" color="#0d1b2a" mb={1}>
                                Appointment Booked!
                            </Typography>
                            <Typography color="text.secondary" fontSize="0.95rem" mb={4}>
                                Your appointment has been successfully scheduled. We'll send a confirmation shortly.
                            </Typography>
                            <Button variant="contained" onClick={() => navigate("/dashboard")} fullWidth
                                sx={{ py: 1.5, borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "1rem", background: "linear-gradient(135deg, #4527a0, #0097a7)", boxShadow: "0 8px 24px rgba(69,39,160,0.3)", "&:hover": { transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                                Go to Dashboard
                            </Button>
                            <Button variant="text" onClick={() => { setSuccess(false); setPetId(""); setService(""); setDate(""); setTime(""); setNotes(""); }} fullWidth
                                sx={{ mt: 1.5, textTransform: "none", fontWeight: 600, color: "#4527a0" }}>
                                Book another appointment
                            </Button>
                        </Box>
                    ) : (
                        /* ── FORM ── */
                        <>
                            <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#0d1b2a", mb: 0.5 }}>
                                Book an Appointment
                            </Typography>
                            <Typography sx={{ color: "text.secondary", mb: 3.5, fontSize: "0.95rem" }}>
                                Hi {user?.first_name}! Pick your pet, service and preferred time.
                            </Typography>

                            {/* No pets warning */}
                            {!petsLoading && pets.length === 0 && (
                                <Box sx={{ mb: 2.5, p: 2, borderRadius: "12px", backgroundColor: "#fff8e1", border: "1px solid #ffe082" }}>
                                    <Typography fontSize="0.85rem" color="#f57f17" fontWeight={600}>
                                        You haven't registered any pets yet.
                                    </Typography>
                                    <Typography fontSize="0.8rem" color="#555" mt={0.5}>
                                        Go to your{" "}
                                        <Box component="span" onClick={() => navigate("/dashboard")} sx={{ color: "#4527a0", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                                            dashboard
                                        </Box>{" "}
                                        to add a pet first.
                                    </Typography>
                                </Box>
                            )}

                            {/* Error */}
                            {error && (
                                <Box sx={{ mb: 2.5, p: 1.5, borderRadius: "10px", backgroundColor: "#fde8e8", border: "1px solid #f5c6c6" }}>
                                    <Typography sx={{ color: "#c62828", fontSize: "0.83rem", fontWeight: 500 }}>{error}</Typography>
                                </Box>
                            )}

                            <Box component="form" onSubmit={handleSubmit}>

                                {/* Pet selector */}
                                <Box sx={{ mb: 2.5 }}>
                                    <FieldLabel>Select Pet *</FieldLabel>
                                    <TextField select fullWidth value={petId} onChange={(e) => setPetId(e.target.value)} sx={fieldStyle}
                                        SelectProps={{ displayEmpty: true }}
                                        InputProps={{ startAdornment: <InputAdornment position="start">{petsLoading ? <CircularProgress size={16} /> : <PetsIcon sx={iconSx} />}</InputAdornment> }}
                                        disabled={petsLoading || pets.length === 0}>
                                        <MenuItem value="" disabled>
                                            {petsLoading ? "Loading pets…" : pets.length === 0 ? "No pets registered" : "Choose a pet"}
                                        </MenuItem>
                                        {pets.map((p) => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.name} — {p.species}{p.breed ? ` (${p.breed})` : ""}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                {/* Service */}
                                <Box sx={{ mb: 2.5 }}>
                                    <FieldLabel>Service type *</FieldLabel>
                                    <TextField select fullWidth value={service} onChange={(e) => setService(e.target.value)} sx={fieldStyle}
                                        InputProps={{ startAdornment: <InputAdornment position="start"><MedicalServicesOutlinedIcon sx={iconSx} /></InputAdornment> }}
                                        SelectProps={{ displayEmpty: true }}>
                                        <MenuItem value="" disabled>Select a service</MenuItem>
                                        {SERVICE_OPTIONS.map((opt) => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                {/* Date & Time */}
                                <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <FieldLabel>Preferred date *</FieldLabel>
                                        <TextField fullWidth type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                            inputProps={{ min: today }} sx={fieldStyle}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayOutlinedIcon sx={iconSx} /></InputAdornment> }} />
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <FieldLabel>Preferred time *</FieldLabel>
                                        <TextField fullWidth type="time" value={time} onChange={(e) => setTime(e.target.value)} sx={fieldStyle}
                                            InputProps={{ startAdornment: <InputAdornment position="start"><AccessTimeOutlinedIcon sx={iconSx} /></InputAdornment> }} />
                                    </Box>
                                </Box>

                                {/* Notes */}
                                <Box sx={{ mb: 2.5 }}>
                                    <FieldLabel>Notes <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>(optional)</Typography></FieldLabel>
                                    <TextField fullWidth multiline rows={3} placeholder="Any symptoms, concerns or special requests…"
                                        value={notes} onChange={(e) => setNotes(e.target.value)} sx={fieldStyle}
                                        InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: "14px", alignSelf: "flex-start" }}><NotesOutlinedIcon sx={iconSx} /></InputAdornment> }} />
                                </Box>

                                {/* Submit */}
                                <Button fullWidth variant="contained" type="submit" size="large"
                                    disabled={submitting || pets.length === 0}
                                    sx={{
                                        mt: 2, py: 1.6, borderRadius: "12px",
                                        fontWeight: 700, fontSize: "1rem", textTransform: "none",
                                        background: "linear-gradient(135deg, #4527a0, #0097a7)",
                                        boxShadow: "0 8px 24px rgba(69,39,160,0.35)",
                                        "&:hover": { background: "linear-gradient(135deg, #311b92, #00838f)", transform: "translateY(-1px)" },
                                        "&.Mui-disabled": { opacity: 0.6 },
                                        transition: "all 0.25s ease",
                                    }}>
                                    {submitting ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Confirm Appointment"}
                                </Button>

                                {/* Divider */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
                                    <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e5e9ef" }} />
                                    <Typography sx={{ fontSize: "0.8rem", color: "#9aa5b4", whiteSpace: "nowrap" }}>or call us directly</Typography>
                                    <Box sx={{ flex: 1, height: "1px", backgroundColor: "#e5e9ef" }} />
                                </Box>

                                <Button fullWidth variant="outlined" size="large"
                                    sx={{ py: 1.5, borderRadius: "12px", fontWeight: 600, fontSize: "0.95rem", textTransform: "none", color: "#0d1b2a", borderColor: "#dde3ed", backgroundColor: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", gap: 1.5, "&:hover": { borderColor: "#c5cdd9", backgroundColor: "#f9fbfc" } }}>
                                    <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
                                    +94 00 000 0000
                                </Button>

                                <Typography textAlign="center" mt={4} sx={{ fontSize: "0.9rem", color: "text.secondary" }}>
                                    Need help?{" "}
                                    <Box component="span" onClick={() => navigate("/")} sx={{ color: "#4527a0", fontWeight: 700, cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>
                                        Back to home
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

export default BookAppointment;
