'use client'

import { useAppContext } from "@/components/app-provider";
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogOut } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
    const router = useRouter();
    const { mutateAsync } = useLogOut(); 
    const ref = useRef<any>(null);

    const {setIsAuth} = useAppContext()

    const searchParams= useSearchParams()
    const refreshTokenFrommUrl = searchParams.get('refreshToken')
    const accessTokenFromUrl = searchParams.get('accessToken')
    useEffect(() => {
        if(ref.current || (refreshTokenFrommUrl && refreshTokenFrommUrl !== getRefreshTokenFromLocalStorage() ) || ( accessTokenFromUrl && accessTokenFromUrl !== getAccessTokenFromLocalStorage())) return;
        ref.current= mutateAsync();

        mutateAsync().then(() => {
            setTimeout(() => {
                ref.current=null
            }, 1000);
            setIsAuth(false)
            router.push("/login");
        })
    }, [mutateAsync, router, refreshTokenFrommUrl, accessTokenFromUrl]); 

    return (
        <div>
            <h1>Logging out</h1>
        </div>
    );
}
