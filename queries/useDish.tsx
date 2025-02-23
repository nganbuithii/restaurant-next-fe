import dishApiRequest from "@/apiRequests/dish"
import { UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
import { UpdateDishBodyType } from "@/schemaValidations/dish.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useGeDishesList = () => {
    return useQuery({
        queryKey: ['dishList'],
        queryFn: dishApiRequest.list
    })
}

export const useGetDetailDish = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['dish', id],
        queryFn: () => dishApiRequest.getDetailDish(id),
        enabled
    })
}

export const useAddDish = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: dishApiRequest.addDish,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dishList'] })
        }
        // gọi lại getall acount
    })
}

export const useUpdateDish = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
            dishApiRequest.updateDish(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accountList'], exact: true }); // Refresh danh sách tài khoản
        }
    });
};

export const useDeleteDish = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => dishApiRequest.deleteDish(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accountList'] }); // Refresh danh sách tài khoản
        }
    });
};