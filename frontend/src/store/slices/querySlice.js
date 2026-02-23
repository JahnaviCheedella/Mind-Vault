import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

export const askQuestion = createAsyncThunk(
    "query/askQuestion",
    async ({ question }, rejectWithValue) => {
        try {
            const response = await api.post("/query", { "query": question })
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data?.detail || "Failed to fetch items")
        }
    }
)

export const querySlice = createSlice({
    name: "query",
    initialState: {
        answer: null,
        sources: [],
        loading: false,
        error: null
    },
    reducers: {
        clearMessages: (state) => {
            state.answer = null;
            state.sources = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(askQuestion.pending, (state) => {
                state.loading = true;
                state.answer = null;
                state.sources = [];
            })
            .addCase(askQuestion.fulfilled, (state, action) => {
                state.loading = false;
                state.answer = action.payload.answer;
                state.sources = action.payload.sources;
            })
            .addCase(askQuestion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const { clearMessages } = querySlice.actions;
export const queryReducer = querySlice.reducer;