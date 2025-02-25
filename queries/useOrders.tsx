import orderApirequest from "@/apiRequests/order"
import { GetOrdersQueryParamsType, UpdateOrderBodyType } from "@/schemaValidations/order.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useOrder = () => {
    return useMutation({
        mutationFn:({id, ...body}: UpdateOrderBodyType & {id: number}) => orderApirequest.updateOrder(id, body)
    })
}

export const useGetOrderList = (queryParams: GetOrdersQueryParamsType) => {
    return useQuery({
        queryFn: () => orderApirequest.getOrderList(queryParams),
        queryKey: ['orders-list', queryParams]
    })
}


export const useGetOrderDetailQuery = ({id, enabled = true}: {id: number, enabled?: boolean}) => {
    return useQuery({
        queryFn: () => orderApirequest.getOrderDetail(id),
        queryKey: ['orders', id],
        enabled
    })

}

export const useUpdateOrder =()=>{
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ orderId, ...body }:UpdateOrderBodyType& { orderId: number }) =>
            orderApirequest.updateOrder(orderId, body),
       
    });
}