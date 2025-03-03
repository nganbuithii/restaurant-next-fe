'use client';

import { Locale, locales } from '@/config';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from 'next-intl';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

export default function LocaleSwitcherSelect(){
    return (
        <Suspense>
            <LocaleSwitcherSelectComp/>
        </Suspense>
    )
}
 function LocaleSwitcherSelectComp() {
    const t = useTranslations('switch_language')

    const pathName = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const param = useParams()
    const locale = useLocale();

    return (
        <div className="relative">
            <Select value={locale} onValueChange={value => {
                const locale = param.locale as Locale
                const newPathName = pathName.replace(`/${locale}`, `/${value}`)
                const fullUrl = `${newPathName}?${searchParams.toString()}`
                router.replace(fullUrl)

            }}>
                <SelectTrigger
                    className={cn(
                        "w-40 p-2 rounded-sm hover:bg-slate-200",
                    )}
                >
                    <SelectValue className="sr-only" placeholder={t('title')} />
                </SelectTrigger>
                <SelectContent>
                    {locales.map((locale) => (
                        <SelectItem key={locale} value={locale}>{t(locale)}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}