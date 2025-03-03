import authApiRequest from "@/apiRequests/auth"
import { LoginBodyType } from "@/schemaValidations/auth.schema"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { HttpError } from "@/lib/http"
export async function POST(request: Request) {
    const body = await request.json() as LoginBodyType
    const cookiesSrore = cookies()
    try {
        const { payload } = await authApiRequest.serverLogin(body)
        const { accessToken, refreshToken } = payload.data
        const decodeAccessToken = jwt.decode(accessToken) as { exp: number }
        const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number }
        cookiesSrore.set('accessToken', accessToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(decodeAccessToken.exp * 1000)
        })
        cookiesSrore.set('refreshToken', refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(decodeRefreshToken.exp * 1000)
        })
        return Response.json(payload)
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json({
                status: error.status,
                message: error.payload.message,
                errors: error.payload.errors
            }, { status: error.status })
        } else {
            return Response.json({
                status: 500,
                message: 'Lỗi không xác định'
            }, { status: 500 })
        }

    }
}