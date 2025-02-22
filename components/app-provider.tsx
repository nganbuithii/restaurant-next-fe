'use client'
import {

    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import RefreshToken from './refresh-token'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getAccessTokenFromLocalStorage, removeTokensFromLocalStorage } from '@/lib/utils'
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false
        },
    }
})

const AppContext = createContext({
    isAuth: false,
    setIsAuth: (isAuth: Boolean) => { }
})

export const useAppContext = () => {
    return useContext(AppContext)
}



export default function AppProvider({ children }: { children: React.ReactNode }) {
    const [isAuth, setIsAuthState] = useState(false)
    useEffect(()=>{
        const accessToken = getAccessTokenFromLocalStorage()
        if (accessToken) {
            setIsAuthState(true)
        }
    })
    const setIsAuth = useCallback((isAuth: boolean) => {
        if (isAuth) {
            setIsAuthState(true)
        } else {
            setIsAuthState(false)
            removeTokensFromLocalStorage()
        }
    },[])
    return (
        <AppContext.Provider value={{ isAuth: false, setIsAuth: () => { } }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
                <RefreshToken />
            </QueryClientProvider>
        </AppContext.Provider>
    )
}