import React, { useState, useEffect, useRef } from 'react'
import '../Styles/UpdateForm.css'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Button } from 'react-bootstrap'
import { updateProduct } from '../Redux/Features/productsSlice'
import { useDispatch, useSelector } from 'react-redux'
import Joi from 'joi'
import Swal from 'sweetalert2'

export function UpdateFrom(props) {
    const productToUpdate = props.updatedProduct
    const updatedImg = useRef()

    document.querySelector('html').style.overflow = 'hidden'
    const productBtn = useRef(null);
    const imgSpan = useRef(null);
    const successImg = useRef(null);

    const status = useSelector(state => state.Products.updateProductStatus)
    const error = useSelector(state => state.Products.updateProductError)
    const dispatch = useDispatch();

    const [product, setProduct] = useState({
        name: productToUpdate.name,
        price: productToUpdate.price,
        description: productToUpdate.description,
        category: productToUpdate.category,
        image: productToUpdate.image
    })

    const [errorMessages, setErrorMessages] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: ''
    })

    const [formIsValid, setFormIsValid] = useState(false);

    //Start Joi Object
    const schema = Joi.object({
        name: Joi.string().alphanum().min(2).max(50).required(),
        price: Joi.number().min(5).required(),
        description: Joi.string().min(10).max(400).required(),
        category: Joi.required(),
        image: Joi.required()
    })
    //End Joi Object

    // Alert
    if (status === 'succeeded') {
        Swal.fire(
            'Product Updated!',
            '',
            'success'
        ).then(() => {
            window.location.reload();
        })
    } else if (status === 'failed') {
        Swal.fire({
            icon: 'error',
            title: "Oops... \n Product can't be updated now!",
            text: `${error}`,
        })
    } else if (status === 'loading'){
        Swal.showLoading()
    }

    // Change input borders

    function changeBorder(propertyValue, property) {
        const input = document.querySelector(`#${property}`);
        if (propertyValue !== '') {
            input.classList.remove('is-valid')
        } else {
            input.classList.add('is-valid')
        }
    }

    useEffect(() => {
        changeBorder(errorMessages.name, 'name')
    }, [errorMessages.name])

    useEffect(() => {
        changeBorder(errorMessages.price, 'price')
    }, [errorMessages.price])

    useEffect(() => {
        changeBorder(errorMessages.description, 'description')
    }, [errorMessages.description])

    useEffect(() => {
        changeBorder(errorMessages.category, 'category')
    }, [errorMessages.category])

    useEffect(() => {
        changeBorder(errorMessages.image, 'image')
    }, [errorMessages.image])

    // Enable submission
    useEffect(() => {
        function enableSubmission() {
            if (formIsValid) {
                productBtn.current.classList.remove('disabled', 'btn-danger', 'btn-warning')
                productBtn.current.classList.add('btn-success')
            } else {
                productBtn.current.classList.remove('btn-success')
                productBtn.current.classList.add('disabled', 'btn-danger')
            }
        }
        enableSubmission()
    }, [formIsValid])

    useEffect(() => {
        const isEmpty = Object.values(errorMessages).every(error => error === '');
        isEmpty ? setFormIsValid(true) : setFormIsValid(false)

    }, [errorMessages])

    function changeState(setFunction, key, value) {
        setFunction(
            (previousState) => {
                return { ...previousState, [key]: value }
            }
        )
    }

    // Validate inputs
    function validateInput(e) {
        const inputValue = e.currentTarget.value;
        const inputId = e.currentTarget.id;

        const subSchema = schema.extract(inputId)
        var validationResult = subSchema.validate(inputValue);

        let errorMessage
        validationResult.error ? errorMessage = validationResult.error.message : errorMessage = ''

        changeState(setErrorMessages, inputId, errorMessage)
        changeState(setProduct, inputId, inputValue)

        if (inputId === 'image') {
            imgSpan.current.classList.remove('text-grey');
            imgSpan.current.classList.add('text-white');
            imgSpan.current.innerHTML = inputValue;
            successImg.current.style.display = 'inline';

            var reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.addEventListener('load', () => changeState(setProduct, 'image', reader.result))
        }
     }

    function displayImage(e) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.addEventListener('load', () => {
            updatedImg.current.src = reader.result
        })
    }

    // Update product
    function changeProduct(e) {
        e.preventDefault();
        let productWithId = {...product}
        productWithId.id = productToUpdate.id
        dispatch(updateProduct(productWithId));
    }

    // close the form
    function handleCloseForm() {
        props.setHideAddForm(false)
        props.setUpdatedClicked(false)
        document.querySelector('html').style.overflow = 'auto'
    } 

    return (
        <>
            <section id="update-form" className='position-fixed top-0 bottom-0 start-0 w-100 d-flex align-items-center justify-content-center'>
                <div className="form update-form w-75 m-auto position-relative">
                    <div className="close-btn position-absolute m-3 end-0 top-0" onClick={handleCloseForm}>
                        <i className="fa-solid fa-square-xmark fa-2x text-white pointer"></i>
                    </div>
                    {/*Start Bootstrap React Form*/}
                    <Form onSubmit={changeProduct}>
                        <div className="row">
                            <div className='col-lg-7 col-md-6 align-items-center d-flex direction-column'>
                                <div className="left-group w-100">
                                    {/* Name */}
                                <InputGroup className="mb-4">
                                    <Form.Control
                                        placeholder="Product Name"
                                        type='text'
                                        id="name"
                                        autoComplete='off'
                                        onChange={validateInput}
                                        defaultValue={productToUpdate.name}
                                    />
                                    {errorMessages.name && (<span className="invalid-feedback text-danger"> {errorMessages.name} </span>)}

                                </InputGroup>

                                {/* Price */}
                                <InputGroup className="mb-4">
                                    <Form.Control
                                        type='number'
                                        id="price"
                                        autoComplete='off'
                                        placeholder='Product Price'
                                        onChange={validateInput}
                                        defaultValue={productToUpdate.price}
                                    />
                                    {errorMessages.price && (<span className="invalid-feedback text-danger"> {errorMessages.price} </span>)}

                                </InputGroup>

                                {/* Description */}
                                <InputGroup className='mb-4'>
                                    <Form.Control
                                        as="textarea"
                                        aria-label="With textarea"
                                        id="description"
                                        placeholder='Product Description'
                                        onChange={validateInput}
                                        defaultValue={productToUpdate.description}
                                    />
                                    {errorMessages.description && (<span className="invalid-feedback text-danger"> {errorMessages.description} </span>)}

                                </InputGroup>

                                {/* Category */}
                                <div className="input-group position-relative">
                                    <select defaultValue = {productToUpdate.category} className="custom-select form-control" id="category" onChange={validateInput}>
                                        <option disabled>Select Product Category </option>
                                        <option value="electronics">Electronis</option>
                                        <option value="clothes">Clothes</option>
                                        <option value="food">Food</option>
                                        <option value="skin_care">Skin Care</option>
                                        <option value="other">Other</option>
                                    </select>

                                    {errorMessages.category && (<span className="invalid-feedback text-danger"> {errorMessages.category} </span>)}
                                </div>
                                </div>
                            </div>

                            <div className="col-lg-5 col-md-6">
                                {/* Image */}
                                <div className="updated-img my-3 d-flex align-items-center justify-content-center">
                                    <img src={`${productToUpdate.image}`} alt={`${productToUpdate.name}`} ref = {updatedImg}/>
                                </div>
                                <div className="input-group mb-4 d-flex">
                                    <div className="p-half custom-file form-control w-100 position-relative d-flex justify-content-end">
                                        <span className='w-100 text-grey' id='img-span' ref={imgSpan}>
                                            <i className="fa-solid fa-upload me-2"></i>
                                            Product Image
                                        </span>
                                        <input type="file" className="pointer w-100 custom-file-input position-absolute start-0" id="image" placeholder='Product Image'
                                            onChange={(e)=>{
                                                validateInput(e)
                                                displayImage(e)}} />
                                        <i className="fa-solid fa-check-to-slot text-success" id="check" ref={successImg}></i>
                                    </div>

                                    {errorMessages.img && (<span className="invalid-feedback text-danger"> {errorMessages.img} </span>)}

                                </div>

                            </div>
                        </div>

                        <Button id="product-btn" type="submit" className='w-100 d-block ms-auto disabled btn-danger' ref={productBtn}>
                            Update Product
                        </Button>
                    </Form>
                    {/*End Bootstrap React Form*/}
                </div>
            </section>
        </>
    )
}
