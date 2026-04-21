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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
    return <Chip label={status} size="small" sx={{ backgroundColor: s.bg, color: s.color, fontWeight: 700, fontSize: "0.72rem", height: 22, borderRadius: "8px" }} />;
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

const FieldLabel = ({ children }) => (
    <Typography sx={{ fontWeight: 600, fontSize: "0.83rem", color: "#0d1b2a", mb: 0.7 }}>{children}</Typography>
);

const StatCard = ({ icon, label, value, gradient }) => (
    <Box sx={{ flex: 1, minWidth: { xs: "calc(50% - 8px)", md: 0 }, p: 3, borderRadius: "20px", background: gradient, color: "white", position: "relative", overflow: "hidden" }}>
        <Box sx={{ width: 44, height: 44, borderRadius: "12px", backgroundColor: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>{icon}</Box>
        <Typography sx={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}>{value}</Typography>
        <Typography sx={{ fontSize: "0.8rem", opacity: 0.85, mt: 0.5 }}>{label}</Typography>
        <PetsIcon sx={{ position: "absolute", right: -10, bottom: -10, fontSize: 80, opacity: 0.08 }} />
    </Box>
);

// ─── Update Appointment Modal ──────────────────────────────────────────

function UpdateAppointmentModal({ appt, doctors, open, onClose, onSaved }) {
    const [apptStatus, setApptStatus] = useState(appt?.status || "Upcoming");
    const [doctor,     setDoctor]     = useState(appt?.doctor    || "");
    const [doctorProfile, setDoctorProfile] = useState(appt?.doctor_profile || "");
    const [notes,      setNotes]      = useState(appt?.notes     || "");
    const [saving,     setSaving]     = useState(false);
    const [error,      setError]      = useState("");

    useEffect(() => {
        if (appt) {
            setApptStatus(appt.status);
            setDoctor(appt.doctor || "");
            setDoctorProfile(appt.doctor_profile || "");
            setNotes(appt.notes || "");
        }
    }, [appt]);

    const handleSave = async () => {
        setSaving(true); setError("");
        try {
            await staffAPI.updateAppointment(appt.id, {
                status: apptStatus,
                doctor,
                doctor_profile: doctorProfile || null,
                notes,
            });
            onSaved(); onClose();
        } catch (err) {
            setError(err?.error || "Failed to update.");
        } finally { setSaving(false); }
    };

    const handleDoctorSelect = (val) => {
        setDoctorProfile(val);
        const doc = doctors.find(d => d.id === Number(val));
        if (doc) setDoctor(doc.full_name);
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
                    <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && <Box sx={{ mb: 2, p: 1.5, borderRadius: "10px", backgroundColor: "#fde8e8" }}><Typography sx={{ color: "#c62828", fontSize: "0.83rem" }}>{error}</Typography></Box>}
                <FieldLabel>Status</FieldLabel>
                <TextField select fullWidth value={apptStatus} onChange={e => setApptStatus(e.target.value)} sx={{ ...fieldStyle, mb: 2.5 }}>
                    {["Upcoming", "Completed", "Cancelled"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
                <FieldLabel>Assign Registered Doctor</FieldLabel>
                <TextField select fullWidth value={doctorProfile} onChange={e => handleDoctorSelect(e.target.value)} sx={{ ...fieldStyle, mb: 2.5 }}
                    SelectProps={{ displayEmpty: true }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LocalHospitalOutlinedIcon sx={iconSx} /></InputAdornment> }}>
                    <MenuItem value="">— None / Manual —</MenuItem>
                    {doctors.map(d => <MenuItem key={d.id} value={d.id}>{d.full_name} · {d.specialty}</MenuItem>)}
                </TextField>
                <FieldLabel>Doctor Name (manual override)</FieldLabel>
                <TextField fullWidth placeholder="Dr. Smith" value={doctor} onChange={e => setDoctor(e.target.value)} sx={{ ...fieldStyle, mb: 2.5 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={iconSx} /></InputAdornment> }} />
                <FieldLabel>Internal Notes</FieldLabel>
                <TextField fullWidth multiline rows={3} placeholder="Staff notes…" value={notes} onChange={e => setNotes(e.target.value)} sx={fieldStyle}
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

// ─── Invoice Modal ─────────────────────────────────────────────────────

function InvoiceModal({ appt, existingInvoice, open, onClose, onSaved }) {
    const isEdit = !!existingInvoice;
    const [amount, setAmount] = useState(existingInvoice?.amount ?? "");
    const [invStatus, setInvStatus] = useState(existingInvoice?.status ?? "Pending");
    const [notes, setNotes]   = useState(existingInvoice?.notes ?? "");
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState("");

    useEffect(() => {
        if (existingInvoice) { setAmount(existingInvoice.amount); setInvStatus(existingInvoice.status); setNotes(existingInvoice.notes || ""); }
        else { setAmount(""); setInvStatus("Pending"); setNotes(""); }
    }, [existingInvoice, open]);

    const handleSave = async () => {
        if (!amount || Number(amount) <= 0) { setError("Enter a valid amount."); return; }
        setSaving(true); setError("");
        try {
            if (isEdit) await staffAPI.updateInvoice(existingInvoice.id, { amount: Number(amount), status: invStatus, notes });
            else        await staffAPI.createInvoice({ appointment: appt.id, amount: Number(amount), status: invStatus, notes });
            onSaved(); onClose();
        } catch (err) { setError(err?.error || err?.detail || "Failed to save invoice."); }
        finally { setSaving(false); }
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
                    <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && <Box sx={{ mb: 2, p: 1.5, borderRadius: "10px", backgroundColor: "#fde8e8" }}><Typography sx={{ color: "#c62828", fontSize: "0.83rem" }}>{error}</Typography></Box>}
                <FieldLabel>Amount (USD) *</FieldLabel>
                <TextField fullWidth type="number" placeholder="50.00" value={amount} onChange={e => setAmount(e.target.value)}
                    inputProps={{ min: 0, step: 0.01 }} sx={{ ...fieldStyle, mb: 2.5 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon sx={iconSx} /></InputAdornment> }} />
                <FieldLabel>Payment Status</FieldLabel>
                <TextField select fullWidth value={invStatus} onChange={e => setInvStatus(e.target.value)} sx={{ ...fieldStyle, mb: 2.5 }}>
                    {["Pending", "Paid", "Waived"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
                <FieldLabel>Notes <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>(optional)</Typography></FieldLabel>
                <TextField fullWidth multiline rows={2} placeholder="Services rendered…" value={notes} onChange={e => setNotes(e.target.value)} sx={fieldStyle}
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

// ─── Create Doctor Modal ───────────────────────────────────────────────

const SPECIALTIES = ["General Veterinarian","Surgery","Dental Care","Dermatology","Oncology","Emergency Care","Other"];

function CreateDoctorModal({ open, onClose, onSaved }) {
    const [form, setForm] = useState({ first_name: "", last_name: "", email: "", password: "", specialty: "General Veterinarian", phone: "", bio: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState("");

    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleSave = async () => {
        if (!form.first_name || !form.email || !form.password) { setError("First name, email and password are required."); return; }
        setSaving(true); setError("");
        try {
            await staffAPI.createDoctor(form);
            setForm({ first_name: "", last_name: "", email: "", password: "", specialty: "General Veterinarian", phone: "", bio: "" });
            onSaved(); onClose();
        } catch (err) {
            setError(err?.error || err?.email?.[0] || "Failed to create doctor.");
        } finally { setSaving(false); }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
            <DialogTitle sx={{ pb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: "linear-gradient(135deg, #006064, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <LocalHospitalOutlinedIcon sx={{ color: "white", fontSize: 18 }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={800} fontSize="1rem" color="#0d1b2a">Add Doctor</Typography>
                            <Typography fontSize="0.78rem" color="text.secondary">Create a new doctor account</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && <Box sx={{ mb: 2, p: 1.5, borderRadius: "10px", backgroundColor: "#fde8e8" }}><Typography sx={{ color: "#c62828", fontSize: "0.83rem" }}>{error}</Typography></Box>}
                <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>First name *</FieldLabel>
                        <TextField fullWidth placeholder="Jane" value={form.first_name} onChange={set("first_name")} sx={fieldStyle}
                            InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlinedIcon sx={iconSx} /></InputAdornment> }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>Last name</FieldLabel>
                        <TextField fullWidth placeholder="Smith" value={form.last_name} onChange={set("last_name")} sx={fieldStyle} />
                    </Box>
                </Box>
                <FieldLabel>Work email *</FieldLabel>
                <TextField fullWidth placeholder="dr.smith@petpals.com" type="email" value={form.email} onChange={set("email")} sx={{ ...fieldStyle, mb: 2.5 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon sx={iconSx} /></InputAdornment> }} />
                <FieldLabel>Password *</FieldLabel>
                <TextField fullWidth placeholder="Min. 8 characters" type="password" value={form.password} onChange={set("password")} sx={{ ...fieldStyle, mb: 2.5 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={iconSx} /></InputAdornment> }} />
                <FieldLabel>Specialty</FieldLabel>
                <TextField select fullWidth value={form.specialty} onChange={set("specialty")} sx={{ ...fieldStyle, mb: 2.5 }}>
                    {SPECIALTIES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </TextField>
                <FieldLabel>Phone <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>(optional)</Typography></FieldLabel>
                <TextField fullWidth placeholder="+1 555 000 0000" value={form.phone} onChange={set("phone")} sx={{ ...fieldStyle, mb: 2.5 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon sx={iconSx} /></InputAdornment> }} />
                <FieldLabel>Bio <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>(optional)</Typography></FieldLabel>
                <TextField fullWidth multiline rows={2} placeholder="Short bio…" value={form.bio} onChange={set("bio")} sx={fieldStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: "14px", alignSelf: "flex-start" }}><NotesOutlinedIcon sx={iconSx} /></InputAdornment> }} />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, color: "#666", borderColor: "#dde3ed" }}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving} variant="contained"
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg, #006064, #0097a7)", "&.Mui-disabled": { opacity: 0.6 } }}>
                    {saving ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Create Doctor"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── Add Earning Modal ─────────────────────────────────────────────────

function AddEarningModal({ doctor, appointments, open, onClose, onSaved }) {
    const today = new Date().toISOString().split("T")[0];
    const [form, setForm] = useState({ amount: "", date: today, appointment: "", notes: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState("");

    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleSave = async () => {
        if (!form.amount || Number(form.amount) <= 0 || !form.date) { setError("Amount and date are required."); return; }
        setSaving(true); setError("");
        try {
            await staffAPI.createEarning({
                doctor: doctor.id,
                amount: Number(form.amount),
                date: form.date,
                appointment: form.appointment || null,
                notes: form.notes,
            });
            setForm({ amount: "", date: today, appointment: "", notes: "" });
            onSaved(); onClose();
        } catch (err) {
            setError(err?.error || "Failed to add earning.");
        } finally { setSaving(false); }
    };

    if (!doctor) return null;
    const doctorAppts = appointments.filter(a => a.doctor_profile === doctor.id || a.doctor_id === doctor.id);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
            <DialogTitle sx={{ pb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 38, height: 38, borderRadius: "10px", background: "linear-gradient(135deg, #4527a0, #7b1fa2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <AttachMoneyIcon sx={{ color: "white", fontSize: 18 }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={800} fontSize="1rem" color="#0d1b2a">Add Earning</Typography>
                            <Typography fontSize="0.78rem" color="text.secondary">{doctor.full_name}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={onClose} size="small"><CloseIcon fontSize="small" /></IconButton>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                {error && <Box sx={{ mb: 2, p: 1.5, borderRadius: "10px", backgroundColor: "#fde8e8" }}><Typography sx={{ color: "#c62828", fontSize: "0.83rem" }}>{error}</Typography></Box>}
                <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>Amount (USD) *</FieldLabel>
                        <TextField fullWidth type="number" placeholder="75.00" value={form.amount} onChange={set("amount")}
                            inputProps={{ min: 0, step: 0.01 }} sx={fieldStyle}
                            InputProps={{ startAdornment: <InputAdornment position="start"><AttachMoneyIcon sx={iconSx} /></InputAdornment> }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <FieldLabel>Date *</FieldLabel>
                        <TextField fullWidth type="date" value={form.date} onChange={set("date")} sx={fieldStyle}
                            InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayOutlinedIcon sx={iconSx} /></InputAdornment> }} />
                    </Box>
                </Box>
                <FieldLabel>Link to Appointment <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>(optional)</Typography></FieldLabel>
                <TextField select fullWidth value={form.appointment} onChange={set("appointment")} sx={{ ...fieldStyle, mb: 2.5 }}
                    SelectProps={{ displayEmpty: true }}>
                    <MenuItem value="">— No linked appointment —</MenuItem>
                    {doctorAppts.map(a => (
                        <MenuItem key={a.id} value={a.id}>#{a.id} · {a.pet_name} · {a.service} · {a.date}</MenuItem>
                    ))}
                </TextField>
                <FieldLabel>Notes <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>(optional)</Typography></FieldLabel>
                <TextField fullWidth multiline rows={2} placeholder="Consultation fee, bonus…" value={form.notes} onChange={set("notes")} sx={fieldStyle}
                    InputProps={{ startAdornment: <InputAdornment position="start" sx={{ mt: "14px", alignSelf: "flex-start" }}><NotesOutlinedIcon sx={iconSx} /></InputAdornment> }} />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, color: "#666", borderColor: "#dde3ed" }}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving} variant="contained"
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg, #4527a0, #7b1fa2)", "&.Mui-disabled": { opacity: 0.6 } }}>
                    {saving ? <CircularProgress size={18} sx={{ color: "white" }} /> : "Add Earning"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────

export default function StaffPanel() {
    const { user }  = useContext(AuthContext);
    const navigate  = useNavigate();

    // section: "appointments" | "doctors"
    const [section, setSection] = useState("appointments");

    const [appointments, setAppointments] = useState([]);
    const [doctors,      setDoctors]      = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [tab,          setTab]          = useState(0);

    const [editAppt,     setEditAppt]     = useState(null);
    const [invoiceAppt,  setInvoiceAppt]  = useState(null);
    const [showCreateDoctor, setShowCreateDoctor] = useState(false);
    const [earningDoctor,    setEarningDoctor]    = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const [appts, docs] = await Promise.all([staffAPI.appointments(), staffAPI.doctors()]);
            setAppointments(appts);
            setDoctors(docs);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const tabFilters = ["All", "Upcoming", "Completed", "Cancelled"];
    const filtered   = tab === 0 ? appointments : appointments.filter(a => a.status === tabFilters[tab]);

    const total     = appointments.length;
    const upcoming  = appointments.filter(a => a.status === "Upcoming").length;
    const completed = appointments.filter(a => a.status === "Completed").length;
    const revenue   = appointments.reduce((s, a) => a.invoice?.status === "Paid" ? s + parseFloat(a.invoice.amount) : s, 0);

    const DOCTOR_COLORS = ["linear-gradient(135deg, #006064, #0097a7)", "linear-gradient(135deg, #4527a0, #7b1fa2)", "linear-gradient(135deg, #1b5e20, #0097a7)", "linear-gradient(135deg, #b71c1c, #e91e63)"];

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
                            <Typography sx={{ color: "white", fontWeight: 800, fontSize: "1.4rem" }}>Clinic Management</Typography>
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

                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        <StatCard icon={<MedicalServicesOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Total Appointments" value={total} gradient="linear-gradient(135deg, #1565c0, #0097a7)" />
                        <StatCard icon={<PetsIcon sx={{ color: "white", fontSize: 22 }} />} label="Upcoming" value={upcoming} gradient="linear-gradient(135deg, #f57c00, #ffc107)" />
                        <StatCard icon={<CheckCircleOutlineIcon sx={{ color: "white", fontSize: 22 }} />} label="Completed" value={completed} gradient="linear-gradient(135deg, #1b5e20, #0097a7)" />
                        <StatCard icon={<LocalHospitalOutlinedIcon sx={{ color: "white", fontSize: 22 }} />} label="Doctors" value={doctors.length} gradient="linear-gradient(135deg, #006064, #0097a7)" />
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, pb: 8 }}>

                {/* Section Toggle */}
                <Box sx={{ display: "flex", gap: 1.5, mb: 3 }}>
                    {[{ key: "appointments", label: "Appointments", icon: <MedicalServicesOutlinedIcon sx={{ fontSize: 18 }} /> },
                      { key: "doctors",      label: "Doctors",      icon: <LocalHospitalOutlinedIcon  sx={{ fontSize: 18 }} /> }].map(s => (
                        <Button key={s.key} onClick={() => setSection(s.key)} startIcon={s.icon} variant={section === s.key ? "contained" : "outlined"}
                            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 2.5, py: 1.2,
                                ...(section === s.key
                                    ? { background: "linear-gradient(135deg, #0d1b2a, #1565c0)", boxShadow: "0 4px 16px rgba(21,101,192,0.3)" }
                                    : { color: "#0d1b2a", borderColor: "#dde3ed", backgroundColor: "white", "&:hover": { borderColor: "#b0bec5", backgroundColor: "#f5f7fb" } }) }}>
                            {s.label}
                        </Button>
                    ))}
                </Box>

                {loading ? (
                    <Box sx={{ py: 10, display: "flex", justifyContent: "center" }}><CircularProgress sx={{ color: "#1565c0" }} /></Box>
                ) : section === "appointments" ? (

                    /* ── APPOINTMENTS SECTION ── */
                    <Card>
                        <Tabs value={tab} onChange={(_, v) => setTab(v)}
                            sx={{ mb: 2, "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: "0.88rem", minHeight: 40 }, "& .MuiTabs-indicator": { background: "linear-gradient(135deg, #1565c0, #0097a7)", borderRadius: 2 } }}>
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

                        {filtered.length === 0 ? (
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
                                                <TableCell sx={{ fontSize: "0.78rem", color: "#9aa5b4", py: 2 }}>#{appt.id}</TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                                                        <Avatar sx={{ width: 32, height: 32, fontSize: "0.8rem", background: "linear-gradient(135deg, #1565c0, #0097a7)", fontWeight: 700 }}>{appt.pet_name?.[0]}</Avatar>
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
                                                <TableCell>
                                                    {appt.doctor_name ? (
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                                                            {appt.doctor_profile && <LocalHospitalOutlinedIcon sx={{ fontSize: 14, color: "#0097a7" }} />}
                                                            <Typography sx={{ fontSize: "0.83rem", color: "#0d1b2a" }}>{appt.doctor_name}</Typography>
                                                        </Box>
                                                    ) : <Typography sx={{ fontSize: "0.78rem", color: "#bbb" }}>TBD</Typography>}
                                                </TableCell>
                                                <TableCell><StatusChip status={appt.status} /></TableCell>
                                                <TableCell>
                                                    {appt.invoice ? (
                                                        <Box>
                                                            <Typography sx={{ fontSize: "0.83rem", fontWeight: 800, color: "#0d1b2a" }}>${parseFloat(appt.invoice.amount).toFixed(2)}</Typography>
                                                            <StatusChip status={appt.invoice.status} />
                                                        </Box>
                                                    ) : <Typography sx={{ fontSize: "0.75rem", color: "#bbb" }}>No invoice</Typography>}
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", gap: 0.8 }}>
                                                        <IconButton size="small" onClick={() => setEditAppt(appt)} title="Update"
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

                ) : (

                    /* ── DOCTORS SECTION ── */
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
                            <Typography fontWeight={800} fontSize="1.1rem" color="#0d1b2a">
                                {doctors.length} Doctor{doctors.length !== 1 ? "s" : ""} Registered
                            </Typography>
                            <Button onClick={() => setShowCreateDoctor(true)} variant="contained" startIcon={<AddCircleOutlineIcon />}
                                sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, background: "linear-gradient(135deg, #006064, #0097a7)", boxShadow: "0 4px 16px rgba(0,96,100,0.3)", "&:hover": { transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                                Add Doctor
                            </Button>
                        </Box>

                        {doctors.length === 0 ? (
                            <Card>
                                <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
                                    <LocalHospitalOutlinedIcon sx={{ fontSize: 56, opacity: 0.15, mb: 1.5 }} />
                                    <Typography fontWeight={700} fontSize="1rem" color="#0d1b2a" mb={0.5}>No doctors yet</Typography>
                                    <Typography fontSize="0.88rem">Click "Add Doctor" to create the first doctor profile.</Typography>
                                </Box>
                            </Card>
                        ) : (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {doctors.map((doc, idx) => {
                                    const color = DOCTOR_COLORS[idx % DOCTOR_COLORS.length];
                                    const docAppts = appointments.filter(a => a.doctor_profile === doc.id || a.doctor_id === doc.id);
                                    return (
                                        <Card key={doc.id}>
                                            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                                                {/* Left: avatar + info */}
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                    <Avatar sx={{ width: 56, height: 56, background: color, fontSize: "1.2rem", fontWeight: 800, border: "3px solid white", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
                                                        {`${doc.first_name?.[0] || ""}${doc.last_name?.[0] || ""}`.toUpperCase() || "DR"}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography fontWeight={800} fontSize="1.05rem" color="#0d1b2a">{doc.full_name}</Typography>
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.3 }}>
                                                            <Chip label={doc.specialty} size="small" sx={{ height: 20, fontSize: "0.72rem", fontWeight: 600, backgroundColor: "#e0f7fa", color: "#006064" }} />
                                                            {doc.phone && <Typography fontSize="0.78rem" color="text.secondary">{doc.phone}</Typography>}
                                                        </Box>
                                                        <Typography fontSize="0.78rem" color="text.secondary" mt={0.3}>{doc.email}</Typography>
                                                        {doc.bio && <Typography fontSize="0.78rem" color="text.secondary" mt={0.3} sx={{ maxWidth: 400 }}>{doc.bio}</Typography>}
                                                    </Box>
                                                </Box>

                                                {/* Right: stats + actions */}
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                                                    <Box sx={{ textAlign: "center", px: 2, py: 1, borderRadius: "12px", backgroundColor: "#f0f4f8" }}>
                                                        <Typography fontSize="1.2rem" fontWeight={800} color="#0d1b2a">{docAppts.length}</Typography>
                                                        <Typography fontSize="0.72rem" color="text.secondary">Appointments</Typography>
                                                    </Box>
                                                    <Box sx={{ textAlign: "center", px: 2, py: 1, borderRadius: "12px", backgroundColor: "#e8f5e9" }}>
                                                        <Typography fontSize="1.2rem" fontWeight={800} color="#2e7d32">${parseFloat(doc.total_earnings || 0).toFixed(2)}</Typography>
                                                        <Typography fontSize="0.72rem" color="text.secondary">Total Earned</Typography>
                                                    </Box>
                                                    <Button onClick={() => setEarningDoctor(doc)} variant="contained" startIcon={<AttachMoneyIcon />} size="small"
                                                        sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, fontSize: "0.82rem", background: "linear-gradient(135deg, #4527a0, #7b1fa2)", boxShadow: "0 4px 12px rgba(69,39,160,0.25)", "&:hover": { transform: "translateY(-1px)" }, transition: "all 0.2s" }}>
                                                        Add Earning
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>
                )}
            </Container>

            {/* Modals */}
            <UpdateAppointmentModal appt={editAppt} doctors={doctors} open={!!editAppt} onClose={() => setEditAppt(null)} onSaved={load} />
            <InvoiceModal appt={invoiceAppt} existingInvoice={invoiceAppt?.invoice || null} open={!!invoiceAppt} onClose={() => setInvoiceAppt(null)} onSaved={load} />
            <CreateDoctorModal open={showCreateDoctor} onClose={() => setShowCreateDoctor(false)} onSaved={load} />
            <AddEarningModal doctor={earningDoctor} appointments={appointments} open={!!earningDoctor} onClose={() => setEarningDoctor(null)} onSaved={load} />
        </Box>
    );
}
