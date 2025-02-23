import accountApiRequest from "@/apiRequests/account"
import { UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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

export const useChangePassword = () => {
    return useMutation({
        mutationFn: accountApiRequest.changePassword
    })
}

export const useGetAccountList = () => {
    return useQuery({
        queryKey: ['accountList'],
        queryFn: accountApiRequest.list
    })
}

export const useGetAccount= ({id, enabled} : {id:number; enabled: boolean}) => {
    return useQuery({
        queryKey: ['account', id],
        queryFn: () => accountApiRequest.getEmployee(id),
        enabled
    })
}

export const useAddAccount = () => {
    const queryClient = useQueryClient(); 
    return useMutation({
        mutationFn: accountApiRequest.addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accountList'] })
        }
        // gọi lại getall acount
    })
}

export const useUpdateAccount = () => {
    const queryClient = useQueryClient(); 

    return useMutation({
        mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) => 
            accountApiRequest.updateEmployee(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accountList'] , exact:true}); // Refresh danh sách tài khoản
        }
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => accountApiRequest.deleteEmployee(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accountList'] }); // Refresh danh sách tài khoản
        }
    });
};