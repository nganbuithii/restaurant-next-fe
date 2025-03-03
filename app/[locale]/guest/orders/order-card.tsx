'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import socket from "@/lib/socket"
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils"
import { useGetOrderList } from "@/queries/useGuest"
import { PayGuestOrdersResType, UpdateOrderResType } from "@/schemaValidations/order.schema"
import Image from "next/image"
import { useEffect, useMemo } from "react"


export default function OrderCard() {
    const { data, refetch } = useGetOrderList()
    const orders = useMemo(() => data?.payload.data ?? [], [data])
    const totalPrice = useMemo(() => {
        return orders.reduce((kq, order) => {
            return kq + order.dishSnapshot.price * order.quantity
        }, 0)
    }, [orders])


    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            console.log("id", socket.id)

        }

        function onDisconnect() {
            console.log("disconnect")
        }
        function onUpdateOder(data: UpdateOrderResType['data']) {
            const { dishSnapshot: { name } } = data
            toast({
                description: ` Món ${name} vừa được chuyển sang trạng thái ${getVietnameseOrderStatus(data.status)} `
            })
            refetch()
        }
        function onPayment(data: PayGuestOrdersResType['data']) {
            const { guest } = data[0]
            toast({
                description: ` Thanh toán thành công bàn ${guest?.tableNumber} thanh toán ${data.length} đơn`,
            })
            refetch()
        }
        socket.on("update-order", onUpdateOder);
        socket.on("connect", onConnect);
        socket.on("payment", onPayment);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("update-order", onUpdateOder);
            socket.off("payment", onPayment);
        };
    }, [refetch]);
    return (
        <>
            {orders.map((order, index) => (
                <div key={order.id} className="flex items-center gap-4 p-3 border rounded-lg shadow-sm">
                    <div className="flex-shrink-0">
                        <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                            {index + 1}
                        </Badge>
                    </div>
                    <div className="flex-shrink-0">
                        <Image
                            src={order.dishSnapshot.image}
                            alt={order.dishSnapshot.name}
                            height={100}
                            width={100}
                            quality={100}
                            className='object-cover w-[80px] h-[80px] rounded-md'
                        />
                    </div>
                    <div className='space-y-1'>
                        <h3 className='text-sm'>{order.dishSnapshot.name}</h3>
                        <p className='text-xs font-semibold'>{order.dishSnapshot.price} x {order.quantity}</p>
                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        <Badge variant='outline'>{getVietnameseOrderStatus(order.status)}</Badge>
                    </div>
                </div>

            ))}
            <div className='sticky bottom-0'>
                <Button className='w-full justify-between'>
                    <span>Tổng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)} đ</span>
                </Button>
            </div>
        </>
    )
}