import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appReducer";

export default configureStore({
  reducer: {
    app: appReducer,
  },
});
