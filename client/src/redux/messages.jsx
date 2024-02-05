import {createAsyncThunk,createSlice} from "@reduxjs/toolkit"
import axios from "axios"
import {ServerUrl} from "../server.tsx"
export const getMessages = createAsyncThunk('get-messages',async(id)=>{
    try {
        
        const response = await axios.get(`${ServerUrl}/v2/message/get-messages/${id}`,{
            headers:{
                "Authorization":`${localStorage.getItem('user-auth')}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
})
const initialState = {
    messages:[],
    isLoading:false,
    error:null
}
const messageSlice = createSlice({
    name:"messages",
    initialState,
    extraReducers:(builder)=>{
        builder
        .addCase(getMessages.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getMessages.fulfilled,(state,action)=>{
            state.messages = action.payload
            state.isLoading = false
        })
        .addCase(getMessages.rejected,(state,action)=>{
            state.error = action.payload
            state.isLoading = false
        })
    }
})

export default messageSlice.reducer