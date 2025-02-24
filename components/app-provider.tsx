'use client'
import {

    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshToken from './refresh-token'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {  decodeToken, getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
import { RoleType } from '@/types/jwt.types'
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        },
    }
})
const AppContext = createContext<{
    role: RoleType | undefined;
    setRole: (role: RoleType | undefined) => void;
    isAuth: boolean;
    setIsAuth: (isAuth: boolean) => void;
}>({
    role: undefined,
    setRole: () => {},
    isAuth: false,
    setIsAuth: () => {},
});


export const useAppContext = () => {
    return useContext(AppContext)
}



export default function AppProvider({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuthState] = useState(false)
    const [role, setRoleState] = useState<RoleType | undefined>()
    useEffect(() => {
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            setIsAuthState(true)
            const role= decodeToken(accessToken).role
            setRoleState(role)
        }
    })
    const setRole = useCallback((role?:RoleType | undefined) => {
        setRoleState(role)
        if(!role){
            removeTokensFromLocalStorage()
        }
    }, [])
    const setIsAuth = useCallback((isAuth: boolean) => {
        if (isAuth) {
            setIsAuthState(true)
        } else {
            setIsAuthState(false)
            removeTokensFromLocalStorage()
        }
    },[])
    return (
        <AppContext.Provider value={{ role, setRole, isAuth, setIsAuth }}>

            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
                <RefreshToken />
            </QueryClientProvider>
        </AppContext.Provider>
    )
}