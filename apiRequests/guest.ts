import { GuestCreateOrdersBodyType, GuestCreateOrdersResType, GuestGetOrdersResType, GuestLoginBodyType, GuestLoginResType } from '@/schemaValidations/guest.schema';
import { LoginBodyType, LoginResType, LogoutBodyType, RefreshTokenBodyType, RefreshTokenResType } from './../schemaValidations/auth.schema';
import http from "@/lib/http";
import { get } from 'http';

const guestApiRequest ={
    refreshTokenRequest: null as Promise<{
        status: number,
        payload: RefreshTokenResType
    }> | null,
    serverLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/guest/auth/login', body, { headers: { 'Content-Type': 'application/json' } }),

    login: (body: GuestLoginBodyType) => http.post<GuestLoginResType>('/api/guest/auth/login', body, { baseUrl: '', headers: { 'Content-Type': 'application/json' } }),
    sLogout: (
        body: LogoutBodyType & {
            accessToken: string
        }
    ) =>
        http.post(
            '/guest/auth/logout',
            {
                refreshToken: body.refreshToken
            },
            {
                headers: {
                    Authorization: `Bearer ${body.accessToken}`
                }
            }
        ),
    logout: () => http.post('/api/guest/auth/logout', null, { baseUrl: '' }), 
    severRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>('/guest/auth/refresh-token', body),
    async refreshToken() {
        if (this.refreshTokenRequest) return this.refreshTokenRequest
        this.refreshTokenRequest = http.post<RefreshTokenResType>('/api/guest/auth/refresh-token', null, { baseUrl: '' })
        const result = await this.refreshTokenRequest
        this.refreshTokenRequest = null
        return result
    },

    order:(body: GuestCreateOrdersBodyType) => http.post<GuestCreateOrdersResType>('/guest/orders', body),
    getOrders: () => http.get<GuestGetOrdersResType>('/guest/orders'),

}


export default guestApiRequest ;