import { EntityError } from '@/lib/http'
import { type ClassValue, clsx } from 'clsx'
import { Path, UseFormSetError } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import envConfig from '@/config'
import { format } from 'date-fns'
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'
import { io } from 'socket.io-client'
import slugify from 'slugify'
import { DishStatus, OrderStatus, Role, TableStatus } from '@/constant/type'
import { toast } from '@/hooks/use-toast'
import jwt from "jsonwebtoken"
import authApiRequest from '@/apiRequests/auth'
import { TokenPayload } from '@/types/jwt.types'
import { decode } from 'punycode'
import guestApiRequest from '@/apiRequests/guest'
import socket from './socket'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field as Path<any>, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000
    })
  }
}

const isBrowser = typeof window !== 'undefined'
export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload
}
export const getAccessTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem('accessToken') : null

export const getRefreshTokenFromLocalStorage = () =>
  isBrowser ? localStorage.getItem('refreshToken') : null
export const setAccessTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem('accessToken', value)

export const setRefreshTokenToLocalStorage = (value: string) =>
  isBrowser && localStorage.setItem('refreshToken', value)
export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem('accessToken')
  isBrowser && localStorage.removeItem('refreshToken')
}
export const checkRefreshToken = async (param?: {
  onError?: () => void,
  onSuccess?: () => void, 
  force?: boolean
}) => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  // console.log("access", accessToken)
  // console.log("refresh", refreshToken)

  if (!accessToken || !refreshToken) return

  const now = (new Date().getTime() / 1000) - 1 
  // - 1 s vì cookie set bị chậm hơn khoảng vài tẳng mili s
  const decodeAccessToken = jwt.decode(accessToken) as { exp: number, iat: number }
  const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number, iat: number }

  if (decodeRefreshToken.exp <= now) {
    removeTokensFromLocalStorage()
    param?.onError && param.onError()     
    return

  }

  if (param?.force || (decodeAccessToken.exp - now < (decodeAccessToken.exp - decodeAccessToken.iat) / 3)) {
    try {
      const role = decodeToken(refreshToken).role
      const res = role ===Role.Guest ? ( await guestApiRequest.refreshToken()) : (await authApiRequest.refreshToken())
      // console.log("res", res)
      setAccessTokenToLocalStorage(res.payload.data.accessToken)
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken)
      param?.onSuccess && param.onSuccess()
    } catch (error) {
      param?.onError && param.onError()
    }
  }
}
export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}
export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  )
}

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    'HH:mm:ss dd/MM/yyyy'
  )
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}

// export const generateSocketInstace = (accessToken: string) => {
//   return io(envConfig.NEXT_PUBLIC_RESTAURANT_API, {
//     auth: {
//       Authorization: `Bearer ${accessToken}`
//     }
//   })
// }

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins
}

export const wrapServerApi = async <T>(fn: () => Promise<T>) => {
  let result: T | null = null
  try {
    result = await fn()
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      typeof (error as { digest: string }).digest === 'string' &&
      (error as { digest: string }).digest.includes('NEXT_REDIRECT')
    ) {
      throw error
    }
  }
  return result
}

export const generateSlugUrl = ({ name, id }: { name: string; id: number }) => {
  return `${slugify(name)}-i.${id}`
}

export const getIdFromSlugUrl = (slug: string) => {
  return Number(slug.split('-i.')[1])
}


