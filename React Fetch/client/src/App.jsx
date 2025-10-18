import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CartPage from "./pages/CartPage.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import About from "./pages/About.jsx"; 
import Footer from "./components/Footer.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";
import Search from "./pages/Search.jsx";
import Payment from "./pages/Payment.jsx";
import CheckoutFinal from "./pages/CheckoutFinal.jsx";
import ProtectedRoute from './router/ProtectedRoute.jsx';
import AdminProducts from "./pages/AdminProducts.jsx";






export default function App() {
  return (
    <>
      <NavBar />
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<Payment />} />   
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout-final" element={<CheckoutFinal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/search" element={<Search />} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminProducts /></ProtectedRoute>} />

        
        </Routes>
      </div>
      <Footer />
    </>
  );
}
