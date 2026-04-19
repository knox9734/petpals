import React, { useState, useEffect, useContext } from "react";
import {
    Box, Typography, Container, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Avatar, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, IconButton, CircularProgress,
    InputAdornment, Tabs, Tab,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { staffAPI } from "../api";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── helpers ──────────────────────────────────────────────────────────

const STATUS_COLORS = {
    Upcoming:  { bg: "#e3f2fd", color: "#1565c0" },
    Completed: { bg: "#e8f5e9", color: "#2e7d32" },
    Cancelled: { bg: "#fde8e8", color: "#c62828" },
    Pending:   { bg: "#fff8e1", color: "#f57f17" },
    Paid:      { bg: "#e8f5e9", color: "#2e7d32" },
    Waived:    { bg: "#f3e5f5", color: "#7b1fa2" },
};

const StatusChip = ({ status }) => {
    const s = STATUS_COLORS[status] || { bg: "#f5f5f5", color: "#555" };
    return (
        <Chip label={status} size="small"
            sx={{ backgroundColor: s.bg, color: s.color, fontWeight: 700, fontSize: "0.72rem", height: 22, borderRadius: "8px" }} />
    );
};

const Card = ({ children, sx = {} }) => (
    <Box sx={{ backgroundColor: "white", borderRadius: "20px", p: 3, boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.05)", ...sx }}>
        {children}
    </Box>
);

const fieldStyle = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px", backgroundColor: "#f8fafc", fontSize: "0.95rem",
        "& fieldset": { borderColor: "#dde3ed" },
        "&:hover fieldset": { borderColor: "#b0bec5" },
        "&.Mui-focused fieldset": { borderColor: "#1565c0", borderWidth: "1.5px" },
    },
};

const iconSx = { color: "#9aa5b4", fontSize: 20 };

// ─── stat card ────────────────────────────────────────────────────────

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

// ─── Update Appointment Modal ──────────────────────────────────────────

