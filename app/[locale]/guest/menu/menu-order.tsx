'use client'
import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useGeDishesList } from '@/queries/useDish'
import { cn, formatCurrency, handleErrorApi } from '@/lib/utils'
import Quantity from './quantity'
import { GuestCreateOrdersBodyType } from '@/schemaValidations/guest.schema'
import { useGuestOrder } from '@/queries/useGuest'
import { useRouter } from 'next/navigation'
import { DishStatus } from '@/constant/type'
import { Badge } from '@/components/ui/badge'

export default function MenuOrder() {

    const { data } = useGeDishesList()
    const dishes = useMemo(() => data?.payload.data ?? [], [data])
    const router = useRouter()

    const [orders, setOrder] = useState<GuestCreateOrdersBodyType>([])
    const mutationOrder = useGuestOrder()
    const handleQuantityChange = (dishId: number, quantity: number) => {
        setOrder((prevOrder) => {
            if (quantity === 0) {
                return prevOrder.filter(order => order.dishId !== dishId)
            }
            const index = prevOrder.findIndex(order => order.dishId === dishId)
            if (index === -1) {
                return [...prevOrder, { dishId, quantity }]
            }

            const newOrder = [...prevOrder]
            newOrder[index].quantity = quantity
            return newOrder
        })
    }

    const totalPrice = useMemo(() => {
        return dishes.reduce((kq, dish) => {
            const order = orders.find(order => order.dishId === dish.id)
            if (!order) {
                return kq
            }
            return kq + order.quantity * dish.price
        }, 0)
    }, [orders, dishes])

    const handleOrder = async () => {
        try {
            await mutationOrder.mutateAsync(orders)
            router.push('/guest/orders')
        } catch (error) {
            handleErrorApi({ error })
        }
    }
    return (
        <div className='max-w-[400px] mx-auto space-y-4'>
            {dishes.map((dish) => (
                <div key={dish.id} className={cn('flex gap-4 relative event',{
                    'pointer-events-none': dish.status === DishStatus.Unavailable
                })}>
                    <div className='flex-shrink-0'>
                        <Badge
                            className={`absolute top-0 -left-5 text-[8px] px-2 py-1 rounded-md ${dish.status === DishStatus.Unavailable ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                }`}
                        >
                            {dish.status === DishStatus.Unavailable ? 'Hết ' : 'còn'}
                        </Badge>
                        <Image
                            src={dish.image}
                            alt={dish.name}
                            height={100}
                            width={100}
                            quality={100}
                            className='object-cover w-[80px] h-[80px] rounded-md'
                        />
                    </div>
                    <div className='space-y-1'>
                        <h3 className='text-sm'>{dish.name}</h3>
                        <p className='text-xs'>{dish.description}</p>
                        <p className='text-xs font-semibold'>{formatCurrency(dish.price)}đ</p>
                    </div>
                    <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                        <Quantity onChange={(value) => handleQuantityChange(dish.id, value)} value={orders.find(order => order.dishId === dish.id)?.quantity ?? 0} />
                    </div>
                </div>
            ))}
            <div className='sticky bottom-0'>
                <Button className='w-full justify-between' disabled={orders.length === 0} onClick={handleOrder}>
                    <span>Đặt hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)} đ</span>
                </Button>
            </div>
        </div>
    )
}
