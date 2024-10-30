import { createSlice } from "@reduxjs/toolkit";
import { FETCH_AI_DATA } from "../sagas/ai.sagas";

const slice = createSlice({
    name: "ai",
    initialState: {
        aiResponse: "",
        loading: false,
        error: null,
    },
    reducers: {
        fetchDataStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchDataSuccess(state, action) {
            state.loading = false;
            state.aiResponse = action.payload;
        },
        fetchDataFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchDataStart, fetchDataSuccess, fetchDataFailure } =
    slice.actions;

// New action creator to include query parameters
export const fetchDataWithQuery = (queryParams) => ({
    type: FETCH_AI_DATA,
    payload: { queryParams },
});

export default slice.reducer;
