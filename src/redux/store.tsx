import{configureStore} from "@reduxjs/toolkit";
import {Reducer} from "./reducer";

export const Store = configureStore({
    reducer: Reducer,
});
