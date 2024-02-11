import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axios from "axios"
import {ServerUrl} from "../server"
export const loadUser = createAsyncThunk('load-user',async()=>{
    try {
        const response = await axios.get(`${ServerUrl}/v1/auth/getUser`,{
            headers:{
                "Authorization":`${localStorage.getItem('user-auth')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
})

export const loadAllUsers = createAsyncThunk('load-users',async()=>{
    try {
        const response = await axios.get(`${ServerUrl}/v1/auth/all-users`,{
            headers:{
                "Authorization":`${localStorage.getItem('user-auth')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
})

const initialState={
    user:{},
    loading:true,
    error:null
}

const userSlice = createSlice({
    name:"user",
    initialState,
    extraReducers:(builder)=>{
        builder
        .addCase(loadUser.pending,(state)=>{
            state.loading = true
        })
        .addCase(loadUser.fulfilled,(state,action)=>{
            state.user = action.payload
            state.loading = false
        })
        .addCase(loadUser.rejected,(state,action)=>{
            state.error = action.payload
            state.loading = false
        })
    }
})
export const allUsers = createSlice({
    name:"users",
    initialState:{
        users:[],
        isLoading:false,
        error:null
    },
    extraReducers:(builder)=>{
        builder
        .addCase(loadAllUsers.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(loadAllUsers.fulfilled,(state,action)=>{
            state.users = action.payload
            state.isLoading = false
        })
        .addCase(loadAllUsers.rejected,(state,action)=>{
            state.error = action.payload
            state.isLoading = false
        })
    }
}).reducer
export default userSlice.reducer