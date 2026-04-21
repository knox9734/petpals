import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogTitle, Box, Typography,
    TextField, Button, MenuItem, InputAdornment, IconButton,
} from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import CloseIcon from "@mui/icons-material/Close";
import { petAPI } from "../api";

const SPECIES = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Other"];

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

const FieldLabel = ({ children }) => (
    <Typography sx={{ fontWeight: 600, fontSize: "0.83rem", color: "#0d1b2a", mb: 0.7 }}>
        {children}
    </Typography>
);

export default function AddPetModal({ open, onClose, onSaved, isFirstPet = false }) {
    const [form, setForm] = useState({ name: "", species: "", breed: "", age: "", weight: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.name || !form.species || !form.age || !form.weight) {
            setError("Please fill in all required fields.");
            return;
        }
        setSubmitting(true);
        try {
            const pet = await petAPI.create({
                name:    form.name,
                species: form.species,
                breed:   form.breed,
                age:     Number(form.age),
                weight:  Number(form.weight),
            });
            setForm({ name: "", species: "", breed: "", age: "", weight: "" });
            onSaved(pet);
        } catch (err) {
            setError(err?.detail || "Failed to save pet. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={isFirstPet ? undefined : onClose}   // block closing on first-pet flow
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: "24px", p: 1 } }}
        >
            <DialogTitle sx={{ pb: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 42, height: 42, borderRadius: "12px", background: "linear-gradient(135deg, #1565c0, #0097a7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <PetsIcon sx={{ color: "white", fontSize: 22 }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={800} fontSize="1.1rem" color="#0d1b2a">
                                {isFirstPet ? "Register Your First Pet" : "Add a Pet"}
                            </Typography>
                            <Typography fontSize="0.8rem" color="text.secondary">
                                {isFirstPet
                                    ? "Tell us about your furry friend to get started"
                                    : "Add another pet to your account"}
                            </Typography>
                        </Box>
                    </Box>
                    {!isFirstPet && (
                        <IconButton onClick={onClose} size="small" sx={{ color: "#9aa5b4" }}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    )}
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {isFirstPet && (
                    <Box sx={{ mb: 3, p: 2, borderRadius: "14px", background: "linear-gradient(135deg, #e3f2fd, #e8f5e9)", border: "1px solid #bbdefb" }}>
                        <Typography fontSize="0.88rem" color="#1565c0" fontWeight={600}>
                            Welcome! 🐾 You haven't added any pets yet.
                        </Typography>
                        <Typography fontSize="0.82rem" color="#555" mt={0.5}>
                            Register your first pet to start booking appointments and tracking their health.
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Box sx={{ mb: 2, p: 1.5, borderRadius: "10px", backgroundColor: "#fde8e8", border: "1px solid #f5c6c6" }}>
                        <Typography sx={{ color: "#c62828", fontSize: "0.83rem", fontWeight: 500 }}>{error}</Typography>
                    </Box>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    {/* Name + Species */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <FieldLabel>Pet name *</FieldLabel>
                            <TextField fullWidth placeholder="e.g. Buddy" value={form.name} onChange={set("name")} sx={fieldStyle} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <FieldLabel>Species *</FieldLabel>
                            <TextField select fullWidth value={form.species} onChange={set("species")} sx={fieldStyle}
                                SelectProps={{ displayEmpty: true }}
                            >
                                <MenuItem value="" disabled>Select</MenuItem>
                                {SPECIES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </TextField>
                        </Box>
                    </Box>

                    {/* Breed */}
                    <Box sx={{ mt: 2.5 }}>
                        <FieldLabel>Breed <Typography component="span" sx={{ color: "text.secondary", fontSize: "0.78rem" }}>(optional)</Typography></FieldLabel>
                        <TextField fullWidth placeholder="e.g. Golden Retriever" value={form.breed} onChange={set("breed")} sx={fieldStyle} />
                    </Box>

                    {/* Age + Weight */}
                    <Box sx={{ display: "flex", gap: 2, mt: 2.5 }}>
                        <Box sx={{ flex: 1 }}>
                            <FieldLabel>Age (years) *</FieldLabel>
                            <TextField fullWidth type="number" placeholder="3" value={form.age} onChange={set("age")}
                                inputProps={{ min: 0, max: 30 }} sx={fieldStyle} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <FieldLabel>Weight (kg) *</FieldLabel>
                            <TextField fullWidth type="number" placeholder="28.5" value={form.weight} onChange={set("weight")}
                                inputProps={{ min: 0, step: 0.1 }} sx={fieldStyle} />
                        </Box>
                    </Box>

                    <Button
                        fullWidth type="submit" variant="contained" size="large"
                        disabled={submitting}
                        sx={{
                            mt: 4, py: 1.6, borderRadius: "12px",
                            fontWeight: 700, fontSize: "1rem", textTransform: "none",
                            background: "linear-gradient(135deg, #1565c0, #0097a7)",
                            boxShadow: "0 8px 24px rgba(21,101,192,0.3)",
                            "&:hover": { background: "linear-gradient(135deg, #0d47a1, #00838f)", transform: "translateY(-1px)" },
                            "&.Mui-disabled": { opacity: 0.7 },
                            transition: "all 0.25s ease",
                        }}
                    >
                        {submitting ? "Saving…" : isFirstPet ? "Register Pet & Continue" : "Add Pet"}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
