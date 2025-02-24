'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils"
import { useGetOrderList } from "@/queries/useGuest"
import Image from "next/image"
import { useMemo } from "react"


export default function OrderCard() {
    const { data } = useGetOrderList()
    const orders = data?.payload.data ?? []
    const totalPrice = useMemo(() => {
        return orders.reduce((kq, order) => {
            return kq + order.dishSnapshot.price * order.quantity
        }, 0)
    }, [orders])
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