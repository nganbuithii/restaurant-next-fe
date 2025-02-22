'use client'

import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { use, useEffect } from "react"
import jwt from "jsonwebtoken"
import { decode } from "punycode"
import authApiRequest from "@/apiRequests/auth"

// những page k check refresh token
const UNAUTHENTICATED_ROUTES = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
    const pathname = usePathname()
    useEffect(() => {
        if (UNAUTHENTICATED_ROUTES.includes(pathname)) return
    
        let interval: any = null
        const checkRefreshToken = async () => {
            const accessToken = getAccessTokenFromLocalStorage()
            const refreshToken = getRefreshTokenFromLocalStorage()
            console.log("access", accessToken)
            console.log("refresh", refreshToken)
            
            if (!accessToken || !refreshToken) return
    
            const now = new Date().getTime() / 1000
            const decodeAccessToken = jwt.decode(accessToken) as { exp: number , iat:number}
            const decodeRefreshToken = jwt.decode(refreshToken) as  { exp: number , iat:number}
    
            if (decodeRefreshToken.exp <= now) return
    
            if (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3) {
                try {
                    const res = await authApiRequest.refreshToken()
                    console.log("res",res)
                    setAccessTokenToLocalStorage(res.payload.data.accessToken)
                    setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
                } catch (error) {
                    clearInterval(interval)
                }
            }
        }
    
        checkRefreshToken() // Gọi hàm ngay lập tức
        interval = setInterval(checkRefreshToken, 1000) // Gọi lại sau mỗi 10s
    
        return () => clearInterval(interval)
    }, [pathname])
    
    return null
}