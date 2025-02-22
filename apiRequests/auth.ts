import { access } from 'fs';
import { LoginBodyType, LoginResType, LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from './../schemaValidations/auth.schema';
import http from "@/lib/http";

const authApiRequest = {
    serverLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body, { headers: { 'Content-Type': 'application/json' } }),

    login: (body: LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, { baseUrl: '', headers: { 'Content-Type': 'application/json' } }),
    sLogout: (
        body: LogoutBodyType & {
            accessToken: string
        }
    ) =>
        http.post(
            '/auth/logout',
            {
                refreshToken: body.refreshToken
            },
            {
                headers: {
                    Authorization: `Bearer ${body.accessToken}`
                }
            }
        ),
    logout: () => http.post('/api/auth/logout', null, { baseUrl: '' }), // client gọi đến route handler, không cần truyền AccessT và RefreshT vào body vì AT và RT tự  động gửi thông qua cookie rồi
    severRefreshToken: (body : RefreshTokenBodyType) => http.post<RefreshTokenResType>('/auth/refresh-token', body),
    refreshToken : () => http.post<RefreshTokenBodyType>('/api/auth/refresh-token', null, { baseUrl: '' })


}


export default authApiRequest;