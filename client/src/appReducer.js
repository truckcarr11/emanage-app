import { createSlice } from "@reduxjs/toolkit";

export const appReducer = createSlice({
  name: "app",
  initialState: {
    companyId: 0,
    employees: [],
    positions: [],
  },
  reducers: {
    setCompanyId: (state, action) => {
      state.companyId = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setPositions: (state, action) => {
      state.positions = action.payload;
    },
  },
});

export const { setCompanyId, setEmployees, setPositions } = appReducer.actions;

export const selectCompanyId = (state) => state.app.companyId;
export const selectEmployees = (state) => state.app.employees;
export const selectPositions = (state) => state.app.positions;

export default appReducer.reducer;
