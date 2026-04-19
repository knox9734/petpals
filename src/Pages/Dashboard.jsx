import React, { useState, useEffect } from "react";
import {
    Box, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button,
    Chip, Avatar, Container, LinearProgress,
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
import { useNavigate } from "react-router-dom";

const appointmentsData = [
    { id: 1, date: "2026-05-10", time: "11:30 AM", petName: "Buddy", service: "General Checkup", doctor: "Dr. Smith", status: "Upcoming" },
    { id: 2, date: "2026-02-20", time: "10:00 AM", petName: "Buddy", service: "Vaccination", doctor: "Dr. Smith", status: "Completed" },
    { id: 3, date: "2026-01-15", time: "02:00 PM", petName: "Milo", service: "Dental Care", doctor: "Dr. Brown", status: "Completed" },
    { id: 4, date: "2025-11-05", time: "09:30 AM", petName: "Milo", service: "Grooming", doctor: "Dr. Lee", status: "Completed" },
    { id: 5, date: "2025-09-18", time: "03:00 PM", petName: "Buddy", service: "Emergency Care", doctor: "Dr. Smith", status: "Completed" },
    { id: 6, date: "2025-07-22", time: "01:00 PM", petName: "Milo", service: "Vaccination", doctor: "Dr. Brown", status: "Completed" },
];

const billingData = [
    { id: 1, date: "2026-05-10", invoiceNo: "INV003", service: "General Checkup", amount: 40, status: "Pending" },
    { id: 2, date: "2026-02-20", invoiceNo: "INV002", service: "Vaccination", amount: 50, status: "Paid" },
    { id: 3, date: "2026-01-15", invoiceNo: "INV001", service: "Dental Care", amount: 75, status: "Paid" },
    { id: 4, date: "2025-11-05", invoiceNo: "INV000", service: "Grooming", amount: 35, status: "Paid" },
    { id: 5, date: "2025-09-18", invoiceNo: "INV-E01", service: "Emergency Care", amount: 120, status: "Paid" },
];

const petsData = [
    { name: "Buddy", species: "Dog", breed: "Golden Retriever", age: "3 yrs", weight: "28 kg", lastVisit: "2026-02-20", health: 92, color: "linear-gradient(135deg, #1565c0, #0097a7)", avatar: "🐕" },
    { name: "Milo",  species: "Cat", breed: "British Shorthair", age: "5 yrs", weight: "5.2 kg", lastVisit: "2026-01-15", health: 87, color: "linear-gradient(135deg, #4527a0, #7b1fa2)", avatar: "🐈" },
];

const reminders = [
    { icon: <VaccinesOutlinedIcon sx={{ fontSize: 18 }} />, text: "Buddy's annual vaccination due", date: "In 18 days", color: "#fff3e0", iconColor: "#f57c00" },
    { icon: <ContentCutOutlinedIcon sx={{ fontSize: 18 }} />, text: "Milo's grooming session", date: "In 30 days", color: "#f3e5f5", iconColor: "#7b1fa2" },
    { icon: <MonitorHeartOutlinedIcon sx={{ fontSize: 18 }} />, text: "Buddy's heartworm test", date: "In 45 days", color: "#e8f5e9", iconColor: "#2e7d32" },
    { icon: <ScienceOutlinedIcon sx={{ fontSize: 18 }} />, text: "Milo's blood panel review", date: "In 60 days", color: "#e3f2fd", iconColor: "#1565c0" },
];

const prescriptions = [
    { pet: "Buddy", med: "Heartgard Plus", dose: "1 chew/month", refills: 2, expires: "2026-08-01" },
    { pet: "Milo",  med: "Felimazole 2.5mg", dose: "Twice daily", refills: 1, expires: "2026-06-15" },
    { pet: "Buddy", med: "Apoquel 16mg", dose: "Once daily", refills: 0, expires: "2026-05-30" },
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
    const [appointments, setAppointments] = useState([]);
    const [billing, setBilling] = useState([]);

    useEffect(() => {
        setAppointments(appointmentsData);
        setBilling(billingData);
    }, []);

    const upcoming = appointments.find(a => a.status === "Upcoming");
    const totalSpent = billing.filter(b => b.status === "Paid").reduce((s, b) => s + b.amount, 0);

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fb" }}>

            {/* ── HEADER BANNER ── */}
            <Box sx={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1565c0 60%, #0097a7 100%)", pt: 5, pb: 9, px: { xs: 3, md: 6 }, position: "relative", overflow: "hidden" }}>
                {[...Array(4)].map((_, i) => (
                    <PetsIcon key={i} sx={{ position: "absolute", fontSize: `${60 + i * 30}px`, opacity: 0.05, top: `${10 + i * 20}%`, right: `${5 + i * 12}%`, transform: `rotate(${i * 20}deg)`, pointerEvents: "none" }} />
                ))}
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ width: 56, height: 56, background: "linear-gradient(135deg, #64d9fb, #1565c0)", fontSize: "1.4rem", fontWeight: 800 }}>J</Avatar>
                            <Box>
                                <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Welcome back</Typography>
                                <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.4rem" }}>John Doe</Typography>
                            </Box>
                        </Box>
                        <Button onClick={() => navigate("/book")} variant="contained" startIcon={<AddCircleOutlineIcon />}
                            sx={{ px: 3, py: 1.3, borderRadius: "12px", fontWeight: 700, textTransform: "none", backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", boxShadow: "none", "&:hover": { backgroundColor: "rgba(255,255,255,0.25)", boxShadow: "none" } }}>
                            New Appointment
                        </Button>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2, mt: 4, flexWrap: "wrap" }}>
                        <StatCard icon={<CalendarTodayOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Total Appointments" value={appointments.length} gradient="linear-gradient(135deg, #1565c0, #0097a7)" />
                        <StatCard icon={<PetsIcon sx={{ color: "white", fontSize: 22 }} />} label="Registered Pets" value={petsData.length} gradient="linear-gradient(135deg, #4527a0, #7b1fa2)" />
                        <StatCard icon={<ReceiptOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Total Spent" value={`$${totalSpent}`} gradient="linear-gradient(135deg, #1b5e20, #0097a7)" />
                        <StatCard icon={<MedicalServicesOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Next Appointment" value={upcoming ? upcoming.date : "—"} sub={upcoming ? `${upcoming.time} · ${upcoming.petName}` : "None scheduled"} gradient="linear-gradient(135deg, #b71c1c, #e91e63)" />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, pb: 8 }}>

                {/* Upcoming banner */}
                {upcoming && (
                    <Card sx={{ mb: 3, border: "1px solid #e3f2fd" }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ width: 48, height: 48, borderRadius: "14px", background: "linear-gradient(135deg, #1565c0, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <CalendarTodayOutlinedIcon sx={{ color: "white", fontSize: 22 }} />
                                </Box>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, color: "#0d1b2a", fontSize: "0.95rem" }}>
                                        Upcoming: {upcoming.service} for {upcoming.petName}
                                    </Typography>
                                    <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                                        {upcoming.date} at {upcoming.time} · {upcoming.doctor}
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
                <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                    {petsData.map((pet) => (
                        <Card key={pet.name} sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5 }}>
                                <Box sx={{ width: 52, height: 52, borderRadius: "16px", background: pet.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>
                                    {pet.avatar}
                                </Box>
                                <Box>
                                    <Typography fontWeight={800} fontSize="1.05rem" color="#0d1b2a">{pet.name}</Typography>
                                    <Typography fontSize="0.82rem" color="text.secondary">{pet.breed} · {pet.species}</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                                {[["Age", pet.age], ["Weight", pet.weight], ["Last visit", pet.lastVisit]].map(([k, v]) => (
                                    <Box key={k} sx={{ flex: 1, textAlign: "center", p: 1.2, borderRadius: "10px", backgroundColor: "#f8fafc" }}>
                                        <Typography fontSize="0.7rem" color="text.secondary" fontWeight={600}>{k}</Typography>
                                        <Typography fontSize="0.82rem" fontWeight={700} color="#0d1b2a" mt={0.3}>{v}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
                                    <Typography fontSize="0.78rem" color="text.secondary" fontWeight={600}>Health score</Typography>
                                    <Typography fontSize="0.78rem" fontWeight={800} color={pet.health >= 90 ? "#2e7d32" : "#f57f17"}>{pet.health}%</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={pet.health}
                                    sx={{ height: 8, borderRadius: 4, backgroundColor: "#f0f4f8", "& .MuiLinearProgress-bar": { borderRadius: 4, background: pet.color } }} />
                            </Box>
                        </Card>
                    ))}
                </Box>

                {/* ── ROW 2: Appointments + Right column ── */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3, mb: 3 }}>

                    {/* Appointment History */}
                    <Card sx={{ flex: 2 }}>
                        <CardHeader icon={<MedicalServicesOutlinedIcon />} title="Appointment History" gradient="linear-gradient(135deg, #1565c0, #0097a7)" action={<ViewAll />} />
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
                                                    <Avatar sx={{ width: 26, height: 26, fontSize: "0.72rem", backgroundColor: appt.petName === "Buddy" ? "#e3f2fd" : "#f3e5f5", color: appt.petName === "Buddy" ? "#1565c0" : "#7b1fa2", fontWeight: 700 }}>{appt.petName[0]}</Avatar>
                                                    <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "#0d1b2a" }}>{appt.petName}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ fontSize: "0.83rem", color: "#444" }}>{appt.service}</TableCell>
                                            <TableCell sx={{ fontSize: "0.83rem", color: "#444" }}>{appt.doctor}</TableCell>
                                            <TableCell>{statusChip(appt.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
                                <Button fullWidth variant="outlined" startIcon={<LocalHospitalOutlinedIcon />}
                                    sx={{ py: 1.3, borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "0.88rem", color: "#b71c1c", borderColor: "#fde8e8", backgroundColor: "#fff8f8", "&:hover": { borderColor: "#ef9a9a", backgroundColor: "#fde8e8" } }}>
                                    Emergency Contact
                                </Button>
                                <Button fullWidth variant="outlined" startIcon={<ReceiptOutlinedIcon />}
                                    sx={{ py: 1.3, borderRadius: "12px", fontWeight: 700, textTransform: "none", fontSize: "0.88rem", color: "#1b5e20", borderColor: "#e8f5e9", backgroundColor: "#f8fff8", "&:hover": { borderColor: "#a5d6a7", backgroundColor: "#e8f5e9" } }}>
                                    Download Reports
                                </Button>
                            </Box>
                        </Card>
                    </Box>
                </Box>

                {/* ── ROW 3: Billing + Prescriptions ── */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>

                    {/* Billing */}
                    <Card sx={{ flex: 1 }}>
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
                                    {billing.map((bill) => (
                                        <TableRow key={bill.id} sx={{ "&:last-child td": { border: "none" }, "&:hover": { backgroundColor: "#f8fafc" }, transition: "background 0.15s" }}>
                                            <TableCell sx={{ fontSize: "0.82rem", color: "#0d1b2a", py: 1.8 }}>{bill.date}</TableCell>
                                            <TableCell sx={{ fontSize: "0.82rem", color: "#444", fontWeight: 600 }}>{bill.service}</TableCell>
                                            <TableCell sx={{ fontSize: "0.78rem", color: "text.secondary" }}>{bill.invoiceNo}</TableCell>
                                            <TableCell sx={{ fontSize: "0.82rem", fontWeight: 800, color: "#0d1b2a" }}>${bill.amount}</TableCell>
                                            <TableCell>{statusChip(bill.status)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ mt: 2, pt: 2, borderTop: "1px dashed #e0e7ef", display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.85rem" }}>Total paid</Typography>
                            <Typography sx={{ fontWeight: 800, color: "#0d1b2a" }}>${totalSpent}</Typography>
                        </Box>
                    </Card>

                    {/* Prescriptions */}
                    <Card sx={{ flex: 1 }}>
                        <CardHeader icon={<ScienceOutlinedIcon />} title="Active Prescriptions" gradient="linear-gradient(135deg, #4527a0, #0097a7)" />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            {prescriptions.map((p, i) => (
                                <Box key={i} sx={{ p: 2, borderRadius: "14px", border: "1px solid #f0f4f8", backgroundColor: "#fafbfd", transition: "all 0.2s", "&:hover": { borderColor: "#dde3ed", backgroundColor: "#f5f7fb" } }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, fontSize: "0.9rem", color: "#0d1b2a" }}>{p.med}</Typography>
                                            <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>{p.pet} · {p.dose}</Typography>
                                        </Box>
                                        <Chip label={p.refills > 0 ? `${p.refills} refill${p.refills > 1 ? "s" : ""}` : "No refills"}
                                            size="small"
                                            sx={{ fontSize: "0.7rem", height: 22, borderRadius: "8px", backgroundColor: p.refills > 0 ? "#e3f2fd" : "#fde8e8", color: p.refills > 0 ? "#1565c0" : "#c62828", fontWeight: 700 }} />
                                    </Box>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Typography sx={{ fontSize: "0.73rem", color: "text.secondary" }}>Expires: {p.expires}</Typography>
                                        <Typography sx={{ fontSize: "0.73rem", color: "#1565c0", fontWeight: 600, cursor: "pointer" }}>Renew →</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Box>
            </Container>
        </Box>
    );
};

export default Dashboard;
