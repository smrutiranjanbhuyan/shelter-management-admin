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

import {
  createTheme,
  Button,
  Box,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  CssBaseline,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Brightness4, Brightness7, Logout } from "@mui/icons-material";
import axios from "axios";

const API_URL = "http://localhost:3000";

const dataProvider = {
  getList: async (resource, params) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return Promise.reject(new Error("Authentication token is missing."));
    }

    try {
      const response = await axios.get(`${API_URL}/${resource}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params.filter,
      });
      return {
        data: response.data,
        total: response.headers["x-total-count"] || response.data.length,
      };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  getOne: async (resource, params) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return Promise.reject(new Error("Authentication token is missing."));
    }

    try {
      const response = await axios.get(`${API_URL}/${resource}/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  create: async (resource, params) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return Promise.reject(new Error("Authentication token is missing."));
    }

    try {
      const response = await axios.post(`${API_URL}/${resource}`, params.data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: response.data };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  update: async (resource, params) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return Promise.reject(new Error("Authentication token is missing."));
    }

    try {
      const response = await axios.put(
        `${API_URL}/${resource}/${params.id}`,
        params.data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { data: response.data };
    } catch (error) {
      return Promise.reject(error);
    }
  },

  delete: async (resource, params) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      return Promise.reject(new Error("Authentication token is missing."));
    }

    try {
      await axios.delete(`${API_URL}/${resource}/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { data: params.previousData };
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

// User List Resource
const UserList = (props) => (
  <ListGuesser {...props}>
    <Datagrid rowClick="edit">
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
    <Datagrid rowClick="edit">
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
    <Datagrid rowClick="edit">
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
    <Datagrid rowClick="edit">
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("authToken")
  );

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
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  });

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Header with Sign-out and Dark Mode Toggle buttons */}
      <AppBar position="sticky" elevation={3}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Admin Dashboard
          </Typography>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600,color:'#ADD8E6' }}>
            {localStorage.getItem("userName")}
          </Typography>

          <Tooltip title="Toggle Dark Mode">
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Main Admin Section */}
      <Admin dataProvider={dataProvider} theme={theme}>
        <Resource name="users/users" list={UserList} edit={EditGuesser} />
        <Resource
          name="shelters/shelters"
          list={ShelterList}
          edit={EditGuesser}
        />
        <Resource
          name="resources/resources"
          list={ResourceList}
          edit={EditGuesser}
        />
        <Resource
          name="blocked-paths/blocked-paths"
          list={BlockedPathList}
          edit={EditGuesser}
        />
      </Admin>
    </ThemeProvider>
  );
};

export default AdminPage;
