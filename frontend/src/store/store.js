import { configureStore } from "@reduxjs/toolkit";
import { itemsReducer } from "./slices/itemsSlice";
import { queryReducer } from "./slices/querySlice";

export const store = configureStore({
    reducer: {
        items: itemsReducer,
        query: queryReducer
    }
})