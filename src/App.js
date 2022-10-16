import './App.css';
import { AddForm } from './Components/AddForm';
import { Products } from './Components/Products';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getProducts } from './Redux/Features/productsSlice';

function App() {
  const [hideAddForm, setHideAddForm] = useState(false)
  const status = useSelector(state=>state.Products.status)
  const dispatch = useDispatch()
  useEffect(() => {
    status === 'idle' && dispatch(getProducts()) // to prevent fetching every rendering 
  }, [dispatch, status])

  return (
    <>
      <div className='logo position-fixed m-2'>
      </div>
      {hideAddForm ? '':<AddForm/>}
      <Products setHideAddForm = {setHideAddForm}/>
    </>
  );
}

export default App;
