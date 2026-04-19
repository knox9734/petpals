import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Divider,
    Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Example dummy data
const appointmentsData = [
    {
        id: 1,
        date: "2026-02-20",
        time: "10:00 AM",
        petName: "Buddy",
        service: "Vaccination",
        doctor: "Dr. Smith",
        notes: "Healthy, no issues",
    },
    {
        id: 2,
        date: "2026-01-15",
        time: "02:00 PM",
        petName: "Milo",
        service: "Dental Care",
        doctor: "Dr. Brown",
        notes: "Teeth cleaned successfully",
    },
];

const billingData = [
    {
        id: 1,
        date: "2026-02-20",
        invoiceNo: "INV001",
        amount: 50,
        status: "Paid",
    },
    {
        id: 2,
        date: "2026-01-15",
        invoiceNo: "INV002",
        amount: 75,
        status: "Paid",
    },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [billing, setBilling] = useState([]);

    useEffect(() => {
        // Fetch real data from API in production
        setAppointments(appointmentsData);
        setBilling(billingData);
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                p: 4,
            }}
        >
            <Typography variant="h4" fontWeight="bold" mb={3} align="center">
                🐾 Pet Clinic Dashboard
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 4,
                }}
            >
                {/* Left Column - Medical History */}
                <Box
                    sx={{
                        flex: 1,
                        p: 4,
                        backgroundColor: "white",
                        borderRadius: 4,
                        boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" mb={2}>
                        Medical History
                    </Typography>

                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Pet Name</TableCell>
                                    <TableCell>Service</TableCell>
                                    <TableCell>Doctor</TableCell>
                                    <TableCell>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointments.map((appt) => (
                                    <TableRow key={appt.id}>
                                        <TableCell>{appt.date}</TableCell>
                                        <TableCell>{appt.time}</TableCell>
                                        <TableCell>{appt.petName}</TableCell>
                                        <TableCell>{appt.service}</TableCell>
                                        <TableCell>{appt.doctor}</TableCell>
                                        <TableCell>{appt.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Right Column - Billing History */}
                <Box
                    sx={{
                        flex: 1,
                        p: 4,
                        backgroundColor: "white",
                        borderRadius: 4,
                        boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" mb={2}>
                        Billing History
                    </Typography>

                    <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Invoice No</TableCell>
                                    <TableCell>Amount ($)</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billing.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell>{bill.date}</TableCell>
                                        <TableCell>{bill.invoiceNo}</TableCell>
                                        <TableCell>{bill.amount}</TableCell>
                                        <TableCell>{bill.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Divider sx={{ my: 3 }} />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => navigate("/book")}
                        sx={{
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: "bold",
                        }}
                    >
                        Book New Appointment
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;