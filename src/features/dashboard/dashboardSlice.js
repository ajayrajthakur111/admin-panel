// src/features/dashboard/dashboardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
import getCookie from '../../util/getCookie'; // Assuming getCookie utility is available
import { dummyGraphJsData, dummySummaryData } from '../../util/dummyDashboardData';

// Define your backend API base URL using environment variable
// const baseUrl = import.meta.env.VITE_API_BASE_URL; // Ensure VITE_API_BASE_URL is set in your .env file

// Helper function to parse change string (e.g., "8.50% Up from yesterday")
    // const parseChangeString = (changeString) => {
    //     if (!changeString || typeof changeString !== 'string') {
    //         return { percentage: 0, direction: 'none', text: 'N/A' };
    //     }

    //     const parts = changeString.match(/(-?\d+(\.\d+)?%) (Up|Down|from)/i);
    //     if (parts && parts[1] && parts[3]) {
    //         const percentage = parseFloat(parts[1].replace('%', ''));
    //         const directionWord = parts[3].toLowerCase();
    //         const direction = directionWord === 'up' ? 'up' : (directionWord === 'down' ? 'down' : 'none');

    //         return {
    //             percentage: Math.abs(percentage),
    //             direction: direction,
    //             text: changeString // Use the original string directly
    //         };
    //     }

    //     if (changeString.startsWith('0.00%')) {
    //         return { percentage: 0, direction: 'none', text: changeString }; // Keep original text
    //     }

    //     console.warn("Could not parse change string:", changeString);
    //     return { percentage: 0, direction: 'none', text: changeString };
    // };


// Async Thunk for fetching dashboard summary data
export const fetchDashboardData = createAsyncThunk(
    'dashboard/fetchDashboardData',
    async (_, { rejectWithValue }) => {
        try {
            const token = getCookie('adminToken'); // Assuming getCookie gets token from cookies/localstorage
            if (!token) {
                return rejectWithValue('No authentication token found.');
            }
            // const config = {
            //     headers: { Authorization: `Bearer ${token}` },
            // };
            console.log("dummySummaryData",dummySummaryData)
            return dummySummaryData
            //   const response = await axios.get(baseUrl + 'getDashboard', config);

            //   if (response.data?.status === 200 && response.data?.data) { // Use optional chaining for safety
            //       const rawData = response.data.data;
            //       const parsedData = {
            //           activeUser: rawData.activeUser,
            //           activeUserChange: parseChangeString(rawData.activeUserChange),
            //           totalBuyers: rawData.totalBuyers,
            //           buyersChange: parseChangeString(rawData.buyersChange),
            //           totalSellers: rawData.totalSellers,
            //           sellersChange: parseChangeString(rawData.sellersChange),
            //           totalEarning: parseFloat(rawData.totalEarning) || 0,
            //           earningChange: parseChangeString(rawData.earningChange),
            //       };
            //     return parsedData;
        // } else {
        //     return rejectWithValue(response.data?.message || 'Unexpected response structure for dashboard data');
        // }

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.data) { // Use optional chaining
            return rejectWithValue(error.response.data.message || 'Failed to fetch dashboard data');
        }
        return rejectWithValue(error.message || 'Failed to fetch dashboard data');
    }
  }
);

// Async Thunk for fetching graph data
export const fetchGraphData = createAsyncThunk(
    'dashboard/fetchGraphData',
    // async ({ filterType, value }, { rejectWithValue }) => {
        async ( { rejectWithValue }) => {

        try {
            const token = getCookie('adminToken'); // Assuming getCookie gets token
            if (!token) {
                return rejectWithValue('No authentication token found.');
            }
            console.log("dummyGraphJsData",dummyGraphJsData)
            return dummyGraphJsData
            // const config = {
            //     headers: { Authorization: `Bearer ${token}` },
            //     params: { filterType, value }
            // };

            // const response = await axios.get(baseUrl + 'getGraphData', config);

            // if (response.data?.status === 200 && response.data?.data !== undefined) { // Use optional chaining, check for data field
            //     console.log("Received Raw Graph Data:", response.data.data);
                // The actual transformation logic from the raw array [] to Chart.js format
                // must be implemented here or in the component using useMemo.
                // For now, we pass the raw data.
                // return response.data.data; // Return the raw data array
            // } else {
            //     return rejectWithValue(response.data?.message || 'Unexpected response structure for graph data');
            // }

        } catch (error) {
            console.error("Error fetching graph data:", error);
            if (error.response?.data) { // Use optional chaining
                return rejectWithValue(error.response.data.message || 'Failed to fetch graph data');
            }
            return rejectWithValue(error.message || 'Failed to fetch graph data');
        }
    }
);


const initialState = {
    summary: null,
    graphData: null, // Raw data from API
    isLoading: false,
    summaryError: null,
    graphError: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.isLoading = true;
                state.summaryError = null;
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.summary = action.payload;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.isLoading = false;
                state.summary = null;
                state.summaryError = action.payload;
            });

        builder
            .addCase(fetchGraphData.pending, (state) => {
                state.isLoading = true;
                state.graphError = null;
            })
            .addCase(fetchGraphData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.graphData = action.payload; // Store the raw data
                console.warn("Raw graph data stored. Remember to transform this data in the component using useMemo or equivalent before passing to Chart.js.");
            })
            .addCase(fetchGraphData.rejected, (state, action) => {
                state.isLoading = false;
                state.graphData = null;
                state.graphError = action.payload;
            });
    },
});

export default dashboardSlice.reducer;