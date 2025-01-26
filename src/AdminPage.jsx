import React, { useState } from "react";
import {
    Admin,
    Resource,
    ListGuesser,
    EditGuesser,
    Datagrid,
    TextField,
    EditButton,
    DeleteButton,
    BooleanField,
    DateField,
} from "react-admin";
import jsonServerProvider from "ra-data-simple-rest";
import { createTheme, Button, TextField as MuiTextField, Box, Typography, Paper } from "@mui/material";

// API URL for backend
const API_URL = "http://localhost:3000"; // Your API base URL

// Custom dataProvider with token handling
const dataProvider = {
    ...jsonServerProvider(API_URL),

    // Get list of resources with authentication
    getList: (resource, params) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            return Promise.reject(new Error("Authentication token is missing."));
        }

        const customHeaders = {
            Authorization: `Bearer ${token}`,
        };

        return jsonServerProvider(API_URL).getList(resource, {
            ...params,
            headers: customHeaders,
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    // Get one resource by ID with authentication
    getOne: (resource, params) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            return Promise.reject(new Error("Authentication token is missing."));
        }

        const customHeaders = {
            Authorization: `Bearer ${token}`,
        };

        return jsonServerProvider(API_URL).getOne(resource, {
            ...params,
            headers: customHeaders,
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    // Create a new resource with authentication
    create: (resource, params) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            return Promise.reject(new Error("Authentication token is missing."));
        }

        const customHeaders = {
            Authorization: `Bearer ${token}`,
        };

        return jsonServerProvider(API_URL).create(resource, {
            ...params,
            headers: customHeaders,
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    // Update an existing resource with authentication
    update: (resource, params) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            return Promise.reject(new Error("Authentication token is missing."));
        }

        const customHeaders = {
            Authorization: `Bearer ${token}`,
        };

        return jsonServerProvider(API_URL).update(resource, {
            ...params,
            headers: customHeaders,
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    // Delete a resource with authentication
    delete: (resource, params) => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            return Promise.reject(new Error("Authentication token is missing."));
        }

        const customHeaders = {
            Authorization: `Bearer ${token}`,
        };

        return jsonServerProvider(API_URL).delete(resource, {
            ...params,
            headers: customHeaders,
        }).catch((error) => {
            return Promise.reject(error);
        });
    },

    
};

// User List Resource
const UserList = (props) => (
    <ListGuesser {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="email" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </ListGuesser>
);

// Shelter List Resource
const ShelterList = (props) => (
    <ListGuesser {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="location" />
            <TextField source="capacity" />
            <BooleanField source="isActive" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </ListGuesser>
);

// Resource List Resource
const ResourceList = (props) => (
    <ListGuesser {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="type" />
            <TextField source="quantity" />
            <DateField source="createdAt" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </ListGuesser>
);

// Blocked Path List Resource
const BlockedPathList = (props) => (
    <ListGuesser {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="path" />
            <BooleanField source="isBlocked" />
            <DateField source="blockedAt" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </ListGuesser>
);

// Login Page
const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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

            if (data.token) {
                localStorage.setItem("authToken", data.token);
                onLoginSuccess();
            } else {
                setError("Invalid credentials");
            }
        } catch (err) {
            setError("An error occurred while logging in");
        }
    };

    return (
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
            <Paper sx={{ padding: 3, width: 400 }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>
                <MuiTextField
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                />
                <MuiTextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                />
                {error && (
                    <Typography color="error" align="center" margin="normal">
                        {error}
                    </Typography>
                )}
                <Button type="submit" fullWidth variant="contained" color="primary">
                    Login
                </Button>
            </Paper>
        </Box>
    );
};

// Main Admin Page
const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <Admin
            dataProvider={dataProvider}
            theme={createTheme()}
            logoutButton={
                <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Logout
                </Button>
            }
        >
            <Resource name="users/users" list={UserList} edit={EditGuesser} />
            <Resource name="shelters/shelters" list={ShelterList} edit={EditGuesser} />
            <Resource name="resources/resources" list={ResourceList} edit={EditGuesser} />
            <Resource name="blocked-paths/blocked-paths" list={BlockedPathList} edit={EditGuesser} />
        </Admin>
    );
};

export default AdminPage;
