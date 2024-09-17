import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import ProductDetails from './components/ProductDetails'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import UserContextProvider from './context/UserContext'

function App() {

  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/productdetails/:id' element={<ProductDetails />} />
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
