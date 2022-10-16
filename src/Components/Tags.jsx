import React, {  } from 'react'
import '../Styles/Tags.css'

export function Tags(props) {

    function showCategorizedProducts(e) {
        const category = e.target.getAttribute('data-category')
        props.setCategoryClicked(category)
    }

    const currentCategory = props.categoryClicked

    return (
        <>
            <div className="container my-5">
                <div className="tags flex-wrap d-flex align-items-center justify-content-evenly">

                <div className='position-relative tag-bg mx-3'>
                        <button onClick={showCategorizedProducts} data-category="all" className={(currentCategory === 'all' && 'all-clicked') + ' border-dark-blue py-2 px-3 '}>All</button>
                        <div className='position-absolute w-100 bg-dark-blue'></div>
                    </div>

                    <div className='position-relative tag-bg mx-3'>
                        <button onClick={showCategorizedProducts} data-category="electronics" className={(currentCategory === 'electronics' && 'electronics-clicked') + ' border-yellow py-2 px-3'}>Electronics</button>
                        <div className='position-absolute w-100 bg-yellow'></div>
                    </div>
                    <div className='position-relative tag-bg mx-3'>
                        <button onClick={showCategorizedProducts} data-category="clothes" className={(currentCategory === 'clothes' && 'clothes-clicked') + ' border-blue py-2 px-3'}>Clothes</button>
                        <div className='position-absolute w-100 bg-blue'></div>
                    </div>

                    <div className='position-relative tag-bg mx-3'>
                    <button onClick={showCategorizedProducts} data-category="food" className={(currentCategory === 'food' && 'food-clicked') +' border-pink py-2 px-3'}>Food</button>
                        <div className='position-absolute w-100 bg-pink'></div>
                    </div>

                    <div className='position-relative tag-bg mx-3'>
                    <button onClick={showCategorizedProducts} data-category="skin_care" className={(currentCategory === 'skin_care' && 'skinCare-clicked') +' border-green py-2 px-3'}>Skin Care</button>
                        <div className='position-absolute w-100 bg-green'></div>
                    </div>

                    <div className='position-relative tag-bg mx-3'>
                    <button onClick={showCategorizedProducts} data-category="other" className={(currentCategory === 'other' && 'other-clicked') +' border-light-green py-2 px-3'}>Other</button>

                        <div className='position-absolute w-100 bg-light-green '></div>
                    </div>

                </div>
            </div>
        </>
    )
}

