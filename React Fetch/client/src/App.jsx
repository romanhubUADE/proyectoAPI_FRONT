import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";

// ✔ DEBEN ESTAR ACÁ, SOLO UNA VEZ
import AdminProductEdit from "./pages/AdminProductEdit.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import CartPage from "./pages/CartPage.jsx";
import Checkout from "./pages/Checkout.jsx";
import CheckoutFinal from "./pages/CheckoutFinal.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";
import Search from "./pages/Search.jsx";
import Payment from "./pages/Payment.jsx";

import ProtectedRoute from "./router/ProtectedRoute.jsx";

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/search" element={<Search />} />

          {/* Protected */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route path="/checkout-final" element={<CheckoutFinal />} />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products/new"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminProductEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products/:id"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminProductEdit />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
