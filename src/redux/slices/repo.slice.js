import { createSlice } from "@reduxjs/toolkit";
import { FETCH_DATA } from "../sagas/repo.sagas";
import functions from "../../helpers/functions";

const slice = createSlice({
    name: "repo",
    initialState: {
        items: [],
        languages: [],
        limits: {},
        licenses: [],
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

            if (action.payload) {
                state.items = state.items
                    .concat(action.payload)
                    .filter(
                        (obj, idx, arr) =>
                            arr.findIndex((obj1) => obj1.name == obj.name) ==
                            idx
                    );

                state.languages = state.items
                    .map((obj) => obj.language)
                    .filter((b) => b)
                    .filter(
                        (lang, idx, arr) =>
                            arr.findIndex((lang1) => lang1 == lang) == idx
                    );

                state.licenses = state.items
                .map((obj) => obj?.license?.name)
                .filter((b) => b)
                .filter(
                    (item, idx, arr) =>
                        arr.findIndex((item1) => item1 == item) == idx
                ).concat(["No License"])

                state.limits = functions.getMinMaxListNumberProperties(state.items)
            }
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
    type: FETCH_DATA,
    payload: { queryParams },
});

export default slice.reducer;
