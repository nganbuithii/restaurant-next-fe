import accountApiRequest from "@/apiRequests/account"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useAccountProfile = () => {
    return useQuery({
        queryKey: ['account'],
        queryFn: accountApiRequest.getProfile,
    })
}


export const useUpdateMe = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe
    })
}