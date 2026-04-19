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
    Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import PetsIcon from "@mui/icons-material/Pets";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const services = [
    {
        title: "Pet Checkups",
        description: "Comprehensive routine health examinations to keep your pet happy and healthy year-round.",
        img: "/Images/veterinarian.png",
        gradient: "linear-gradient(135deg, #1565c0 0%, #0097a7 100%)",
        glow: "rgba(21,101,192,0.35)",
        num: "01",
    },
    {
        title: "Grooming Services",
        description: "Professional bathing, trimming and styling by certified pet grooming specialists.",
        img: "/Images/grooming.png",
        gradient: "linear-gradient(135deg, #e65100 0%, #f9a825 100%)",
        glow: "rgba(230,81,0,0.35)",
        num: "02",
    },
    {
        title: "Emergency Care",
        description: "Round-the-clock urgent and life-saving medical assistance when it matters most.",
        img: "/Images/ambulance.png",
        gradient: "linear-gradient(135deg, #b71c1c 0%, #e91e63 100%)",
        glow: "rgba(183,28,28,0.35)",
        num: "03",
    },
    {
        title: "Vaccination Care",
        description: "Essential vaccines and immunisation programs designed for complete pet protection.",
        img: "/Images/syringe.png",
        gradient: "linear-gradient(135deg, #1b5e20 0%, #00acc1 100%)",
        glow: "rgba(27,94,32,0.35)",
        num: "04",
    },
];

const stats = [
    { value: "5,000+", label: "Pets Treated" },
    { value: "15+", label: "Years Experience" },
    { value: "24/7", label: "Emergency Care" },
    { value: "98%", label: "Happy Clients" },
];

const whyUs = [
    "Board-certified veterinary specialists on staff",
    "State-of-the-art diagnostic equipment",
    "Gentle, stress-free handling techniques",
    "Transparent pricing with no hidden fees",
    "Follow-up care and wellness reminders",
    "Multilingual staff for every client",
];

