import React from 'react';
import '../Styles/ProductCard.css'
import { deleteProduct } from '../Redux/Features/productsSlice';
import { useDispatch } from 'react-redux';

export function ProductCard(props) {

  const {id, name, price, description, category, image, datetime} = props.product;
  const timestamp = new Date(datetime).toString().slice(4, 24);
  const dispatch = useDispatch()
  
  async function removeProduct() {
    dispatch(deleteProduct(id))
  }

  function setProductId() {
    props.setUpdatedProduct({id, name, price, description, category, image})
  }

  function displayUpdateForm() {
    props.setUpdatedClicked(true)
  }

  function handleUpdateclick() {
    setProductId()
    displayUpdateForm()
    props.setHideAddForm(true)
  }
  return (
    <>
      <div className="col-lg-3 col-md-4">
        <div className={"product-card " + category}>
          <div className="product-img d-flex justify-content-center align-items-center">
            <img className='' src={`${image}`} alt="" />
          </div>
          <div className="product-info p-3 bg-light position-relative">
            <h2 className='h4'>{name}</h2>
            <p>{description}</p>
            <p> <strong> {price} LE </strong></p>
            <div className="time">
              <strong>Created On: </strong>
              <small>{timestamp}</small>
            </div>

            <div className="overlay position-absolute w-100 start-0 bg-dark d-flex align-items-center justify-content-center">
              <div className="btns text-center">
                <button onClick={handleUpdateclick} className='btn btn-warning d-block my-4 mx-auto px-4' id={id}>Update</button>
                <button onClick={removeProduct} className='btn btn-danger d-block my-4 mx-auto px-4' id={id}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

