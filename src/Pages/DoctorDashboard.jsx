import React, { useState, useEffect, useContext } from "react";
import {
    Box, Typography, Container, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Avatar,
    CircularProgress, Tabs, Tab,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { doctorAPI } from "../api";
import { AuthContext } from "../Context/AuthContext";

const STATUS_COLORS = {
    Upcoming:  { bg: "#e3f2fd", color: "#1565c0" },
    Completed: { bg: "#e8f5e9", color: "#2e7d32" },
    Cancelled: { bg: "#fde8e8", color: "#c62828" },
};

const StatusChip = ({ status }) => {
    const s = STATUS_COLORS[status] || { bg: "#f5f5f5", color: "#555" };
    return <Chip label={status} size="small" sx={{ backgroundColor: s.bg, color: s.color, fontWeight: 700, fontSize: "0.72rem", height: 22, borderRadius: "8px" }} />;
};

const Card = ({ children, sx = {} }) => (
    <Box sx={{ backgroundColor: "white", borderRadius: "20px", p: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", ...sx }}>
        {children}
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
        <LocalHospitalOutlinedIcon sx={{ position: "absolute", right: -10, bottom: -10, fontSize: 80, opacity: 0.08 }} />
    </Box>
);

export default function DoctorDashboard() {
    const { user } = useContext(AuthContext);
    const [data, setData]       = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab]         = useState(0); // 0=All 1=Upcoming 2=Completed

    useEffect(() => {
        doctorAPI.dashboard()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress size={48} sx={{ color: "#0097a7" }} />
            </Box>
        );
    }

    const { doctor, appointments = [], earnings = [], total_earnings = 0,
            upcoming_count = 0, completed_count = 0, total_appointments = 0 } = data || {};

    const tabLabels = ["All", "Upcoming", "Completed"];
    const filteredAppts = tab === 0 ? appointments
        : appointments.filter(a => a.status === tabLabels[tab]);

    const initials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase() || "DR";

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fb" }}>

            {/* ── HEADER ── */}
            <Box sx={{ background: "linear-gradient(135deg, #0d1b2a 0%, #006064 55%, #0097a7 100%)", pt: 5, pb: 9, px: { xs: 3, md: 6 }, position: "relative", overflow: "hidden" }}>
                {[...Array(4)].map((_, i) => (
                    <LocalHospitalOutlinedIcon key={i} sx={{ position: "absolute", fontSize: `${60 + i * 30}px`, opacity: 0.05, top: `${10 + i * 20}%`, right: `${5 + i * 12}%`, transform: `rotate(${i * 20}deg)`, pointerEvents: "none" }} />
                ))}
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 4 }}>
                        <Avatar sx={{ width: 64, height: 64, background: "linear-gradient(135deg, #80deea, #0097a7)", fontSize: "1.5rem", fontWeight: 800, border: "3px solid rgba(255,255,255,0.3)" }}>
                            {initials}
                        </Avatar>
                        <Box>
                            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Doctor Portal</Typography>
                            <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.5rem" }}>
                                {doctor?.full_name || `Dr. ${user?.first_name} ${user?.last_name}`}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                <Chip label={doctor?.specialty || "Veterinarian"} size="small"
                                    sx={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white", fontWeight: 600, fontSize: "0.75rem", border: "1px solid rgba(255,255,255,0.25)" }} />
                                {doctor?.phone && (
                                    <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>{doctor.phone}</Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <StatCard icon={<MedicalServicesOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Total Appointments" value={total_appointments} gradient="linear-gradient(135deg, #006064, #0097a7)" />
                        <StatCard icon={<CalendarTodayOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Upcoming" value={upcoming_count} gradient="linear-gradient(135deg, #f57c00, #ffc107)" />
                        <StatCard icon={<CheckCircleOutlineIcon sx={{ color: "white", fontSize: 22 }} />} label="Completed" value={completed_count} gradient="linear-gradient(135deg, #1b5e20, #0097a7)" />
                        <StatCard icon={<AttachMoneyIcon sx={{ color: "white", fontSize: 22 }} />} label="Total Earnings" value={`$${total_earnings.toFixed(2)}`} gradient="linear-gradient(135deg, #4527a0, #7b1fa2)" />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, pb: 8 }}>

                {/* ── APPOINTMENTS ── */}
                <Card sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                        <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #006064, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <MedicalServicesOutlinedIcon sx={{ color: "white", fontSize: 18 }} />
                        </Box>
                        <Typography fontWeight={800} fontSize="1rem" color="#0d1b2a">My Appointments</Typography>
                    </Box>

                    <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: "0.88rem", minHeight: 38 }, "& .MuiTabs-indicator": { background: "linear-gradient(135deg, #006064, #0097a7)", borderRadius: 2 } }}>
                        {tabLabels.map((label, i) => (
                            <Tab key={label} label={
                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                    {label}
                                    <Box sx={{ px: 0.9, py: 0.1, borderRadius: "8px", backgroundColor: tab === i ? "#e0f7fa" : "#f5f5f5", color: tab === i ? "#006064" : "#888", fontSize: "0.72rem", fontWeight: 700 }}>
                                        {i === 0 ? total_appointments : appointments.filter(a => a.status === label).length}
                                    </Box>
                                </Box>
                            } />
                        ))}
                    </Tabs>

                    {filteredAppts.length === 0 ? (
                        <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                            <MedicalServicesOutlinedIcon sx={{ fontSize: 44, opacity: 0.2, mb: 1 }} />
                            <Typography fontSize="0.9rem">No appointments found.</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ borderRadius: "12px", border: "1px solid #f0f4f8" }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                        {["Patient / Owner", "Service", "Date & Time", "Status", "Notes"].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 700, color: "#6b7c93", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", border: "none", py: 1.5 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAppts.map((appt) => (
                                        <TableRow key={appt.id} sx={{ "&:last-child td": { border: "none" }, "&:hover": { backgroundColor: "#f8fafc" }, transition: "background 0.15s" }}>
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", background: "linear-gradient(135deg, #006064, #0097a7)", fontWeight: 700 }}>
                                                        {appt.pet_name?.[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#0d1b2a", lineHeight: 1.2 }}>{appt.pet_name}</Typography>
                                                        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{appt.owner_name}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: "0.83rem", color: "#444", fontWeight: 600 }}>{appt.service}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "#0d1b2a" }}>{appt.date}</Typography>
                                                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{appt.time}</Typography>
                                            </TableCell>
                                            <TableCell><StatusChip status={appt.status} /></TableCell>
                                            <TableCell sx={{ fontSize: "0.8rem", color: "#666", maxWidth: 200 }}>
                                                <Typography noWrap sx={{ fontSize: "0.8rem", color: "#666" }}>{appt.notes || "—"}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>

                {/* ── EARNINGS ── */}
                <Card>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box sx={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #4527a0, #7b1fa2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <AttachMoneyIcon sx={{ color: "white", fontSize: 18 }} />
                            </Box>
                            <Typography fontWeight={800} fontSize="1rem" color="#0d1b2a">Earnings History</Typography>
                        </Box>
                        <Box sx={{ px: 2, py: 0.8, borderRadius: "12px", background: "linear-gradient(135deg, #4527a0, #7b1fa2)" }}>
                            <Typography sx={{ color: "white", fontWeight: 800, fontSize: "0.95rem" }}>${total_earnings.toFixed(2)} total</Typography>
                        </Box>
                    </Box>

                    {earnings.length === 0 ? (
                        <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}>
                            <ReceiptOutlinedIcon sx={{ fontSize: 44, opacity: 0.2, mb: 1 }} />
                            <Typography fontSize="0.9rem">No earnings recorded yet.</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ borderRadius: "12px", border: "1px solid #f0f4f8" }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                        {["Date", "Amount", "Appointment", "Notes"].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 700, color: "#6b7c93", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", border: "none", py: 1.5 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {earnings.map((e) => (
                                        <TableRow key={e.id} sx={{ "&:last-child td": { border: "none" }, "&:hover": { backgroundColor: "#f8fafc" }, transition: "background 0.15s" }}>
                                            <TableCell sx={{ fontSize: "0.83rem", fontWeight: 600, color: "#0d1b2a", py: 2 }}>{e.date}</TableCell>
                                            <TableCell>
                                                <Typography sx={{ fontSize: "0.9rem", fontWeight: 800, color: "#2e7d32" }}>${parseFloat(e.amount).toFixed(2)}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: "0.8rem", color: "#555", maxWidth: 220 }}>
                                                <Typography noWrap sx={{ fontSize: "0.8rem" }}>{e.appointment_info || "—"}</Typography>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: "0.8rem", color: "#666" }}>{e.notes || "—"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>
            </Container>
        </Box>
    );
}