const Home = () => {
    return (
        <Box sx={{ width: "100%", overflowX: "hidden" }}>

            {/* ── HERO ── */}
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100%",
                    backgroundImage: `
                        linear-gradient(135deg, rgba(10,30,80,0.82) 0%, rgba(0,80,120,0.72) 100%),
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
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Decorative floating paw prints */}
                {[...Array(6)].map((_, i) => (
                    <PetsIcon
                        key={i}
                        sx={{
                            position: "absolute",
                            fontSize: `${40 + i * 18}px`,
                            opacity: 0.06,
                            top: `${10 + i * 14}%`,
                            left: i % 2 === 0 ? `${5 + i * 8}%` : "auto",
                            right: i % 2 !== 0 ? `${5 + i * 6}%` : "auto",
                            transform: `rotate(${i * 25}deg)`,
                            pointerEvents: "none",
                        }}
                    />
                ))}

                <Box maxWidth="860px" sx={{ position: "relative", zIndex: 1 }}>
                    <Chip
                        label="Trusted Veterinary Care"
                        icon={<VerifiedIcon sx={{ color: "#fff !important", fontSize: "16px" }} />}
                        sx={{
                            mb: 3,
                            backgroundColor: "rgba(255,255,255,0.15)",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.8rem",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            px: 1,
                        }}
                    />

                    <Typography
                        sx={{
                            fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4rem" },
                            fontWeight: 800,
                            lineHeight: 1.15,
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Compassionate Care<br />
                        <Box component="span" sx={{ color: "#64d9fb" }}>
                            For Your Beloved Pets
                        </Box>
                    </Typography>

                    <Typography
                        sx={{
                            mt: 3,
                            fontSize: { xs: "1rem", md: "1.15rem" },
                            opacity: 0.85,
                            maxWidth: 560,
                            mx: "auto",
                            lineHeight: 1.7,
                        }}
                    >
                        Professional veterinary services delivered with love, expertise,
                        and genuine dedication to your pet's wellbeing.
                    </Typography>

                    <Box sx={{ mt: 5, display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
                        <Button
                            component={Link}
                            to="/book"
                            variant="contained"
                            size="large"
                            sx={{
                                px: 5,
                                py: 1.6,
                                borderRadius: "50px",
                                fontSize: "1rem",
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #64d9fb, #1565c0)",
                                boxShadow: "0 8px 28px rgba(100,217,251,0.35)",
                                textTransform: "none",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #4fc3f7, #0d47a1)",
                                    boxShadow: "0 12px 36px rgba(100,217,251,0.5)",
                                    transform: "translateY(-2px)",
                                },
                                transition: "all 0.25s ease",
                            }}
                        >
                            Book an Appointment
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 4,
                                py: 1.6,
                                borderRadius: "50px",
                                fontSize: "1rem",
                                fontWeight: 600,
                                color: "white",
                                borderColor: "rgba(255,255,255,0.5)",
                                textTransform: "none",
                                backdropFilter: "blur(8px)",
                                "&:hover": {
                                    borderColor: "white",
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                },
                            }}
                        >
                            Learn More
                        </Button>
                    </Box>
                </Box>

                {/* Bottom wave */}
                <Box
                    component="svg"
                    viewBox="0 0 1440 80"
                    preserveAspectRatio="none"
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "80px",
                        display: "block",
                    }}
                >
                    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#ffffff" />
                </Box>
            </Box>

            {/* ── STATS BAR ── */}
            <Box sx={{ background: "#fff", py: 6 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={2} justifyContent="center">
                        {stats.map((s) => (
                            <Grid size={{ xs: 6, sm: 3 }} key={s.label}>
                                <Box textAlign="center">
                                    <Typography
                                        sx={{
                                            fontSize: { xs: "2rem", md: "2.8rem" },
                                            fontWeight: 800,
                                            background: "linear-gradient(135deg, #1565c0, #0097a7)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        {s.value}
                                    </Typography>
                                    <Typography
                                        sx={{ color: "text.secondary", fontWeight: 500, fontSize: "0.9rem" }}
                                    >
                                        {s.label}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* ── SERVICES ── */}
            <Box sx={{ py: 12, background: "#0d1b2a" }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { md: "flex-end" }, justifyContent: "space-between", mb: 8, gap: 3 }}>
                        <Box>
                            <Chip
                                label="What We Offer"
                                sx={{ mb: 2, fontWeight: 600, backgroundColor: "rgba(100,217,251,0.12)", color: "#64d9fb", border: "1px solid rgba(100,217,251,0.25)" }}
                            />
                            <Typography
                                sx={{
                                    fontSize: { xs: "2rem", md: "2.8rem" },
                                    fontWeight: 800,
                                    color: "#ffffff",
                                    lineHeight: 1.15,
                                }}
                            >
                                Our Services
                            </Typography>
                        </Box>
                        <Typography
                            sx={{ color: "rgba(255,255,255,0.55)", maxWidth: 340, fontSize: "0.95rem", lineHeight: 1.8 }}
                        >
                            Everything your pet needs under one roof, delivered by specialists who truly care.
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 3,
                    }}>
                        {services.map((service) => (
                            <Box key={service.title} sx={{ display: "flex" }}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        minHeight: 280,
                                        borderRadius: "24px",
                                        background: service.gradient,
                                        p: 3.5,
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                        overflow: "hidden",
                                        cursor: "default",
                                        boxShadow: `0 8px 32px ${service.glow}`,
                                        transition: "all 0.35s ease",
                                        "&:hover": {
                                            transform: "translateY(-10px) scale(1.02)",
                                            boxShadow: `0 20px 50px ${service.glow}`,
                                        },
                                    }}
                                >
                                    {/* Watermark number */}
                                    <Typography
                                        sx={{
                                            position: "absolute",
                                            top: -10,
                                            right: 12,
                                            fontSize: "6rem",
                                            fontWeight: 900,
                                            color: "rgba(255,255,255,0.08)",
                                            lineHeight: 1,
                                            userSelect: "none",
                                        }}
                                    >
                                        {service.num}
                                    </Typography>

                                    {/* Icon */}
                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: "18px",
                                            backgroundColor: "rgba(255,255,255,0.18)",
                                            backdropFilter: "blur(8px)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mb: 3,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={service.img}
                                            alt={service.title}
                                            sx={{ width: 42, height: 42, objectFit: "contain", filter: "brightness(0) invert(1)" }}
                                        />
                                    </Box>

                                    <Typography
                                        variant="h6"
                                        fontWeight={800}
                                        sx={{ color: "#fff", mb: 1.5, fontSize: "1.1rem" }}
                                    >
                                        {service.title}
                                    </Typography>

                                    <Typography
                                        sx={{ color: "rgba(255,255,255,0.78)", fontSize: "0.88rem", lineHeight: 1.7, flexGrow: 1 }}
                                    >
                                        {service.description}
                                    </Typography>

                                    {/* Learn more link */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            mt: 3,
                                            color: "rgba(255,255,255,0.85)",
                                            fontSize: "0.85rem",
                                            fontWeight: 600,
                                            "&:hover": { color: "#fff", gap: 1 },
                                            transition: "all 0.2s",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Learn more <ArrowForwardIcon sx={{ fontSize: 16 }} />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ── WHY CHOOSE US ── */}
            <Box sx={{ py: 10, background: "#fff" }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Chip
                                label="Why Choose Us"
                                sx={{ mb: 2, fontWeight: 600, backgroundColor: "#e8f5e9", color: "#2e7d32" }}
                            />
                            <Typography
                                sx={{
                                    fontSize: { xs: "1.8rem", md: "2.4rem" },
                                    fontWeight: 800,
                                    color: "#0d1b2a",
                                    lineHeight: 1.2,
                                    mb: 2,
                                }}
                            >
                                We Go the Extra Mile for Your Pet
                            </Typography>
                            <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 4 }}>
                                Our team of passionate veterinary professionals combines cutting-edge
                                technology with a warm, personal touch to deliver the highest standard of care.
                            </Typography>
                            <Grid container spacing={1.5}>
                                {whyUs.map((item) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={item}>
                                        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                                            <CheckCircleIcon sx={{ color: "#4caf50", mt: "2px", flexShrink: 0 }} />
                                            <Typography sx={{ fontSize: "0.9rem", color: "#444", lineHeight: 1.5 }}>
                                                {item}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    borderRadius: "28px",
                                    overflow: "hidden",
                                    boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
                                    position: "relative",
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/Images/bg-home.webp"
                                    alt="Veterinarian caring for pet"
                                    sx={{ width: "100%", height: 380, objectFit: "cover", display: "block" }}
                                />
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: 20,
                                        left: 20,
                                        right: 20,
                                        background: "rgba(255,255,255,0.95)",
                                        backdropFilter: "blur(12px)",
                                        borderRadius: "16px",
                                        p: 2.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                                    }}
                                >
                                    <FavoriteIcon sx={{ color: "#f44336", fontSize: 32 }} />
                                    <Box>
                                        <Typography fontWeight={700} sx={{ color: "#0d1b2a" }}>
                                            Over 5,000 Pets Treated
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Trusted by families across the city
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* ── CTA BAND ── */}
            <Box
                sx={{
                    py: 10,
                    background: "linear-gradient(135deg, #1565c0 0%, #0097a7 100%)",
                    textAlign: "center",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <PetsIcon
                    sx={{
                        position: "absolute",
                        fontSize: 300,
                        opacity: 0.05,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        pointerEvents: "none",
                    }}
                />
                <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 48, opacity: 0.9, mb: 2 }} />
                    <Typography
                        sx={{ fontSize: { xs: "1.8rem", md: "2.6rem" }, fontWeight: 800, lineHeight: 1.2 }}
                    >
                        Ready to Book an Appointment?
                    </Typography>
                    <Typography sx={{ mt: 2, opacity: 0.85, fontSize: "1.05rem", maxWidth: 480, mx: "auto" }}>
                        Your pet deserves the best. Schedule a visit today and let our experts take care of the rest.
                    </Typography>
                    <Button
                        component={Link}
                        to="/book"
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 5,
                            px: 6,
                            py: 1.8,
                            borderRadius: "50px",
                            fontSize: "1rem",
                            fontWeight: 700,
                            backgroundColor: "white",
                            color: "#1565c0",
                            textTransform: "none",
                            boxShadow: "0 8px 28px rgba(0,0,0,0.2)",
                            "&:hover": {
                                backgroundColor: "#f0f7ff",
                                transform: "translateY(-2px)",
                                boxShadow: "0 12px 36px rgba(0,0,0,0.25)",
                            },
                            transition: "all 0.25s ease",
                        }}
                    >
                        Book Now — It's Easy
                    </Button>
                </Container>
            </Box>

            {/* ── FOOTER ── */}
            <Box sx={{ backgroundColor: "#0d1b2a", py: 7, color: "rgba(255,255,255,0.75)" }}>
                <Container maxWidth="lg">
                    <Grid container spacing={5}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <PetsIcon sx={{ color: "#64d9fb", fontSize: 28 }} />
                                <Typography
                                    variant="h6"
                                    fontWeight={800}
                                    sx={{ color: "white", fontSize: "1.15rem" }}
                                >
                                    PetPals Clinic
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.8 }}>
                                Providing trusted, compassionate veterinary care for pets and the families who love them.
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 6, md: 2 }}>
                            <Typography fontWeight={700} sx={{ color: "white", mb: 2, fontSize: "0.95rem" }}>
                                Quick Links
                            </Typography>
                            {["Home", "Services", "Book Appointment", "Login"].map((link) => (
                                <Typography
                                    key={link}
                                    sx={{
                                        fontSize: "0.88rem",
                                        mb: 1,
                                        cursor: "pointer",
                                        "&:hover": { color: "#64d9fb" },
                                        transition: "color 0.2s",
                                    }}
                                >
                                    {link}
                                </Typography>
                            ))}
                        </Grid>

                        <Grid size={{ xs: 6, md: 2 }}>
                            <Typography fontWeight={700} sx={{ color: "white", mb: 2, fontSize: "0.95rem" }}>
                                Services
                            </Typography>
                            {services.map((s) => (
                                <Typography
                                    key={s.title}
                                    sx={{ fontSize: "0.88rem", mb: 1 }}
                                >
                                    {s.title}
                                </Typography>
                            ))}
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography fontWeight={700} sx={{ color: "white", mb: 2, fontSize: "0.95rem" }}>
                                Contact Us
                            </Typography>
                            {[
                                { icon: <PhoneIcon fontSize="small" />, text: "+1 (555) 234-5678" },
                                { icon: <EmailIcon fontSize="small" />, text: "hello@petpalsclinic.com" },
                                { icon: <LocationOnIcon fontSize="small" />, text: "123 Paw Street, Pet City" },
                            ].map(({ icon, text }) => (
                                <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                                    <Box sx={{ color: "#64d9fb" }}>{icon}</Box>
                                    <Typography sx={{ fontSize: "0.88rem" }}>{text}</Typography>
                                </Box>
                            ))}
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            mt: 6,
                            pt: 3,
                            borderTop: "1px solid rgba(255,255,255,0.1)",
                            textAlign: "center",
                        }}
                    >
                        <Typography sx={{ fontSize: "0.85rem", opacity: 0.55 }}>
                            © {new Date().getFullYear()} PetPals Clinic. All Rights Reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>

        </Box>
    );
};

export default Home;
