import { LoginBodyType, LoginResType } from './../schemaValidations/auth.schema';
import http from "@/lib/http";

const authApiRequest={
    serverLogin: (body:LoginBodyType) => http.post<LoginResType>('/auth/login', body, { headers: { 'Content-Type': 'application/json' } }),

    login: (body:LoginBodyType) => http.post<LoginResType>('/api/auth/login', body, {baseUrl:'', headers: { 'Content-Type': 'application/json' }}),}

export default authApiRequest;