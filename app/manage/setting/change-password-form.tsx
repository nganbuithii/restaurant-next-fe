'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useForm } from 'react-hook-form'
import { ChangePasswordBody, ChangePasswordBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useChangePassword } from '@/queries/useAccount'
import { toast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'

export default function ChangePasswordForm() {
  const changePassMutation = useChangePassword()

  const form = useForm<ChangePasswordBodyType>({
    resolver: zodResolver(ChangePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })
  const onSubmit = async(data: ChangePasswordBodyType) => {
    if(changePassMutation.isPending) return
    try{
      const result = await changePassMutation.mutateAsync(data)
      toast({
        description :result.payload.message,
      })
    }catch(error){
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }
  const onReset=()=>{
    form.reset()
  }

  return (
    <Form {...form}>
      <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' onSubmit={form.handleSubmit(onSubmit)} onReset={onReset}>
        <Card className='overflow-hidden' x-chunk='dashboard-07-chunk-4'>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            {/* <CardDescription>Lipsum dolor sit amet, consectetur adipiscing elit</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='oldPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='oldPassword'>Mật khẩu cũ</Label>
                      <Input id='oldPassword' type='password' className='w-full' {...field} />
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
                    <div className='grid gap-3'>
                      <Label htmlFor='password'>Mật khẩu mới</Label>
                      <Input id='password' type='password' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='confirmPassword'>Nhập lại mật khẩu mới</Label>
                      <Input id='confirmPassword' type='password' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button type="reset" variant='outline' size='sm'>
                  Hủy
                </Button>
                <Button type="submit" size='sm'>Lưu thông tin</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
