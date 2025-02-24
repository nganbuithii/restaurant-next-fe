'use client'

import { useAppContext } from '@/components/app-provider'
import { Role } from '@/constant/type'
import { handleErrorApi } from '@/lib/utils'
import { useLogOut } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
interface NavigationItem {
  title: string;
  href: string;
  hiddenLogin?: boolean;
  role?: RoleType[];
}

const menuItems: NavigationItem[] = [
  {
    title: 'Trang chủ',
    href: '/',
  },
  {
    title: 'menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Đơn hàng',
    href: '/guest/orders',
    role: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hiddenLogin: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Employee, Role.Owner]
  }
]

export default function NavItems({ className }: { className?: string }) {
  const { isAuth, role, setRole, setIsAuth } = useAppContext()
  const logoutMutation = useLogOut()
  const router = useRouter()
  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole(undefined)
      setIsAuth(false)
      router.push("/")
    } catch (error) {
      handleErrorApi({ error })
    }

  }

  return (
    <>
      {menuItems.map((item) => {
        // Kiểm tra xem user có quyền hiển thị menu không
        const isLogin = item.role && role && item.role.includes(role)
        const canShow = item.role === undefined && (!item.hiddenLogin || !isAuth)

        if (isLogin || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }
        return null
      })}

      
      {role && isAuth&& (
        <button onClick={logout} className={className}>
          Đăng xuất
        </button>
      )}
    </>
  )
}
