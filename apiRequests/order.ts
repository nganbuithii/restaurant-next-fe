import { GetOrderDetailResType, PayGuestOrdersBodyType, PayGuestOrdersResType } from './../schemaValidations/order.schema';
import http from '@/lib/http';
import { GetOrdersQueryParamsType, GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from '@/schemaValidations/order.schema';
import queryString from 'query-string';


const prefix = '/orders'
const orderApirequest = {
    // query string : chuyển obj sang string
    getOrderList: (queryParams: GetOrdersQueryParamsType) => http.get<GetOrdersResType>(`${prefix}?`+ queryString.stringify(
        {
            fromDate: queryParams.fromDate?.toISOString(),
            toDate: queryParams.toDate?.toISOString(),
        }
    )),
    updateOrder: (id: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`${prefix}/${id}`, body),

    getOrderDetail : (id: number) => http.get<GetOrderDetailResType>(`${prefix}/${id}`),
    pay:( body:PayGuestOrdersBodyType) => http.post<PayGuestOrdersResType>(`${prefix}/pay`, body),

}

export default orderApirequest;