import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const checkIsLoggedIn = createAsyncThunk('user/checkIsLoggedIn', async () => {
    try {
        const response = await fetch("/api/checkisloggedin");;
        const data = await response.json();
        return data;
    } catch (error) {
        console.log("Some issue in the server!", error)
    }
})

interface UserInterface {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    isVerified: boolean
}

interface adminInitialStateInterface {
    isLoggedIn: boolean;
    user: UserInterface | null;
}

const initialState: adminInitialStateInterface = {
    isLoggedIn: false,
    user: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(checkIsLoggedIn.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.user = action.payload.user;
        })
    }
})

export const { setLoggedIn, setUser } = userSlice.actions;
export default userSlice.reducer;