'use client';

import { Locale, locales } from '@/config';
import { Check, Languages } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from 'next-intl';
import { setUserLocale } from '@/service/locale';

type Props = {
    defaultValue: string;
    items: Array<{ value: string; label: string }>;
    label: string;
};

export default function LocaleSwitcherSelect() {
    const t = useTranslations('switch_language')


    const locale = useLocale();

    return (
        <div className="relative">
            <Select  value={locale} onValueChange={value => {
                setUserLocale(value as Locale)

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