import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Axios from 'axios';
import { v4 as uuid } from 'uuid';

function getTime() {
  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
  var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  return localISOTime
}

export const getProducts = createAsyncThunk('posts/getProducts', async () => {
  const { data } = await Axios.get('http://localhost:3001/products');
  return data.results;
})

export const newProduct = createAsyncThunk('products/newProduct', async (productData) => {
  productData.id = uuid().slice(0, 8)
  const { data } = await Axios.post(`http://localhost:3001/addproduct`, productData);
  if (data.message === "success") {
    productData.datetime = getTime()
    console.log(productData)
    return productData
  }
})

export const updateProduct = createAsyncThunk('products/updateProduct', async (productData) => {
  const { data } = await Axios.put(`http://localhost:3001/updateproduct/${productData.id}`, productData);
  if (data.message === "success") {
    productData.datetime = getTime()
    return productData;
  }
})

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productID) => {
  const { data } = await Axios.delete(`http://localhost:3001/deleteproduct/${productID}`);
  if (data.message === 'success') {
    return productID
  };
})

export const deleteAll = createAsyncThunk('products/deleteAll', async () => {
  await Axios.delete(`http://localhost:3001/deleteproducts`);
})

export const searchProducts = createAsyncThunk('products/searchProducts', async (letters) => {
  const {data} = await Axios.get(`http://localhost:3001/search/${letters}`);
  return data.result
})

const initialState = {
  status: 'idle',
  postProductStatus: 'idle',
  updateProductStatus: 'idle',
  error: null,
  postProductError: null,
  updateProductError: null,
  products: {},
  searchedProducts: {}
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    emptySearchedProducts: state => {state.searchedProducts = {}}
  },
  extraReducers(builder) {
    builder
      .addCase(getProducts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        let productsObj = {}
        action.payload.forEach(product => {
          productsObj[product.id] = product
        });
        state.products = productsObj
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
    ////////////////////////////////////////////////////////////////////

    builder
      .addCase(newProduct.pending, (state) => {
        state.postProductStatus = 'loading'
      })
      .addCase(newProduct.fulfilled, (state, action) => {
        state.postProductStatus = 'succeeded'
        // We can directly add the new product object to our products
        let newProduct = action.payload
        console.log(action.payload)
        state.products[newProduct.id] = newProduct
      })
      .addCase(newProduct.rejected, (state, action) => {
        state.postProductStatus = 'failed'
        state.postProductError = action.error.message
      })

    ////////////////////////////////////////////////////////////////////
    builder
      .addCase(updateProduct.pending, (state) => {
        state.updateProductStatus = 'loading'
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateProductStatus = 'succeeded'
        let updatedProduct = action.payload
        state.products[updatedProduct.id] = updatedProduct
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateProductStatus = 'failed'
        state.updateProductError = action.error.message
      })

    ////////////////////////////////////////////////////////////////////

    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      const productID = action.payload
      delete state.products[productID] // deletes property with key equal to the id
    })

    ////////////////////////////////////////////////////////////////////
    builder.addCase(deleteAll.fulfilled, (state) => {
      state.status = 'idle'
      state.products = {}
    })
    ////////////////////////////////////////////////////////////////////

    builder
      .addCase(searchProducts.fulfilled, (state, action) => {
        let productsObj = {}
        action.payload.forEach(product => {
          productsObj[product.id] = product
        });
        state.searchedProducts = productsObj
      })
  }
})
export const { emptySearchedProducts } = productsSlice.actions

export const productsReducer = productsSlice.reducer

export const selectAllProducts = state => state.Products.products

export const selectProductById = (state, productId) => {
  state.products.find(product => product.id === productId) //// assume products are array
}
