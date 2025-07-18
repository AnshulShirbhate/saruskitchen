import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const checkIsAdmin = createAsyncThunk('admin/checkIsAdmin', async ()=>{
    try {
          const response = await fetch("/api/checkisadmin");
          const data = await response.json();
          return data.isAdmin;
        } catch (error) {
           console.log("Some issue in the server!")
        }
})

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
    },
    extraReducers: (builder) =>{
        builder.addCase(checkIsAdmin.fulfilled, (state, action)=>{
            state.isAdmin = action.payload;
        })
    }
})

export const {setAdmin} = adminSlice.actions;
export default adminSlice.reducer;