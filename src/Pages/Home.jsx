import React from "react";
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Container,
} from "@mui/material";
import { Link } from "react-router-dom";

const services = [
    {
        title: "Pet Checkups",
        description: "Comprehensive routine health examinations for your pets.",
        img: "/Images/veterinarian.png",
    },
    {
        title: "Grooming Services",
        description: "Professional bathing, trimming & styling services.",
        img: "/Images/grooming.png",
    },
    {
        title: "Emergency Care",
        description: "24/7 urgent and life-saving medical assistance.",
        img: "/Images/ambulance.png",
    },
    {
        title: "Vaccination Care",
        description: "Essential vaccines for pet protection.",
        img: "/Images/syringe.png",
    },
];

const Home = () => {
    return (
        <Box sx={{ width: "100%", overflowX: "hidden" }}>

            {/* HERO SECTION */}
            <Box
                sx={{
                    minHeight: "75vh",
                    width: "100%",
                    backgroundImage: `
            linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
            url('/Images/bg-home.webp')
          `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    px: { xs: 3, md: 10 },
                    color: "white",
                }}
            >
                <Box maxWidth="900px">
                    <Typography
                        sx={{
                            fontSize: { xs: "2rem", md: "3.5rem" },
                            fontWeight: "bold",
                        }}
                    >
                        Compassionate Care for Your Pets 🐾
                    </Typography>

                    <Typography sx={{ mt: 3 }}>
                        Professional veterinary services with love and dedication.
                    </Typography>

                    <Button
                        component={Link}
                        to="/book"
                        variant="contained"
                        sx={{
                            mt: 5,
                            px: 5,
                            borderRadius: "40px",
                        }}
                    >
                        Book an Appointment
                    </Button>
                </Box>
            </Box>

            {/* SERVICES SECTION */}
            <Box sx={{ py: 10, background: "#f9fbfd" }}>
                <Box sx={{ width: "100%", maxWidth: "1400px", mx: "auto", px: 4 }}>
                    <Typography
                        align="center"
                        sx={{
                            fontSize: { xs: "1.8rem", md: "2.5rem" },
                            fontWeight: "bold",
                            mb: 8,
                        }}
                    >
                        Our Services
                    </Typography>

                    <Grid container spacing={4}>
                        {services.map((service) => (
                            <Grid item xs={12} sm={6} md={3} key={service.title}>
                                <Card
                                    sx={{
                                        height: "250px",
                                        width: "500px",        // Important
                                        display: "flex",
                                        flexDirection: "column",
                                        borderRadius: "20px",
                                        textAlign: "center",
                                        p: 3,
                                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={service.img}
                                        alt={service.title}
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "contain",
                                            mx: "auto",
                                            mt: 2,
                                        }}
                                    />

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="bold" mt={2}>
                                            {service.title}
                                        </Typography>

                                        <Typography mt={1} color="text.secondary">
                                            {service.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            <Box sx={{ backgroundColor: "#1976d2", py: 6 }}>
                <Container maxWidth="md">
                    <Box textAlign="center" color="white">
                        <Typography variant="h6" fontWeight="bold">
                            PetCare Clinic
                        </Typography>

                        <Typography sx={{ mt: 1 }}>
                            Providing trusted veterinary care with compassion.
                        </Typography>

                        <Typography sx={{ mt: 2, fontSize: "0.9rem", opacity: 0.8 }}>
                            © {new Date().getFullYear()} PetCare Clinic. All Rights Reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>

        </Box>
    );
};

export default Home;