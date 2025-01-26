import React, { useState } from "react";
import Login from "./LoginPage";
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
import { createTheme, Button, Box, AppBar, Toolbar, Typography, ThemeProvider, CssBaseline } from "@mui/material";

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


// Main Admin Page
const AdminPage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("authToken"));
    const [darkMode, setDarkMode] = useState(false);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const theme = createTheme({
        palette: {
            mode: darkMode ? "dark" : "light",
        },
    });

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {/* Header with Sign-out and Dark Mode Toggle buttons */}
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Admin Dashboard
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                    <Button variant="contained" color="default" onClick={toggleDarkMode} sx={{ marginLeft: 2 }}>
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Admin Section */}
            <Admin
                dataProvider={dataProvider}
                theme={theme}
            >
                <Resource name="users/users" list={UserList} edit={EditGuesser} />
                <Resource name="shelters/shelters" list={ShelterList} edit={EditGuesser} />
                <Resource name="resources/resources" list={ResourceList} edit={EditGuesser} />
                <Resource name="blocked-paths/blocked-paths" list={BlockedPathList} edit={EditGuesser} />
            </Admin>
        </ThemeProvider>
    );
};

export default AdminPage;
