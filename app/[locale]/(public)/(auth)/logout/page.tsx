'use client'

import { useAppContext } from "@/components/app-provider";
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogOut } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";


function Logout() {
    const router = useRouter();
    const { mutateAsync } = useLogOut();
    const ref = useRef<any>(null);

    const { setIsAuth , setRole} = useAppContext()

    const searchParams = useSearchParams()
    const refreshTokenFrommUrl = searchParams.get('refreshToken')
    const accessTokenFromUrl = searchParams.get('accessToken')
    useEffect(() => {
        if (ref.current || (refreshTokenFrommUrl && refreshTokenFrommUrl === getRefreshTokenFromLocalStorage()) || (accessTokenFromUrl && accessTokenFromUrl === getAccessTokenFromLocalStorage())) {
            ref.current = mutateAsync
            mutateAsync().then((res) => {
                setTimeout(() => {
                    ref.current = null
                }, 1000)
                router.push('/login')
            })
        }
        else if (accessTokenFromUrl !== getAccessTokenFromLocalStorage()) {
            router.push('/')
        }
    }, [mutateAsync, router, refreshTokenFrommUrl, accessTokenFromUrl, setIsAuth, setRole]);

    return null
}
export default function LogoutPage() {
    return (
        <Suspense fallback={<div>Loading..</div>}>
            <Logout />
        </Suspense>
    )
}
