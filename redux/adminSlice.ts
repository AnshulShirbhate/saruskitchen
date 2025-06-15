import {createSlice} from '@reduxjs/toolkit';

interface adminInitialStateInterface {
    isAdmin: boolean;
}

const initialState: adminInitialStateInterface = {
    isAdmin: false
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdmin: (state, action) => {
            state.isAdmin = action.payload;
        }
    }
})

export const {setAdmin} = adminSlice.actions;
export default adminSlice.reducer;