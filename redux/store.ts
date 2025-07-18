import {configureStore} from "@reduxjs/toolkit";
import adminReducer from './adminSlice'
import productsReducer from './productSlice';
import userReducer from './userSlice';

const store = configureStore({
    reducer: {admin: adminReducer, products: productsReducer, user: userReducer}
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;