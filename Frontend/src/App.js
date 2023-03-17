import {Routes, Route} from "react-router-dom"
import "./styles/App.css"

import Home from "./pages/Home/Home.js";

import Vehicle from "./pages/Category/Vehicle.js"
import Computer from "./pages/Category/Computer.js"
import Security from "./pages/Category/Security.js"
import Apparel from "./pages/Category/Apparel.js"
import Cooking from "./pages/Category/Cooking.js"
import Outdoor from "./pages/Category/Outdoor.js"
import Onsale from "./pages/Category/Onsale.js"
import Product from "./pages/Product/Product";
import DefaultLayout from "./pages/DefaultLayout.js";
import ReturnPolicy from "./pages/Returns/ReturnPolicy.js"
import Privacy from "./pages/Privacy/Privacy.js"
import About from "./pages/About/About.js"
import Login from "./pages/Login/Login";
import Account from "./pages/Account/Account";
import Cart from "./pages/Cart/Cart"
import Error from "./pages/Error/Error"
import CreateAccount from "./pages/CreateAccount/CreateAccount";
import Orders from "../src/pages/Orders/Orders"

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
          
        <Route path="vehicle" element={<Vehicle />} />
        <Route path="computer" element={<Computer />} />
        <Route path="security" element={<Security />} />
        <Route path="apparel" element={<Apparel />} />
        <Route path="cooking" element={<Cooking />} />
        <Route path="outdoor" element={<Outdoor />} />
        <Route path="onsale" element={<Onsale />} />

        <Route path="login" element={<Login />} />
        <Route path="createaccount" element={<CreateAccount />} />
        <Route path="account" element={<Account />} />
        <Route path="cart" element={<Cart />} />
        <Route path="orders" element={<Orders />} />

        <Route path="returns" element={<ReturnPolicy />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="about" element={<About />} />

        <Route path="product/:productId" element={<Product />} />
      </Route>

      <Route path="*" element={<Error />} />
    </Routes>
  );
}

export default App;