import { access } from 'fs';
import authApiRequest from "@/apiRequests/auth"
import { cookies } from "next/headers"

export async function authRoutes(request: Request) {
    const cookiesSrore = cookies()
    const accessToken = cookiesSrore.get('accessToken')?.value
    const refreshToken = cookiesSrore.get('refreshToken')?.value
    cookiesSrore.delete('accessToken')
    cookiesSrore.delete('refreshToken')
    if (!accessToken || !refreshToken) {
        return Response.json({
            status: 200,
            message: 'Không nhận được accessToken và refreshToken',
        })
    }
    try {
        const res = await authApiRequest.sLogout({ accessToken, refreshToken })
        return Response.json(res.payload)
    } catch (error) {

        return Response.json({
            status: 200,
            message: 'Lỗi khi gọi api đến backend'
        }, { status: 200 })


    }
}