'use client'

import socket from "@/lib/socket"
import { checkRefreshToken } from "@/lib/utils"
import { useRouter , usePathname} from '@/i18n/navigation'
import { useEffect } from "react"


// những page k check refresh token
const UNAUTHENTICATED_ROUTES = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
    const router = useRouter()

    const pathname = usePathname()
    useEffect(() => {
        if (UNAUTHENTICATED_ROUTES.includes(pathname)) return
        const onCheckRefreshToken = (force?: boolean) => {
            checkRefreshToken({
                onError: () => {
                    clearInterval(interval),
                        router.push("/login")
                }, force
            })
        }

        let interval: any = null
        onCheckRefreshToken()

        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            console.log("id", socket.id)

        }

        function onDisconnect() {
            console.log("disconnect")
        }
        function onCheckRefreshTokenSocket() {
            onCheckRefreshToken(true)
        }
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("refresh-token", onCheckRefreshTokenSocket);


        checkRefreshToken() // Gọi hàm ngay lập tức
        interval = setInterval(onCheckRefreshToken, 1000) // Gọi lại sau mỗi 10s

        return () => {
            clearInterval(interval)
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("refresh-token", onCheckRefreshTokenSocket);

        }
    }, [pathname, router])

    return null
}