'use client'

import { useAppContext } from '@/components/app-provider'
import LocaleSwitcherSelect from '@/components/LocaleSwitcherSelect'
import { AlertDialogHeader } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Role } from '@/constant/type'
import { Link } from '@/i18n/navigation'
import { handleErrorApi } from '@/lib/utils'
import { useLogOut } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import { useParams} from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const { locale } = useParams();
  const router = useRouter()
  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole(undefined)
      setIsAuth(false)
      router.push("/")
      setOpen(false)
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
            <Link href={`/${item.href}`} key={item.href} className={className}>
              {item.title}
            </Link>
          )
        }
        return null
      })}


      {role && isAuth && (
        <button onClick={() => setOpen(true)} className={className}>
          Đăng xuất
        </button>
      )}
      {role && isAuth && (
        <>
          <Dialog open={open} onOpenChange={setOpen}>

            <DialogContent>
              <AlertDialogHeader>
                <h3 className="text-lg font-semibold">Xác nhận đăng xuất</h3>
                <p>Bạn có chắc chắn muốn đăng xuất?</p>
              </AlertDialogHeader>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setOpen(false)}>No</Button>
                <Button variant="destructive" onClick={logout}>Yes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

<LocaleSwitcherSelect 
        // items={localeOptions} 
        // label="Chọn ngôn ngữ" 
      />

    </>
  )
}