import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button,
    Chip, Avatar, Container, LinearProgress, CircularProgress,
    IconButton,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import MonitorHeartOutlinedIcon from "@mui/icons-material/MonitorHeartOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "../api";
import { useAuth } from "../Context/AuthContext";
import AddPetModal from "../components/AddPetModal";

const PET_COLORS = [
    "linear-gradient(135deg, #1565c0, #0097a7)",
    "linear-gradient(135deg, #4527a0, #7b1fa2)",
    "linear-gradient(135deg, #b71c1c, #e91e63)",
    "linear-gradient(135deg, #1b5e20, #0097a7)",
];

const SPECIES_AVATAR = { Dog: "🐕", Cat: "🐈", Bird: "🐦", Rabbit: "🐇", Fish: "🐟", Other: "🐾" };

const reminders = [
    { icon: <VaccinesOutlinedIcon sx={{ fontSize: 18 }} />, text: "Annual vaccination due soon", date: "In 18 days", color: "#fff3e0", iconColor: "#f57c00" },
    { icon: <ContentCutOutlinedIcon sx={{ fontSize: 18 }} />, text: "Grooming session scheduled", date: "In 30 days", color: "#f3e5f5", iconColor: "#7b1fa2" },
    { icon: <MonitorHeartOutlinedIcon sx={{ fontSize: 18 }} />, text: "Heartworm test reminder", date: "In 45 days", color: "#e8f5e9", iconColor: "#2e7d32" },
];

const statusChip = (status) => {
    const map = {
        Completed: { bg: "#e8f5e9", color: "#2e7d32" },
        Upcoming:  { bg: "#e3f2fd", color: "#1565c0" },
        Paid:      { bg: "#e8f5e9", color: "#2e7d32" },
        Pending:   { bg: "#fff8e1", color: "#f57f17" },
        Cancelled: { bg: "#fde8e8", color: "#c62828" },
    };
    const s = map[status] || { bg: "#f5f5f5", color: "#555" };
    return <Chip label={status} size="small" sx={{ backgroundColor: s.bg, color: s.color, fontWeight: 700, fontSize: "0.72rem", height: 22, borderRadius: "8px" }} />;
};

