import {configureStore} from '@reduxjs/toolkit';
import { productsReducer } from '../Features/productsSlice';
// import { productReducer } from '../Features/productSlice';

export const store = configureStore({
    reducer: {
        Products: productsReducer,
    }
})