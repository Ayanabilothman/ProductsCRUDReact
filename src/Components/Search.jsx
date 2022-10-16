import React from 'react'
import '../Styles/Search.css';
import { useDispatch } from 'react-redux'
import {searchProducts, emptySearchedProducts} from '../Redux/Features/productsSlice'

export function Search(props) {
    const dispatch = useDispatch()

    async function searchProduct(e) {
        props.setCategoryClicked('search')
        let letters = e.currentTarget.value
        if(letters) {
            dispatch(searchProducts(letters)) 
        }
        else {
            props.setCategoryClicked('all')
            dispatch(emptySearchedProducts())
        }
    }

    return (
        <>
            <div className="w-100 mb-4 d-flex mx-auto">
                <input type="search" className="form-control w-90" placeholder='Search Product in all categories by Name' onChange={searchProduct}/>
                <button type="button" id='search-btn' className="btn btn-primary w-10">
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </>
    )
}
