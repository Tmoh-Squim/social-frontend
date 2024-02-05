import {createSlice,createAsyncThunk} from "@reduxjs/toolkit"
import axios from "axios"
import {ServerUrl} from "../server.tsx"
export const getConversations = createAsyncThunk('get-conversations',async(id)=>{
    try {
        const response = await axios.get(`${ServerUrl}/v2/conversation/user-conversation/${id}`,{
            headers:{
                "Authorization":`${localStorage.getItem('user-auth')}`
            }
        })        

        return response.data
    } catch (error) {
        console.log(error)
    }
})

const initialState ={
    conversations:[],
    isLoading:false,
    error:null
}

const conversationSlice = createSlice({
    name:"conversations",
    initialState,
    extraReducers:(builder)=>{
        builder
        .addCase(getConversations.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(getConversations.fulfilled,(state,action)=>{
            state.conversations = action.payload
            state.isLoading = false
        })
        .addCase(getConversations.rejected,(state,action)=>{
            state.error = action.payload
            state.isLoading = false
        })
    }
})

export default conversationSlice.reducer