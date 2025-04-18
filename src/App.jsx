import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/Home'
import './App.css'
import Login from './components/Login'
import Orders from './components/Orders'

const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
