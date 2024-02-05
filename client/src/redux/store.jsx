import {configureStore} from "@reduxjs/toolkit"
import conversationReducer from "./conversation"
import userReducer from "./user"
import {allUsers} from "./user"
import messageReducer from "./messages"
const store = configureStore({
    reducer:{
        user:userReducer,
        users:allUsers,
        conversations:conversationReducer,
        messages:messageReducer
    }
})

export default store