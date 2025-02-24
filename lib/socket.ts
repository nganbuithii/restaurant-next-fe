"use client";

import envConfig from "@/config";
import { io } from "socket.io-client";

const socket = io(envConfig.NEXT_PUBLIC_RESTAURANT_API,{
    auth:{
        Authorization : `Bearer ${localStorage.getItem('accessToken')}`
    }
});


export default socket;