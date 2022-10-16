import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Tags } from './Tags';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllProducts, deleteAll } from '../Redux/Features/productsSlice'
import { UpdateFrom } from './UpdateFrom';
import { Button } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { Search } from './Search';
import { useEffect } from 'react';
import { useMemo } from 'react';

export function Products(props) {
  const dispatch = useDispatch()
  const status = useSelector(state => state.Products.status)
  const error = useSelector(state => state.Products.error)

  const productsObj = useSelector(selectAllProducts)  
  const orderedProducts = useMemo(()=>{
    return Object.values(productsObj).sort((a, b) => -a.datetime.localeCompare(b.datetime))
  }, [productsObj])

  const searchedProductsObj = useSelector(state => state.Products.searchedProducts)
  const orderedsearchedProducts = useMemo(()=>{
    return Object.values(searchedProductsObj).sort((a, b) => -a.datetime.localeCompare(b.datetime))
  }, [searchedProductsObj])
  
  const [updatedClicked, setUpdatedClicked] = useState(false)
  const [updatedProduct, setUpdatedProduct] = useState({})

  const [categoryClicked, setCategoryClicked] = useState('all')
  const [productsToShow, setProductsToShow] = useState([])

  useEffect(()=>{
    if (categoryClicked === 'all') {
      setProductsToShow(orderedProducts)
    } else if (categoryClicked === 'search' && orderedsearchedProducts.length > 0) {
      setProductsToShow(orderedsearchedProducts)
    } else {
      const categorizedProducts = orderedProducts.filter(
        (product) => product.category === categoryClicked
      )
      setProductsToShow(categorizedProducts)
    }
  }, [categoryClicked, orderedProducts ,orderedsearchedProducts])
  // .length , because without them we run into infinte loop, because every time
  // we setState the component rerender and every time new orderedProducts and orderedsearchedProducts
  // created with new refrence in memory , which for useEffect it sees it as a change or new object
  // so it rerednders again and so on.

  // const products = [...allProducts] // it was not defined before doing this
  // For those coming to this issue with this error message using React/Redux, it might be that you're trying to mutate state directly

  function deleteAllProducts() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete them!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'All products have been deleted.',
          'success'
        )
        dispatch(deleteAll())
      }
    })
  }


  if (status === 'loading') {
    return <>
      <div className='d-flex align-items-center justify-content-center my-5'>
        <div>Loading!</div>
        <i className='fa-solid fa-spinner spin fa-2x text-danger'></i>
      </div>
    </>
  } else if (status === 'failed') {
    return <>
      <div className='d-flex align-items-center justify-content-center my-5'>
        <div className='h1'> {error} </div>
      </div>
    </>
  } else {
    return (
      <>
        <Tags categoryClicked={categoryClicked} setCategoryClicked={setCategoryClicked} />
        {updatedClicked && <UpdateFrom setUpdatedClicked={setUpdatedClicked} updatedProduct={updatedProduct} setHideAddForm={props.setHideAddForm} />}

        <div className="container mb-5">
          <div className="row gy-4 gx-4">
          {(orderedProducts.length > 0 && (categoryClicked === 'all' || categoryClicked === 'search')) && <Search setCategoryClicked={setCategoryClicked} />}
          {productsToShow.length > 0 ?
           productsToShow.map((product) => <ProductCard key={product.id} product={product} setUpdatedClicked={setUpdatedClicked} setUpdatedProduct={setUpdatedProduct} setHideAddForm={props.setHideAddForm} />) 
          :
          <div className='text-center h1 mb-5'> No Matched Products! </div>
          }
          </div>

          {(orderedProducts.length > 0 && categoryClicked === 'all') &&
           <Button id="delete-all-btn" type="submit" className='w-100 d-block ms-auto btn-danger my-5' onClick={deleteAllProducts}>
            Delete All Products
          </Button>}

          {(orderedProducts.length < 1) &&
          <div className='text-center h1 mb-5'> No Products added yet! Try to add one. </div>}
        </div>
      </>
    )
  }
}
