import { getUserLocale } from '@/service/locale';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    let locale = await getUserLocale()
    if (!locale || !routing.locales.includes(locale as any)) {
        locale = routing.defaultLocale;
    }
    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});