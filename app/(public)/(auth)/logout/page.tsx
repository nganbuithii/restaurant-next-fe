'use client'

import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogOut } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LogoutPage() {
    const router = useRouter();
    const { mutateAsync } = useLogOut(); 
    const ref = useRef<any>(null);

    const searchParams= useSearchParams()
    const refreshTokenFrommUrl = searchParams.get('refreshToken')

    useEffect(() => {
        if(ref.current || refreshTokenFrommUrl !== getRefreshTokenFromLocalStorage()) return;
        ref.current= mutateAsync();

        mutateAsync().then(() => {
            setTimeout(() => {
                ref.current=null
            }, 1000);
            router.push("/login");
        })
    }, [mutateAsync, router, refreshTokenFrommUrl]); 

    return (
        <div>
            <h1>Logging out</h1>
        </div>
    );
}
