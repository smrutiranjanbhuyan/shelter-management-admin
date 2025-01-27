import React, { useState } from "react";
import {
    Button,
    TextField as MuiTextField,
    Box,
    Typography,
    Paper,
    AppBar,
    Toolbar,
    IconButton,
    Container,
    CssBaseline,
    useTheme,
    createTheme,
    ThemeProvider,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

const API_URL = "http://localhost:3000";

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const theme = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.user.role === 'admin') {
                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                    
                    localStorage.setItem("userName",data.user.name);
                    onLoginSuccess();
                } else {
                    setError("Invalid credentials");
                }
            } else {
                setError("Invalid credentials");
            }

        } catch (err) {
            setError("An error occurred while logging in");
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const darkTheme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AppBar position="sticky" sx={{ backgroundColor: darkMode ? "#333" : "#1976d2" }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={toggleDarkMode}
                        aria-label="toggle dark mode"
                    >
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" sx={{ marginTop: 10 }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <Paper
                        sx={{
                            padding: 5,
                            width: "100%",
                            boxShadow: theme.shadows[5],
                            borderRadius: 4,
                            background: darkMode ? "#424242" : "#fff",
                        }}
                    >
                        <Typography variant="h5" align="center" gutterBottom sx={{ color: darkMode ? "#fff" : "#000" }}>
                            Login
                        </Typography>
                        <MuiTextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            InputLabelProps={{
                                style: { color: darkMode ? "#fff" : "#000" },
                            }}
                            InputProps={{
                                style: { color: darkMode ? "#fff" : "#000" },
                            }}
                            sx={{
                                backgroundColor: darkMode ? "#333" : "#f5f5f5",
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                    transition: "all 0.3s ease",
                                },
                            }}
                        />
                        <MuiTextField
                            label="Password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            InputLabelProps={{
                                style: { color: darkMode ? "#fff" : "#000" },
                            }}
                            InputProps={{
                                style: { color: darkMode ? "#fff" : "#000" },
                            }}
                            sx={{
                                backgroundColor: darkMode ? "#333" : "#f5f5f5",
                                borderRadius: 2,
                                "& .MuiOutlinedInput-root": {
                                    transition: "all 0.3s ease",
                                },
                            }}
                        />
                        {error && (
                            <Typography color="error" align="center" margin="normal">
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{
                                marginTop: 3,
                                padding: "12px 0",
                                borderRadius: 5,
                                fontSize: "16px",
                                fontWeight: "bold",
                                background: darkMode ? "#FF8C00" : "#1976d2",
                                "&:hover": {
                                    backgroundColor: darkMode ? "#FF5722" : "#1565c0",
                                },
                            }}
                        >
                            Login
                        </Button>
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default Login;
