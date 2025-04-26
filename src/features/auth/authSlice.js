// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import setCookie from '../../util/setCookie';
import getCookie from '../../util/getCookie';
import { removeCookie } from '../../util/removeCookie';
// import { getCookie, setCookie, removeCookie } from '../../util/getCookie'; // Import your cookie utilities

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const loginAdmin = createAsyncThunk(
    'auth/loginAdmin',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axios.post(baseUrl + 'login', credentials);
            const { data, accessToken } = response.data;
            // Use setCookie instead of localStorage
            setCookie('adminToken', accessToken);
            return { user: data, token: accessToken };
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Login failed');
            }
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    user: null,
    token: getCookie('adminToken') || null, // Use getCookie instead of localStorage
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logoutAdmin: (state) => {
            state.user = null;
            state.token = null;
            removeCookie('adminToken'); // Use removeCookie instead of localStorage.removeItem
        },
        loadAdmin: (state) => {
            const token = getCookie('adminToken'); // Use getCookie instead of localStorage.getItem
            if (token) {
                state.token = token;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                removeCookie('adminToken'); // Use removeCookie instead of localStorage.removeItem
                state.error = action.payload;
            });
    },
});

export const { logoutAdmin, loadAdmin } = authSlice.actions;
export default authSlice.reducer;
