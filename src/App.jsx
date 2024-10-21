import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ProductDetails from './components/ProductDetails'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import UserContextProvider from './context/UserContext'
import Cart from './pages/Cart'
import CartContextProvider from './context/CartContext'
import Admin from './pages/Admin'
import My_Orders from './pages/My_Orders'

function App() {

  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <CartContextProvider>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/Signup' element={<Signup />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/productdetails/:id' element={<ProductDetails />} />
              <Route path='/admin' element={<Admin/>} />
              <Route path='/admin/:item' element={<Admin/>} />
              <Route path='/my_orders' element={<My_Orders/>} />
            </Routes>
          </CartContextProvider>
        </UserContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
