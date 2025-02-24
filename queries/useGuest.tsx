import guestApiRequest from "@/apiRequests/guest"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGuestLogin = () => {
    return useMutation({
        mutationFn: guestApiRequest.login

    })
}


export const useGuestLogOut = () => {
    return useMutation({
        mutationFn: guestApiRequest.logout
    })
}

export const useGuestOrder = () => {
    return useMutation({
        mutationFn: guestApiRequest.order
    })
}


export const useGetOrderList = () => {
    return useQuery({
        queryFn: guestApiRequest.getOrders,
        queryKey: ['orders-guest']
    })
}