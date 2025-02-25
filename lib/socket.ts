"use client";

import envConfig from "@/config";
import { io } from "socket.io-client";
import { getAccessTokenFromLocalStorage } from "./utils";

const socket = io(envConfig.NEXT_PUBLIC_RESTAURANT_API,{
    auth:{
        Authorization : `Bearer ${getAccessTokenFromLocalStorage()}`
    }
});


export default socket;