function UpdateAppointmentModal({ appt, open, onClose, onSaved }) {
    const [status, setStatus]   = useState(appt?.status || "Upcoming");
    const [doctor, setDoctor]   = useState(appt?.doctor || "");
    const [notes, setNotes]     = useState(appt?.notes  || "");
    const [saving, setSaving]   = useState(false);
    const [error, setError]     = useState("");

    useEffect(() => {
        if (appt) { setStatus(appt.status); setDoctor(appt.doctor || ""); setNotes(appt.notes || ""); }
    }, [appt]);

    const handleSave = async () => {
        setSaving(true); setError("");
        try {
            await staffAPI.updateAppointment(appt.id, { status, doctor, notes });
            onSaved();
            onClose();
        } catch (err) {
            setError(err?.error || "Failed to update. Please try again.");
        } finally { setSaving(false); }
    };

    if (!appt) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
            <DialogTitle sx={{ pb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: "linear-gradient(135deg, #1565c0, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <EditOutlinedIcon sx={{ color: "white", fontSize: 18 }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={800} fontSize="1rem" color="#0d1b2a">Update Appointment</Typography>
                            <Typography fontSize="0.78rem" color="text.secondary">#{appt.id} · {appt.pet_name} · {appt.service}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#9aa5b4" }}><CloseIcon fontSize="small" /></IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Box sx={{ mb: 2, p: 1.5, borderRadius: "10px", backgroundColor: "#fde8e8", border: "1px solid #f5c6c6" }}>
                        <Typography sx={{ color: "#c62828", fontSize: "0.83rem" }}>{error}</Typography>
                    </Box>
                )}

                <Typography sx={{ fontWeight: 600, fontSize: "0.83rem", color: "#0d1b2a", mb: 0.7 }}>Status</Typography>
                <TextField select fullWidth value={status} onChange={(e) => setStatus(e.target.value)} sx={{ ...fieldStyle, mb: 2.5 }}>
                    {["Upcoming", "Completed", "Cancelled"].map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </TextField>

                <Typography sx={{ fontWeight: 600, fontSize: "0.83rem", color: "#0d1b2a", mb: 0.7 }}>Assigned Doctor</Typography>
                <TextField fullWidth placeholder="Dr. Smith" value={doctor} onChange={(e) => setDoctor(e.target.value)} sx={{ ...fieldStyle, mb: 2.5 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={iconSx} /></InputAdornment> }} />

                <Typography sx={{ fontWeight: 600, fontSize: "0.83rem", color: "#0d1b2a", mb: 0.7 }}>Internal Notes</Typography>
                <TextField fullWidth multiline rows={3} placeholder="Staff notes…" value={notes} onChange={(e) => setNotes(e.target.value)} sx={fieldStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: "14px", alignSelf: "flex-start" }}><NotesOutlinedIcon sx={iconSx} /></InputAdornment> }} />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, color: "#666", borderColor: "#dde3ed" }}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving} variant="contained"
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg, #1565c0, #0097a7)", "&.Mui-disabled": { opacity: 0.6 } }}>
                    {saving ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── Add Invoice Modal ─────────────────────────────────────────────────

function InvoiceModal({ appt, existingInvoice, open, onClose, onSaved }) {
    const isEdit = !!existingInvoice;
    const [amount, setAmount]   = useState(existingInvoice?.amount ?? "");
    const [status, setStatus]   = useState(existingInvoice?.status ?? "Pending");
    const [notes, setNotes]     = useState(existingInvoice?.notes  ?? "");
    const [saving, setSaving]   = useState(false);
    const [error, setError]     = useState("");

    useEffect(() => {
        if (existingInvoice) { setAmount(existingInvoice.amount); setStatus(existingInvoice.status); setNotes(existingInvoice.notes || ""); }
        else { setAmount(""); setStatus("Pending"); setNotes(""); }
    }, [existingInvoice, open]);

    const handleSave = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError("Please enter a valid amount."); return;
        }
        setSaving(true); setError("");
        try {
            if (isEdit) {
                await staffAPI.updateInvoice(existingInvoice.id, { amount: Number(amount), status, notes });
            } else {
                await staffAPI.createInvoice({ appointment: appt.id, amount: Number(amount), status, notes });
            }
            onSaved();
            onClose();
        } catch (err) {
            setError(err?.error || err?.detail || "Failed to save invoice.");
        } finally { setSaving(false); }
    };

    if (!appt) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
            <DialogTitle sx={{ pb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: "linear-gradient(135deg, #1b5e20, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ReceiptOutlinedIcon sx={{ color: "white", fontSize: 18 }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={800} fontSize="1rem" color="#0d1b2a">{isEdit ? "Edit Invoice" : "Create Invoice"}</Typography>
                            <Typography fontSize="0.78rem" color="text.secondary">#{appt.id} · {appt.pet_name} · {appt.service}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small" sx={{ color: "#9aa5b4" }}><CloseIcon fontSize="small" /></IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {error && (
                    <Box sx={{ mb: 2, p: 1.5, borderRadius: "10px", backgroundColor: "#fde8e8", border: "1px solid #f5c6c6" }}>
                        <Typography sx={{ color: "#c62828", fontSize: "0.83rem" }}>{error}</Typography>
                    </Box>
                )}

                <Typography sx={{ fontWeight: 600, fontSize: "0.83rem", color: "#0d1b2a", mb: 0.7 }}>Amount (USD) *</Typography>
                <TextField fullWidth type="number" placeholder="50.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                    inputProps={{ min: 0, step: 0.01 }} sx={{ ...fieldStyle, mb: 2.5 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon sx={iconSx} /></InputAdornment> }} />

                <Typography sx={{ fontWeight: 600, fontSize: "0.83rem", color: "#0d1b2a", mb: 0.7 }}>Payment Status</Typography>
                <TextField select fullWidth value={status} onChange={(e) => setStatus(e.target.value)} sx={{ ...fieldStyle, mb: 2.5 }}>
                    {["Pending", "Paid", "Waived"].map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                </TextField>

                <Typography sx={{ fontWeight: 600, fontSize: "0.83rem", color: "#0d1b2a", mb: 0.7 }}>Notes <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>(optional)</Typography></Typography>
                <TextField fullWidth multiline rows={2} placeholder="Services rendered, discounts…" value={notes} onChange={(e) => setNotes(e.target.value)} sx={fieldStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: "14px", alignSelf: "flex-start" }}><NotesOutlinedIcon sx={iconSx} /></InputAdornment> }} />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, color: "#666", borderColor: "#dde3ed" }}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving} variant="contained"
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg, #1b5e20, #0097a7)", "&.Mui-disabled": { opacity: 0.6 } }}>
                    {saving ? <CircularProgress size={18} sx={{ color: "white" }} /> : isEdit ? "Update Invoice" : "Create Invoice"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────

export default function StaffPanel() {
    const { user } = useContext(AuthContext);
    const navigate  = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading]           = useState(true);
    const [tab, setTab]                   = useState(0);   // 0=all 1=upcoming 2=completed 3=cancelled

    const [editAppt,   setEditAppt]   = useState(null);
    const [invoiceAppt, setInvoiceAppt] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const data = await staffAPI.appointments();
            setAppointments(data);
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const tabFilters = ["All", "Upcoming", "Completed", "Cancelled"];
    const filtered = tab === 0 ? appointments : appointments.filter(a => a.status === tabFilters[tab]);

    // Stats
    const total      = appointments.length;
    const upcoming   = appointments.filter(a => a.status === "Upcoming").length;
    const completed  = appointments.filter(a => a.status === "Completed").length;
    const revenue    = appointments.reduce((sum, a) => {
        if (a.invoice && a.invoice.status === "Paid") return sum + parseFloat(a.invoice.amount);
        return sum;
    }, 0);

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f7fb" }}>

            {/* ── HEADER ── */}
            <Box sx={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1b5e20 60%, #0097a7 100%)", pt: 5, pb: 9, px: { xs: 3, md: 6 }, position: "relative", overflow: "hidden" }}>
                {[...Array(4)].map((_, i) => (
                    <PetsIcon key={i} sx={{ position: "absolute", fontSize: `${60 + i * 30}px`, opacity: 0.05, top: `${10 + i * 20}%`, right: `${5 + i * 12}%`, transform: `rotate(${i * 20}deg)`, pointerEvents: "none" }} />
                ))}
                <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2, mb: 4 }}>
                        <Box>
                            <Typography sx={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>Staff Portal</Typography>
                            <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.4rem" }}>
                                Appointment Management
                            </Typography>
                            <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", mt: 0.3 }}>
                                {user?.first_name} {user?.last_name} · Cashier / Staff
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1.5 }}>
                            <Button onClick={load} startIcon={<RefreshIcon />} variant="contained"
                                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", boxShadow: "none", "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" } }}>
                                Refresh
                            </Button>
                            <Button onClick={() => navigate("/dashboard")} variant="contained"
                                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, backgroundColor: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", boxShadow: "none", "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" } }}>
                                My Dashboard
                            </Button>
                        </Box>
                    </Box>

                    {/* Stats */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <StatCard icon={<MedicalServicesOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Total Appointments" value={total} gradient="linear-gradient(135deg, #1565c0, #0097a7)" />
                        <StatCard icon={<PetsIcon sx={{ color: "white", fontSize: 22 }} />} label="Upcoming" value={upcoming} gradient="linear-gradient(135deg, #f57c00, #ffc107)" />
                        <StatCard icon={<CheckCircleOutlineIcon sx={{ color: "white", fontSize: 22 }} />} label="Completed" value={completed} gradient="linear-gradient(135deg, #1b5e20, #0097a7)" />
                        <StatCard icon={<ReceiptOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Revenue Collected" value={`$${revenue.toFixed(2)}`} gradient="linear-gradient(135deg, #4527a0, #7b1fa2)" />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, pb: 8 }}>
                <Card>
                    {/* Tab bar */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 2 }}>
                        <Tabs value={tab} onChange={(_, v) => setTab(v)}
                            sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: "0.88rem", minHeight: 40 }, "& .MuiTabs-indicator": { background: "linear-gradient(135deg, #1565c0, #0097a7)", borderRadius: 2 } }}>
                            {tabFilters.map((label, i) => (
                                <Tab key={label} label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                                        {label}
                                        <Box sx={{ px: 0.9, py: 0.1, borderRadius: "8px", backgroundColor: tab === i ? "#e3f2fd" : "#f5f5f5", color: tab === i ? "#1565c0" : "#888", fontSize: "0.72rem", fontWeight: 700 }}>
                                            {i === 0 ? total : appointments.filter(a => a.status === label).length}
                                        </Box>
                                    </Box>
                                } />
                            ))}
                        </Tabs>
                    </Box>

                    {loading ? (
                        <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                            <CircularProgress sx={{ color: "#1565c0" }} />
                        </Box>
                    ) : filtered.length === 0 ? (
                        <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
                            <MedicalServicesOutlinedIcon sx={{ fontSize: 48, opacity: 0.2, mb: 1 }} />
                            <Typography>No appointments found.</Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ borderRadius: "12px", border: "1px solid #f0f4f8" }}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                        {["#", "Pet / Owner", "Service", "Date & Time", "Doctor", "Status", "Invoice", "Actions"].map(h => (
                                            <TableCell key={h} sx={{ fontWeight: 700, color: "#6b7c93", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.5px", border: "none", py: 1.5, whiteSpace: "nowrap" }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filtered.map((appt) => (
                                        <TableRow key={appt.id} sx={{ "&:last-child td": { border: "none" }, "&:hover": { backgroundColor: "#f8fafc" }, transition: "background 0.15s" }}>
                                            {/* ID */}
                                            <TableCell sx={{ fontSize: "0.78rem", color: "#9aa5b4", py: 2 }}>#{appt.id}</TableCell>

                                            {/* Pet / Owner */}
                                            <TableCell>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", background: "linear-gradient(135deg, #1565c0, #0097a7)", fontWeight: 700 }}>
                                                        {appt.pet_name?.[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#0d1b2a", lineHeight: 1.2 }}>{appt.pet_name}</Typography>
                                                        <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{appt.owner_name}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>

                                            {/* Service */}
                                            <TableCell sx={{ fontSize: "0.83rem", color: "#444", fontWeight: 600 }}>{appt.service}</TableCell>

                                            {/* Date & Time */}
                                            <TableCell>
                                                <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "#0d1b2a" }}>{appt.date}</Typography>
                                                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>{appt.time}</Typography>
                                            </TableCell>

                                            {/* Doctor */}
                                            <TableCell sx={{ fontSize: "0.83rem", color: appt.doctor && appt.doctor !== "TBD" ? "#0d1b2a" : "#bbb" }}>
                                                {appt.doctor || "—"}
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell><StatusChip status={appt.status} /></TableCell>

                                            {/* Invoice */}
                                            <TableCell>
                                                {appt.invoice ? (
                                                    <Box>
                                                        <Typography sx={{ fontSize: "0.83rem", fontWeight: 800, color: "#0d1b2a" }}>${parseFloat(appt.invoice.amount).toFixed(2)}</Typography>
                                                        <StatusChip status={appt.invoice.status} />
                                                    </Box>
                                                ) : (
                                                    <Typography sx={{ fontSize: "0.75rem", color: "#bbb" }}>No invoice</Typography>
                                                )}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>
                                                <Box sx={{ display: "flex", gap: 0.8 }}>
                                                    <IconButton size="small" onClick={() => setEditAppt(appt)} title="Update status / doctor"
                                                        sx={{ width: 30, height: 30, borderRadius: "8px", backgroundColor: "#e3f2fd", color: "#1565c0", "&:hover": { backgroundColor: "#bbdefb" } }}>
                                                        <EditOutlinedIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => setInvoiceAppt(appt)} title={appt.invoice ? "Edit invoice" : "Add invoice"}
                                                        sx={{ width: 30, height: 30, borderRadius: "8px", backgroundColor: appt.invoice ? "#e8f5e9" : "#fff8e1", color: appt.invoice ? "#2e7d32" : "#f57c00", "&:hover": { backgroundColor: appt.invoice ? "#c8e6c9" : "#ffe082" } }}>
                                                        {appt.invoice ? <ReceiptOutlinedIcon sx={{ fontSize: 16 }} /> : <AddCircleOutlineIcon sx={{ fontSize: 16 }} />}
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Card>
            </Container>

            {/* Modals */}
            <UpdateAppointmentModal
                appt={editAppt}
                open={!!editAppt}
                onClose={() => setEditAppt(null)}
                onSaved={() => { load(); setEditAppt(null); }}
            />
            <InvoiceModal
                appt={invoiceAppt}
                existingInvoice={invoiceAppt?.invoice || null}
                open={!!invoiceAppt}
                onClose={() => setInvoiceAppt(null)}
                onSaved={() => { load(); setInvoiceAppt(null); }}
            />
        </Box>
    );
}
