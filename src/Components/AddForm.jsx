import React, { useState, useEffect, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import { Button } from 'react-bootstrap'
import { newProduct} from '../Redux/Features/productsSlice'
import { useDispatch, useSelector } from 'react-redux'
import Joi from 'joi'
import Swal from 'sweetalert2'

export function AddForm() {
    const productBtn = useRef(null);
    const imgSpan = useRef(null);
    const successImg = useRef(null);

    const isMounted = useRef(false);

    const status = useSelector(state => state.Products.postProductStatus)
    const error = useSelector(state => state.Products.postProductError)
    const dispatch = useDispatch();

    const [product, setProduct] = useState({
        name: '',
        price: '',
        description: "",
        category: '',
        image: ''
    })

    const [errorMessages, setErrorMessages] = useState({
        name: undefined,
        price: undefined,
        description: undefined,
        category: undefined,
        image: undefined
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
            'Product Added!',
            '',
            'success'
        ).then(() => {
            window.location.reload();
        })
    } else if (status === 'failed'){
        Swal.fire({
            icon: 'error',
            title: "Oops... \n Product can't be added now!",
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
        isMounted.current && changeBorder(errorMessages.name, 'name')
    }, [errorMessages.name])

    useEffect(() => {
        isMounted.current && changeBorder(errorMessages.price, 'price')
    }, [errorMessages.price])

    useEffect(() => {
        isMounted.current && changeBorder(errorMessages.description, 'description')
    }, [errorMessages.description])

    useEffect(() => {
        isMounted.current && changeBorder(errorMessages.category, 'category')
    }, [errorMessages.category])

    useEffect(() => {
        isMounted.current && changeBorder(errorMessages.image, 'image')
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
        isMounted.current = true;

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

    // Add product
    function addProduct(e) {
        e.preventDefault();
        console.log(product)
        dispatch(newProduct(product));
    }

    return (
        <>
            <div id="main">
                <section className="container py-5">
                    <div className='row mt-3'>
                        <div className='col-lg-5 d-flex align-items-center justify-content-center'>
                            <div className="main-heading">
                                <h1 className='text-center my-4'>
                                    Products Management System
                                    <small>CRUD OPERATIONS</small>
                                </h1>

                            </div>
                        </div>
                        <div className='col-lg-7'>
                            <div className='form'>
                                {/*Start Bootstrap React Form*/}
                                <Form onSubmit={addProduct}>
                                    {/* Name */}
                                    <InputGroup className="mb-4">
                                        <Form.Control
                                            placeholder="Product Name"
                                            type='text'
                                            id="name"
                                            autoComplete='off'
                                            onChange={validateInput}
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
                                        />
                                        {errorMessages.description && (<span className="invalid-feedback text-danger"> {errorMessages.description} </span>)}

                                    </InputGroup>

                                    {/* Category */}
                                    <div className="input-group mb-4 position-relative">
                                        <select defaultValue = 'default' className="custom-select form-control" id="category" onChange={validateInput}>
                                            <option value='default' disabled>Select Product Category </option>
                                            <option value="electronics">Electronis</option>
                                            <option value="clothes">Clothes</option>
                                            <option value="food">Food</option>
                                            <option value="skin_care">Skin Care</option>
                                            <option value="other">Other</option>
                                        </select>

                                        {errorMessages.category && (<span className="invalid-feedback text-danger"> {errorMessages.category} </span>)}
                                    </div>

                                    {/* Image */}
                                    <div className="input-group mb-4 d-flex">

                                        <div className="p-half custom-file form-control w-100 position-relative d-flex justify-content-end">
                                            <span className='w-100 text-grey' id='img-span' ref={imgSpan}>
                                                <i className="fa-solid fa-upload me-2"></i>
                                                Product Image
                                            </span>
                                            <input type="file" className="pointer w-100 custom-file-input position-absolute start-0" id="image" placeholder='Product Image'
                                                onChange={validateInput} />
                                            <i className="fa-solid fa-check-to-slot text-success" id="check" ref={successImg}></i>
                                        </div>

                                        {errorMessages.img && (<span className="invalid-feedback text-danger"> {errorMessages.image} </span>)}
                                    </div>

                                    <Button id="product-btn" type="submit" className='w-100 d-block ms-auto disabled btn-danger' ref={productBtn}>
                                        Add Product
                                    </Button>
                                </Form>
                                {/*End Bootstrap React Form*/}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
