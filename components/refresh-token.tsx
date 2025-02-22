'use client'

import { checkRefreshToken } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"


// những page k check refresh token
const UNAUTHENTICATED_ROUTES = ['/login', '/logout', '/refresh-token']
export default function RefreshToken() {
    const router = useRouter()

    const pathname = usePathname()
    useEffect(() => {
        if (UNAUTHENTICATED_ROUTES.includes(pathname)) return

        let interval: any = null
        checkRefreshToken({
            onError: () => {
                clearInterval(interval),
                    router.push("/login")
            }
        })

        checkRefreshToken() // Gọi hàm ngay lập tức
        interval = setInterval(() => checkRefreshToken({
            onError: () => {
                clearInterval(interval)
                router.push("/login")
            }
        }), 1000) // Gọi lại sau mỗi 10s

        return () => clearInterval(interval)
    }, [pathname, router])

    return null
}