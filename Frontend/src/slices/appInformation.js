import {createSlice} from "@reduxjs/toolkit"

const appInformationSlice = createSlice({
    name:"appInformation",
    initialState:
    {
        apparel:{maxReached:false, products:[]},
        cooking:{maxReached:false, products:[]},
        computer:{maxReached:false, products:[]},
        onsale:{maxReached:false, products:[]},
        outdoor:{maxReached:false, products:[]},
        security:{maxReached:false, products:[]},
        vehicle:{maxReached:false, products:[]}
    },
    reducers:
    {
        updateApparel:(state, action)=>{state.apparel = {maxReached:action.payload.maxReached, products:[...state.apparel.products, ...action.payload.products]}},
        updateCooking:(state, action)=>{state.cooking = {maxReached:action.payload.maxReached, products:[...state.cooking.products, ...action.payload.products]}},
        updateComputer:(state, action)=>{state.computer = {maxReached:action.payload.maxReached, products:[...state.computer.products, ...action.payload.products]}},
        updateOnsale:(state, action)=>{state.onsale = {maxReached:action.payload.maxReached, products:[...state.onsale.products, ...action.payload.products]}},
        updateOutdoor:(state, action)=>{state.outdoor = {maxReached:action.payload.maxReached, products:[...state.outdoor.products, ...action.payload.products]}},
        updateSecurity:(state, action)=>{state.security = {maxReached:action.payload.maxReached, products:[...state.security.products, ...action.payload.products]}},
        updateVehicle:(state, action)=>{state.vehicle = {maxReached:action.payload.maxReached, products:[...state.vehicle.products, ...action.payload.products]}}
    }
})

export default appInformationSlice.reducer
export const {updateCart, updateApparel, updateCooking, updateComputer, updateOnsale, updateOutdoor, updateSecurity, updateVehicle} = appInformationSlice.actions