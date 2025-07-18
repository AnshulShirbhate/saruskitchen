import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

export const checkIsLoggedIn = createAsyncThunk('user/checkIsLoggedIn', async ()=>{
    try {
          const response = await fetch("/api/checkisloggedin");;
          const data = await response.json();
          return data.isLoggedIn;
        } catch (error) {
           console.log("Some issue in the server!", error)
        }
})

interface adminInitialStateInterface {
    isLoggedIn: boolean;
}

const initialState: adminInitialStateInterface = {
    isLoggedIn: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        }
    },
    extraReducers: (builder) =>{
        builder.addCase(checkIsLoggedIn.fulfilled, (state, action)=>{
            state.isLoggedIn = action.payload;
        })
    }
})

export const {setLoggedIn} = userSlice.actions;
export default userSlice.reducer;