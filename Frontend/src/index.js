import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom"
import ScrollToTop from "./ScrollToTop";

import {configureStore} from "@reduxjs/toolkit"
import {Provider} from "react-redux"
import appInformation from "./slices/appInformation.js"

const store = configureStore({
    reducer:{
        appInformation:appInformation
    }
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ScrollToTop />
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
);