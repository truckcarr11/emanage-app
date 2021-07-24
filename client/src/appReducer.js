import { createSlice } from "@reduxjs/toolkit";

export const appReducer = createSlice({
  name: "app",
  initialState: {
    managePage: "employees",
    employee: {},
    employees: [],
    positions: [],
    companies: [],
  },
  reducers: {
    setManagePage: (state, action) => {
      state.managePage = action.payload;
    },
    setEmployee: (state, action) => {
      state.employee = action.payload;
    },
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
    setPositions: (state, action) => {
      state.positions = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
  },
});

export const {
  setEmployee,
  setEmployees,
  setPositions,
  setCompanies,
  setManagePage,
} = appReducer.actions;

export const selectEmployee = (state) => state.app.employee;
export const selectEmployees = (state) => state.app.employees;
export const selectPositions = (state) => state.app.positions;
export const selectCompanies = (state) => state.app.companies;
export const selectManagePage = (state) => state.app.managePage;

export default appReducer.reducer;
