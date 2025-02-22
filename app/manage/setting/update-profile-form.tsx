'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { UpdateMeBody, UpdateMeBodyType } from '@/schemaValidations/account.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAccountProfile, useUpdateMe } from '@/queries/useAccount'
import { useUploadmedia } from '@/queries/useMedia'
import { toast } from '@/hooks/use-toast'
import { handleErrorApi } from '@/lib/utils'

export default function UpdateProfileForm() {
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const { data } = useAccountProfile()

  const updateMutation = useUpdateMe()
  const uploadMediaMutation = useUploadmedia()

  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: '',
      avatar:  undefined
    }
  })

  useEffect(() => {
    if (data) {
      const { name, avatar } = data.payload.data || {}
      form.reset({
        name,
        avatar: avatar ?? undefined
      })
    }
  }, [data, form])
  const avatar = form.watch('avatar')
  const name = form.watch('name')
  const previewAvt = useMemo(() => {
    if (!file) return null;
    const url = URL.createObjectURL(file);
    return url;
  }, [file, avatar]);

  const reset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (data: UpdateMeBodyType) => {
    console.log("Form Submitted", data)
    if (updateMutation.isPending) return
    try {
      let body = data
      // nếu có ảnh thì upload ảnh
      if (file) {
        console.log("Uploading file...") 
        const formData = new FormData()
        formData.append('file', file)
        const result = await uploadMediaMutation.mutateAsync(formData)
        console.log("KQ",result)
        const imgUrl = result.payload.data
        body = {
          ...data,
          avatar: imgUrl
        }
      }
      console.log("Updating profile with:", body) 
      const kq = await updateMutation.mutateAsync(body)
      toast({
        description: kq.payload.message,
      })
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      })
    }
  }
  return (
    <Form {...form} >
      <form noValidate className='grid auto-rows-max items-start gap-4 md:gap-8' onReset={reset}  onSubmit={form.handleSubmit(onSubmit)}>

        <Card x-chunk='dashboard-07-chunk-0'>
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='avatar'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvt || ''} />
                        <AvatarFallback className='rounded-none'>{name}</AvatarFallback>
                      </Avatar>
                      <input type='file' accept='image/*' className='hidden' ref={avatarInputRef}
                        onChange={e => {
                          const selectedFile = e.target.files?.[0];
                          if (selectedFile) {
                            setFile(selectedFile);
                            field.onChange(URL.createObjectURL(selectedFile)); // Cập nhật giá trị avatar tạm thời
                          }
                        }}
                        
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => {
                          avatarInputRef.current?.click()
                        }}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid gap-3'>
                      <Label htmlFor='name'>Tên</Label>
                      <Input id='name' type='text' className='w-full' {...field} />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=' items-center gap-2 md:ml-auto flex'>
                <Button variant='outline' size='sm' type='reset'>
                  Hủy
                </Button>
                <Button size='sm' type='submit'>
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
