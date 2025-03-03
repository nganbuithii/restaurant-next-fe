'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { LoginBody, LoginBodyType } from '@/schemaValidations/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin } from '@/queries/useAuth'
import {  handleErrorApi} from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAppContext } from '@/components/app-provider'
import envConfig from '@/config'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const getOauthGoogleUrl = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
  const options = {
    redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ')
  }
  const qs = new URLSearchParams(options)
  return `${rootUrl}?${qs.toString()}`
}

const ggOauth = getOauthGoogleUrl()

export default function LoginForm() {
  const loginMuutation = useLogin()
  const { setIsAuth, setRole } = useAppContext()
  const { setSocket } = useAppContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const clearToken = searchParams.get('clearToken')
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (clearToken) {
      setIsAuth(false)
      setRole(undefined)
    }
  }, [clearToken, setIsAuth, setRole])
  const onSubmit = async (data: LoginBodyType) => {
    // khi submit thì react hook form validate form bằng zod schema ở client trc
    if (loginMuutation.isPending) return;
    try {
      const res = await loginMuutation.mutateAsync(data)
      setIsAuth(true)
      setRole(res.payload.data.account.role)
      // setSocket?.(generateSocketInstace(res.payload.data.accessToken))
      router.push('/manage/dashboard')
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }
  const t = useTranslations('login')
  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-2xl'>{t('title')}</CardTitle>
        <CardDescription>Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-2 max-w-[600px] flex-shrink-0 w-full' noValidate
            onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <Label htmlFor='email'>Email</Label>
                      <Input id='email' type='email' placeholder='m@example.com' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-2'>
                      <div className='flex items-center'>
                        <Label htmlFor='password'>Password</Label>
                      </div>
                      <Input id='password' type='password' required {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Đăng nhập
              </Button>
              <Link href={ggOauth} className='w-full'>
                <Button variant='outline' className='w-full' type='button'>
                  Đăng nhập bằng Google
                </Button>
              </Link>

            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
