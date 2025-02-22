import authApiRequest from "@/apiRequests/auth"
import { LoginBodyType, RefreshTokenBodyType } from "@/schemaValidations/auth.schema"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { HttpError } from "@/lib/http"
export async function POST(request: Request) {
    const cookiesSrore = cookies()
    const refreshToken = cookiesSrore.get('refreshToken')?.value
    if (!refreshToken) {
        return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }
    try {
        const { payload } = await authApiRequest.severRefreshToken({ refreshToken })
        const decodeAccessToken = jwt.decode(payload.data.accessToken) as { exp: number }
        const decodeRefreshToken = jwt.decode(payload.data.refreshToken) as { exp: number }

        cookiesSrore.set('accessToken', payload.data.accessToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(decodeAccessToken.exp * 1000)
        })
        cookiesSrore.set('refreshToken', payload.data.refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(decodeRefreshToken.exp * 1000)
        })
        return Response.json(payload)
    } catch (error: any) {

        return Response.json({


            message: error.message ?? 'có lỗi xảy ra'
        }, { status: 401 })
    }


}