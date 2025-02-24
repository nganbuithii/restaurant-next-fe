import orderApirequest from "@/apiRequests/order"
import { UpdateOrderBodyType } from "@/schemaValidations/order.schema"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useOrder = () => {
    return useMutation({
        mutationFn:({id, ...body}: UpdateOrderBodyType & {id: number}) => orderApirequest.updateOrder(id, body)
    })
}

export const useGetOrderList = () => {
    return useQuery({
        queryFn: orderApirequest.getOrderList,
        queryKey: ['orders-list']
    })
}