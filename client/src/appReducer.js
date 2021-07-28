import { createSlice } from "@reduxjs/toolkit";

export const appReducer = createSlice({
  name: "app",
  initialState: {
    user: {},
    employees: [],
    positions: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setPositions: (state, action) => {
      state.positions = action.payload;
    },
  },
});

export const { setUser, setEmployees, setPositions, setManagePage } =
  appReducer.actions;

export const selectUser = (state) => state.app.user;
export const selectEmployees = (state) => state.app.employees;
export const selectPositions = (state) => state.app.positions;

export default appReducer.reducer;
