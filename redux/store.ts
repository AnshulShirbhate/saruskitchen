import {configureStore} from "@reduxjs/toolkit";
import adminReducer from './adminSlice'
import productsReducer from './productSlice';

const store = configureStore({
    reducer: {admin: adminReducer, products: productsReducer}
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;