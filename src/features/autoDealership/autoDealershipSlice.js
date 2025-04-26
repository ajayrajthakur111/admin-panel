import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import getCookie from "../../util/getCookie"; // Same utility

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Fetch AutoDealerShip (GET allAutoDealerShip)
export const fetchAutoDealerShips = createAsyncThunk(
  "autoDealership/fetchAutoDealerShips",
  async (_, { rejectWithValue }) => {
    try {
      const token = getCookie("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(baseUrl + "AutoDealerShip/allAutoDealerShip", config);

      if (response.data?.status === 200 && response.data?.data?.length > 0) {
        const firstItem = response.data.data[0];
        return {
          docs: firstItem.everyThing || [],
          totalDocs: (firstItem.everyThing || []).length,
          page: 1,
          limit: 10,
          totalPages: 1,
        };
      } else {
        return rejectWithValue("No AutoDealerShip data found.");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch");
    }
  }
);

// Create AutoDealerShip entry (POST addDataInEveryThing)
export const createAutoDealerShip = createAsyncThunk(
  "autoDealership/createAutoDealerShip",
  async (data, { rejectWithValue }) => {
    try {
      const token = getCookie("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const formData = new FormData();
      formData.append("name", data.title);
      formData.append("description", data.description);
      if (data.image) {
        formData.append("image", data.image);
      }

      const response = await axios.post(baseUrl + "AutoDealerShip/addDataInEveryThing", formData, config);

      if (response.status==200) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || "Failed to create");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to create");
    }
  }
);

// Delete AutoDealerShip entry (DELETE deleteAutoDealerShip)
export const deleteAutoDealerShip = createAsyncThunk(
  "autoDealership/deleteAutoDealerShip",
  async (id, { rejectWithValue }) => {
    try {
      const token = getCookie("adminToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.delete(baseUrl + `AutoDealerShip/deleteAutoDealerShip/${id}`, config);

      if (response.data?.message?.includes("Deleted Successfully")) {
        return id;
      } else {
        return rejectWithValue(response.data?.message || "Failed to delete");
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to delete");
    }
  }
);

// Slice
const autoDealerShipSlice = createSlice({
  name: "autoDealership",
  initialState: {
    dealerships: [],
    totalDocs: 0,
    limit: 10,
    page: 1,
    totalPages: 1,
    isLoading: false,
    error: null,
    isModalOpen: false,
    selectedDealership: null,
    selectedDealershipIds: [],
  },
  reducers: {
    openAutoDealerShipModal: (state, action) => {
      state.isModalOpen = true;
      state.selectedDealership = action.payload || null;
    },
    closeAutoDealerShipModal: (state) => {
      state.isModalOpen = false;
      state.selectedDealership = null;
    },
    toggleSelectDealerShip: (state, action) => {
      const id = action.payload;
      if (state.selectedDealershipIds.includes(id)) {
        state.selectedDealershipIds = state.selectedDealershipIds.filter((_id) => _id !== id);
      } else {
        state.selectedDealershipIds.push(id);
      }
    },
    toggleSelectAllDealerShips: (state, action) => {
      const isChecked = action.payload;
      if (isChecked) {
        state.selectedDealershipIds = state.dealerships.map((item) => item._id);
      } else {
        state.selectedDealershipIds = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAutoDealerShips.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAutoDealerShips.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dealerships = action.payload.docs;
        state.totalDocs = action.payload.totalDocs;
        state.limit = action.payload.limit;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.selectedDealershipIds = [];
      })
      .addCase(fetchAutoDealerShips.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createAutoDealerShip.fulfilled, (state) => {
        state.isModalOpen = false;
        state.selectedDealership = null;
      })
      .addCase(deleteAutoDealerShip.fulfilled, (state, action) => {
        const id = action.payload;
        state.dealerships = state.dealerships.filter((item) => item._id !== id);
        state.selectedDealershipIds = state.selectedDealershipIds.filter((_id) => _id !== id);
      });
  },
});

export const {
  openAutoDealerShipModal,
  closeAutoDealerShipModal,
  toggleSelectDealerShip,
  toggleSelectAllDealerShips,
} = autoDealerShipSlice.actions;

export default autoDealerShipSlice.reducer;
