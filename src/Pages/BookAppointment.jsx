import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Divider,
    InputAdornment,
    MenuItem,
} from "@mui/material";
import { Person, Email, CalendarToday, AccessTime } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
    const navigate = useNavigate();

    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [petName, setPetName] = useState("");
    const [service, setService] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const services = [
        "General Checkup",
        "Vaccination",
        "Surgery",
        "Dental Care",
        "Other",
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Replace this with API call or context function
        alert(`Appointment booked for ${fname} ${lname} on ${date} at ${time}`);
        navigate("/dashboard"); // redirect after booking
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                p: 2,
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 1000,
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                    backgroundColor: "white",
                }}
            >
                {/* LEFT COLUMN */}
                <Box
                    sx={{
                        flex: 1,
                        p: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" mb={2}>
                        Schedule Your Pet's Appointment 🐾
                    </Typography>

                    <Typography sx={{ maxWidth: 400 }}>
                        Choose the best time for your pet's care with our expert veterinarians.
                    </Typography>

                    <Box
                        component="img"
                        src="/Images/grooming.png"
                        alt="appointment visual"
                        sx={{
                            mt: 5,
                            width: "100%",
                            maxWidth: 350,
                            borderRadius: 4,
                        }}
                    />
                </Box>

                {/* RIGHT COLUMN */}
                <Box
                    sx={{
                        flex: 1,
                        p: 6,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ width: "100%", maxWidth: 400 }}>
                        <Typography variant="h4" fontWeight="bold" mb={1} align="center">
                            Book an Appointment
                        </Typography>

                        <Typography color="text.secondary" mb={4} align="center">
                            We look forward to seeing your pet!
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                placeholder="First Name"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Last Name"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                placeholder="Pet Name"
                                value={petName}
                                onChange={(e) => setPetName(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                select
                                fullWidth
                                label="Select Service"
                                value={service}
                                onChange={(e) => setService(e.target.value)}
                                margin="normal"
                            >
                                {services.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CalendarToday />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccessTime />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                sx={{
                                    mt: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: "bold",
                                }}
                            >
                                Book Appointment
                            </Button>

                            <Divider sx={{ my: 3 }}>or call us directly</Divider>

                            <Button fullWidth variant="outlined" sx={{ py: 1.5 }}>
                                📞 +94 00 000 0000
                            </Button>

                            <Typography textAlign="center" mt={3}>
                                Want to go back?{" "}
                                <span
                                    style={{ color: "#1976d2", cursor: "pointer" }}
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Dashboard
                                </span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default BookAppointment;