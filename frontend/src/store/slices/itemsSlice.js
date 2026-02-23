import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchItems = createAsyncThunk(
    "items/fetchItems",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/items")
            console.log(`items: ${response.data.toString()}`)
            return response.data.items;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || "Failed to fetch items")
        }
    }
);

export const ingestContent = createAsyncThunk(
    "items/ingestContent",
    async ({ content, source_type }, { rejectWithValue }) => {
        try {
            const response = await api.post("/ingest", { content, source_type })
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || "Failed to ingest content")
        }
    }
);

const itemSlice = createSlice({
    name: "items",
    initialState: {
        list: [],
        loading: false,
        ingestLoading: false,
        successMessage: null,
        error: null
    },
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            //fetchItems
            .addCase(fetchItems.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchItems.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //ingestContent
            .addCase(ingestContent.pending, (state) => {
                state.ingestLoading = true;
            })
            .addCase(ingestContent.fulfilled, (state, action) => {
                state.ingestLoading = false;
                state.successMessage = "Saved!"
            })
            .addCase(ingestContent.rejected, (state, action) => {
                state.ingestLoading = false;
                state.error = action.payload;
            })
    }
})

export const { clearMessages } = itemSlice.actions;
export const itemsReducer = itemSlice.reducer;