import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import ProductInterface from "@/app/components/ProductInterface"

export const fetchProducts = createAsyncThunk<ProductInterface[]>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/getallproducts");
      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message)
      }

      return data.products as ProductInterface[]
    } catch (error) {
      console.error("Fetch failed:", error)
      return rejectWithValue("Network error")
    }
  }
)


interface ProductsState {
  products: ProductInterface[]
  loading: boolean
  error: string | null
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<ProductInterface[]>) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default productsSlice.reducer;
