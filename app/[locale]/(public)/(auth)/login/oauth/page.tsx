'use client'
import { useAppContext } from '@/components/app-provider'
import { toast } from '@/hooks/use-toast'
import { decodeToken, setAccessTokenToLocalStorage, setRefreshTokenToLocalStorage } from '@/lib/utils'
import { useSetTokenToCookies } from '@/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

export default function OauthPage() {
    const { setRole, setSocket } = useAppContext()
    const router = useRouter()
    const searchParams = useSearchParams()
    const accessToken = searchParams.get('accessToken')
    console.log("accessToken", accessToken)
    const refreshToken = searchParams.get('refreshToken')
    console.log("refres", refreshToken)
    const message = searchParams.get('message')
    const count = useRef(0)

    const { mutateAsync } = useSetTokenToCookies()
    useEffect(() => {
        if (accessToken && refreshToken) {
            if (count.current === 0) {

                mutateAsync({
                    accessToken,
                    refreshToken
                }).then(() => {
                    setRole(decodeToken(accessToken)?.role)
                    setAccessTokenToLocalStorage(accessToken)
                    setRefreshTokenToLocalStorage(refreshToken)
                    router.push('/manage/dashboard')
                }).catch(e => {
                    toast({
                        description: e.message
                    })
                })
                count.current++

            }
        } else {
            console.log("lỗi", message)
            if(count.current === 0) {
                setTimeout(()=> {
                        toast({
                    description: message ?? 'Đã có lỗi xảy ra'
                })
                })
            
                count.current++
            }
        }
    }, [accessToken, refreshToken, setRole, message])
    return null
}
