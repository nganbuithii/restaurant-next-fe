import dishApiRequest from '@/apiRequests/dish'
import { Link } from '@/i18n/navigation';
import { generateSlugUrl } from '@/lib/utils';
import { DishListResType } from '@/schemaValidations/dish.schema'
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image'

export default async function Home() {
  const t = await getTranslations('HomePage');


  let dishList : DishListResType['data'] = []
  try{
    const res = await dishApiRequest.list()
    const {payload : {data}} = res

    dishList = data
  }catch(error){
    return <div> Try again</div>
  }
  return (
    <div className='w-full space-y-4'>
      <div className='relative'>
        <span className='absolute top-0 left-0 w-full h-full bg-black opacity-50 '></span>
        <Image
          src='/banner.png'
          width={400}
          height={200}
          quality={100}
          alt='Banner'
          className='absolute top-0 left-0 w-full h-full object-cover z-0'
        />
        <div className='z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20'>
          <h1 className='text-center text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold'> {t('title')}</h1>
          <p className='text-center text-sm sm:text-base mt-4 text-white'>Vị ngon, trọn khoảnh khắc</p>
        </div>
      </div>
      <section className='space-y-10 py-16'>
        <h2 className='text-center text-2xl font-bold'>Đa dạng các món ăn</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {dishList.map((dish, index) => (
            <Link href={`/dishes/${generateSlugUrl({
              name: dish.name,
              id: dish.id
            })}`} key={dish.id} className="block">           
              <div className='flex-shrink-0'>
                  <Image
                    src={dish.image ?? ''} alt={dish.name} width="100" height="100"
                    className='object-cover w-[150px] h-[150px] rounded-md'
                  />
                </div>
                <div className='space-y-1'>
                  <h3 className='text-xl font-semibold'>{dish.name}</h3>
                  <p className=''>{dish.description}</p>
                  <p className='font-semibold'>{dish.price}</p>
                </div>
                </Link>
            ))}
        </div>
      </section>
    </div>
  )
}
