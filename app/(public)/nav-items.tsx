'use client'

import { getAccessTokenFromLocalStorage } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const menuItems = [
  {
    title: 'Món ăn',
    href: '/menu',
  },
  {
    title: 'Đơn hàng',
    href: '/orders',
    authRequired: true
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    authRequired: false // khi false chưa đăng nhập thì hiển thị 
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    authRequired: true//. True là đăng nhập r mới hiểu thị

  }
]

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState(false)
  useEffect(() => {
    const accessToken = getAccessTokenFromLocalStorage();
    setIsAuth(!!accessToken); 
  }, []);
  
  
  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth || item.authRequired === true && !isAuth)
    ) 
      return null
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    )
  })
}