const Card = ({ children, sx = {} }) => (
    <Box sx={{ backgroundColor: "white", borderRadius: "20px", p: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", ...sx }}>
        {children}
    </Box>
);

const CardHeader = ({ icon, title, gradient, action }) => (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {React.cloneElement(icon, { sx: { color: "white", fontSize: 18 } })}
            </Box>
            <Typography fontWeight={800} fontSize="1rem" color="#0d1b2a">{title}</Typography>
        </Box>
        {action}
    </Box>
);

const StatCard = ({ icon, label, value, gradient, sub }) => (
    <Box sx={{ flex: 1, minWidth: { xs: "calc(50% - 8px)", md: 0 }, p: 3, borderRadius: "20px", background: gradient, color: "white", position: "relative", overflow: "hidden" }}>
        <Box sx={{ width: 44, height: 44, borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            {icon}
        </Box>
        <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>{value}</Typography>
        <Typography sx={{ fontSize: "0.8rem", opacity: 0.85, mt: 0.5 }}>{label}</Typography>
        {sub && <Typography sx={{ fontSize: "0.72rem", opacity: 0.65, mt: 0.3 }}>{sub}</Typography>}
        <PetsIcon sx={{ position: "absolute", right: -10, bottom: -10, fontSize: 80, opacity: 0.08 }} />
    </Box>
);

const ViewAll = () => (
    <Typography sx={{ fontSize: "0.8rem", color: "#1565c0", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 0.5 }}>
        View all <ArrowForwardIcon sx={{ fontSize: 14 }} />
    </Typography>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [pets, setPets]               = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [totalSpent, setTotalSpent]   = useState(0);
    const [upcomingAppt, setUpcoming]   = useState(null);
    const [loading, setLoading]         = useState(true);
    const [showAddPet, setShowAddPet]   = useState(false);
    const [isFirstPet, setIsFirstPet]   = useState(false);

    const loadDashboard = async () => {
        try {
            const data = await dashboardAPI.get();
            setPets(data.pets);
            setAppointments(data.appointments);
            setTotalSpent(data.total_spent);
            setUpcoming(data.upcoming);
            if (data.pets.length === 0) {
                setIsFirstPet(true);
                setShowAddPet(true);
            }
        } catch (err) {
            console.error("Dashboard load failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadDashboard(); }, []);

    const handlePetSaved = async () => {
        setShowAddPet(false);
        setIsFirstPet(false);
        await loadDashboard();
    };

    const firstName = user?.first_name || user?.email?.split("@")[0] || "there";
    const initials  = firstName.charAt(0).toUpperCase();

    const billingRows = appointments
        .filter(a => a.status === "Completed")
        .map((a) => ({
            id:        a.id,
            date:      a.date,
            service:   a.service,
            invoiceNo: a.invoice ? `INV-${String(a.invoice.id).padStart(3, "0")}` : `INV-${String(a.id).padStart(3, "0")}`,
            amount:    a.invoice ? parseFloat(a.invoice.amount).toFixed(2) : null,
            status:    a.invoice ? a.invoice.status : "Pending",
        }));

    if (loading) {
        return (
            <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress size={48} sx={{ color: "#1565c0" }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fb" }}>

            <AddPetModal
                open={showAddPet}
                onClose={() => setShowAddPet(false)}
                onSaved={handlePetSaved}
                isFirstPet={isFirstPet}
            />

            {/* ── HEADER BANNER ── */}
            <Box sx={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1565c0 60%, #0097a7 100%)", pt: 5, pb: 9, px: { xs: 3, md: 6 }, position: "relative", overflow: "hidden" }}>
                {[...Array(4)].map((_, i) => (
                    <PetsIcon key={i} sx={{ position: "absolute", fontSize: `${60 + i * 30}px`, opacity: 0.05, top: `${10 + i * 20}%`, right: `${5 + i * 12}%`, transform: `rotate(${i * 20}deg)`, pointerEvents: "none" }} />
                ))}
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ width: 56, height: 56, background: "linear-gradient(135deg, #64d9fb, #1565c0)", fontSize: "1.4rem", fontWeight: 800 }}>{initials}</Avatar>
                            <Box>
                                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Welcome back</Typography>
                                <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.4rem" }}>
                                    {user?.first_name} {user?.last_name}
                                </Typography>
                            </Box>
                        </Box>
                        <Button onClick={() => navigate("/book")} variant="contained" startIcon={<AddCircleOutlineIcon />}
                            sx={{ px: 3, py: 1.3, borderRadius: "12px", fontWeight: 700, textTransform: "none", backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", boxShadow: "none", "&:hover": { backgroundColor: "rgba(255,255,255,0.25)", boxShadow: "none" } }}>
                            New Appointment
                        </Button>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
                        <StatCard icon={<CalendarTodayOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Total Appointments" value={appointments.length} gradient="linear-gradient(135deg, #1565c0, #0097a7)" />
                        <StatCard icon={<PetsIcon sx={{ color: "white", fontSize: 22 }} />} label="Registered Pets" value={pets.length} gradient="linear-gradient(135deg, #4527a0, #7b1fa2)" />
                        <StatCard icon={<ReceiptOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Total Spent" value={`$${parseFloat(totalSpent).toFixed(2)}`} gradient="linear-gradient(135deg, #1b5e20, #0097a7)" />
                        <StatCard icon={<MedicalServicesOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Next Appointment"
                            value={upcomingAppt ? upcomingAppt.date : "—"}
                            sub={upcomingAppt ? `${upcomingAppt.time} · ${upcomingAppt.pet_name}` : "None scheduled"}
                            gradient="linear-gradient(135deg, #b71c1c, #e91e63)" />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, pb: 8 }}>

                {/* Upcoming banner */}
                {upcomingAppt && (
                    <Card sx={{ mb: 3, border: "1px solid #e3f2fd" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: "14px", background: "linear-gradient(135deg, #1565c0, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CalendarTodayOutlinedIcon sx={{ color: "white", fontSize: 22 }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: "#0d1b2a", fontSize: "0.95rem" }}>
                                        Upcoming: {upcomingAppt.service} for {upcomingAppt.pet_name}
                                    </Typography>
                                    <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                                        {upcomingAppt.date} at {upcomingAppt.time} · {upcomingAppt.doctor}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1.5 }}>
                                {statusChip("Upcoming")}
                                <Button size="small" variant="outlined" onClick={() => navigate("/book")}
                                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, fontSize: "0.8rem", borderColor: "#dde3ed", color: "#1565c0" }}>
                                    Reschedule
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                )}

                {/* ── ROW 1: Pet Profiles ── */}
                <Card sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #1565c0, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <PetsIcon sx={{ color: "white", fontSize: 18 }} />
                            </Box>
                            <Typography fontWeight={800} fontSize="1rem" color="#0d1b2a">My Pets</Typography>
                        </Box>
                        <Button onClick={() => { setIsFirstPet(false); setShowAddPet(true); }}
                            variant="contained" startIcon={<AddIcon />} size="small"
                            sx={{ borderRadius: "10px", fontWeight: 700, textTransform: "none", fontSize: "0.83rem", background: "linear-gradient(135deg, #1565c0, #0097a7)", boxShadow: "0 4px 12px rgba(21,101,192,0.25)", "&:hover": { boxShadow: "0 6px 18px rgba(21,101,192,0.35)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                            Add Pet
                        </Button>
                    </Box>

                    {pets.length === 0 ? (
                        <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                            <PetsIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                            <Typography fontSize="0.9rem">No pets registered yet.</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", gap: 3, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                            {pets.map((pet, idx) => {
                                const color  = PET_COLORS[idx % PET_COLORS.length];
                                const avatar = SPECIES_AVATAR[pet.species] || "🐾";
                                const lastAppt = appointments.filter(a => a.pet === pet.id).sort((a, b) => b.date.localeCompare(a.date))[0];
                                return (
                                    <Box key={pet.id} sx={{ flex: 1, minWidth: { xs: "100%", sm: 0 }, p: 2.5, borderRadius: "16px", border: "1px solid #f0f4f8", backgroundColor: "#fafbfd" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                                            <Box sx={{ width: 52, height: 52, borderRadius: "16px", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>
                                                {avatar}
                                            </Box>
                                            <Box>
                                                <Typography fontWeight={800} fontSize="1.05rem" color="#0d1b2a">{pet.name}</Typography>
                                                <Typography fontSize="0.82rem" color="text.secondary">
                                                    {pet.breed ? `${pet.breed} · ` : ""}{pet.species}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: "flex", gap: 2, mb: lastAppt ? 2 : 0 }}>
                                            {[["Age", `${pet.age} yr${pet.age !== 1 ? "s" : ""}`], ["Weight", `${pet.weight} kg`]].map(([k, v]) => (
                                                <Box key={k} sx={{ flex: 1, textAlign: "center", p: 1.2, borderRadius: "10px", backgroundColor: "#f0f4f8" }}>
                                                    <Typography fontSize="0.7rem" color="text.secondary" fontWeight={600}>{k}</Typography>
                                                    <Typography fontSize="0.82rem" fontWeight={700} color="#0d1b2a" mt={0.3}>{v}</Typography>
                                                </Box>
                                            ))}
                                        </Box>

                                        {lastAppt && (
                                            <Box sx={{ mt: 2, pt: 2, borderTop: "1px dashed #e0e7ef" }}>
                                                <Typography fontSize="0.73rem" color="text.secondary">
                                                    Last visit: <strong>{lastAppt.date}</strong> · {lastAppt.service}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Card>

                {/* ── ROW 2: Appointments + Right column ── */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3, mb: 3 }}>

                    {/* Appointment History */}
                    <Card sx={{ flex: 2 }}>
                        <CardHeader icon={<MedicalServicesOutlinedIcon />} title="Appointment History" gradient="linear-gradient(135deg, #1565c0, #0097a7)" action={<ViewAll />} />
                        {appointments.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 5, color: "text.secondary" }}>
                                <CalendarTodayOutlinedIcon sx={{ fontSize: 40, opacity: 0.2, mb: 1 }} />
                                <Typography fontSize="0.9rem">No appointments yet.</Typography>
                                <Button onClick={() => navigate("/book")} size="small" sx={{ mt: 1.5, textTransform: "none", fontWeight: 600, color: "#1565c0" }}>
                                    Book your first appointment →
                                </Button>
                            </Box>
                        ) : (
                            <TableContainer sx={{ borderRadius: "12px", border: "1px solid #f0f4f8" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                            {["Date", "Pet", "Service", "Doctor", "Status"].map(h => (
                                                <TableCell key={h} sx={{ fontWeight: 700, color: "#6b7c93", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px", border: "none", py: 1.5 }}>{h}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {appointments.map((appt) => (
                                            <TableRow key={appt.id} sx={{ "&:last-child td": { border: "none" }, "&:hover": { backgroundColor: "#f8fafc" }, transition: "background 0.15s" }}>
                                                <TableCell sx={{ fontSize: "0.83rem", color: "#0d1b2a", fontWeight: 600, py: 1.8 }}>{appt.date}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                        <Avatar sx={{ width: 26, height: 26, fontSize: "0.72rem", backgroundColor: "#e3f2fd", color: "#1565c0", fontWeight: 700 }}>{appt.pet_name?.[0]}</Avatar>
                                                        <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "#0d1b2a" }}>{appt.pet_name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ fontSize: "0.83rem", color: "#444" }}>{appt.service}</TableCell>
                                                <TableCell sx={{ fontSize: "0.83rem", color: "#444" }}>{appt.doctor || "TBD"}</TableCell>
                                                <TableCell>{statusChip(appt.status)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Card>

                    {/* Right column */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>

                        {/* Reminders */}
                        <Card>
                            <CardHeader icon={<NotificationsOutlinedIcon />} title="Reminders" gradient="linear-gradient(135deg, #f57c00, #ffc107)" />
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                {reminders.map((r, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: "12px", backgroundColor: r.color }}>
                                        <Box sx={{ color: r.iconColor, display: "flex", flexShrink: 0 }}>{r.icon}</Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "#0d1b2a" }} noWrap>{r.text}</Typography>
                                            <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{r.date}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader icon={<AddCircleOutlineIcon />} title="Quick Actions" gradient="linear-gradient(135deg, #0d1b2a, #1565c0)" />
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                <Button fullWidth variant="contained" onClick={() => navigate("/book")} startIcon={<AddCircleOutlineIcon />}
                                    sx={{ py: 1.3, borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "0.88rem", background: "linear-gradient(135deg, #1565c0, #0097a7)", boxShadow: "0 4px 16px rgba(21,101,192,0.3)", "&:hover": { boxShadow: "0 8px 24px rgba(21,101,192,0.4)", transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                                    Book Appointment
                                </Button>
                                <Button fullWidth variant="outlined" onClick={() => { setIsFirstPet(false); setShowAddPet(true); }} startIcon={<AddIcon />}
                                    sx={{ py: 1.3, borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "0.88rem", color: "#1565c0", borderColor: "#e3f2fd", backgroundColor: "#f5f9ff", "&:hover": { borderColor: "#90caf9", backgroundColor: "#e3f2fd" } }}>
                                    Add a Pet
                                </Button>
                                <Button fullWidth variant="outlined" startIcon={<LocalHospitalOutlinedIcon />}
                                    sx={{ py: 1.3, borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "0.88rem", color: "#b71c1c", borderColor: "#fde8e8", backgroundColor: "#fff8f8", "&:hover": { borderColor: "#ef9a9a", backgroundColor: "#fde8e8" } }}>
                                    Emergency Contact
                                </Button>
                            </Box>
                        </Card>
                    </Box>
                </Box>

                {/* ── ROW 3: Billing ── */}
                {billingRows.length > 0 && (
                    <Card>
                        <CardHeader icon={<ReceiptOutlinedIcon />} title="Billing History" gradient="linear-gradient(135deg, #1b5e20, #0097a7)" action={<ViewAll />} />
                        <TableContainer sx={{ borderRadius: "12px", border: "1px solid #f0f4f8" }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                        {["Date", "Service", "Invoice", "Amount", "Status"].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 700, color: "#6b7c93", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", border: "none", py: 1.5 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {billingRows.map((bill) => (
                                        <TableRow key={bill.id} sx={{ "&:last-child td": { border: "none" }, "&:hover": { backgroundColor: "#f8fafc" }, transition: "background 0.15s" }}>
                                            <TableCell sx={{ fontSize: "0.82rem", color: "#0d1b2a", py: 1.8 }}>{bill.date}</TableCell>
                                            <TableCell sx={{ fontSize: "0.82rem", color: "#444", fontWeight: 600 }}>{bill.service}</TableCell>
                                            <TableCell sx={{ fontSize: "0.78rem", color: "text.secondary" }}>{bill.invoiceNo}</TableCell>
                                            <TableCell sx={{ fontSize: "0.82rem", fontWeight: 800, color: "#0d1b2a" }}>
                                                {bill.amount != null ? `$${bill.amount}` : <Typography component="span" sx={{ fontSize: "0.78rem", color: "text.secondary", fontWeight: 500 }}>—</Typography>}
                                            </TableCell>
                                            <TableCell>{statusChip(bill.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ mt: 2, pt: 2, borderTop: "1px dashed #e0e7ef", display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.85rem" }}>Total paid</Typography>
                            <Typography sx={{ fontWeight: 800, color: "#0d1b2a" }}>${parseFloat(totalSpent).toFixed(2)}</Typography>
                        </Box>
                    </Card>
                )}
            </Container>
        </Box>
    );
};

export default Dashboard;
