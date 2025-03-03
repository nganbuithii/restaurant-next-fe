import { redirect } from 'next/navigation';
import { access } from 'fs'
import next from 'next'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeToken } from './lib/utils';
import { Role } from './constant/type';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './config';

const managePath = ['/vi/manage', '/en/manage']
const guestPath = ['/vi/guest', '/en/guest']
const privatePath = [...managePath, ...guestPath]
const unAuthPath = ['/vi/login', '/en/login']
const onlyOwnerPath = ['/vi/manage/accounts', '/en/manage/accounts']


export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    console.log("VÀO MIDDLE WARE")

    const handleI18nRouting = createIntlMiddleware({
        locales: locales,
        defaultLocale
    });
    const response = handleI18nRouting(request);
    const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;
    console.log("locale: ", locale);

    // console.log(`Middleware triggered for: ${pathname}`);
    // console.log(`accessToken: ${accessToken}, refreshToken: ${refreshToken}`);


    // Nếu truy cập trang cần quyền (privatePath) mà chưa đăng nhập => Chuyển hướng đến trang login
    if (privatePath.some(path => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL(`/${locale}/login`, request.url)
        url.searchParams.set('clearToken', 'true')
        // return NextResponse.redirect(new URL('/login', request.url));
        // response.headers.set('x-default-locale', defaultLocale);
        response.headers.set('x-middleware-rewrite', url.toString());
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));

        // return NextResponse.rewrite(new URL('/login', request.url));

    }

    // 2. Đã login 
    if (refreshToken) {
        // Nếu đã đăng nhập mà vào trang /login => Chuyển hướng về trang chủ
        if (unAuthPath.some(path => pathname.startsWith(path))) {
            return NextResponse.redirect(new URL(`/${locale}/`, request.url));
            // response.headers.set('x-default-locale', defaultLocale);
            // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString());
            // return response;


        }

        // nếu login rồi, nhưng accessToken hết hạn, thì chuyển hướng đến trang logout
        if (privatePath.some(path => pathname.startsWith(path)) && !accessToken) {
            const url = new URL(`/${locale}/refresh-token`, request.url)
            url.searchParams.set('refreshToken', refreshToken)
            url.searchParams.set('redirect', pathname)
            return NextResponse.redirect(url);
            // response.headers.set('x-default-locale', defaultLocale);
            // response.headers.set('x-middleware-rewrite', url.toString());
            // return response;

        }


        // nếu sai role. nếu khách vào role của owner  --> redirect về trang chủ
        const role = decodeToken(refreshToken).role
        if ((role === Role.Guest && managePath.some(path => pathname.startsWith(path))) || (role !== Role.Guest && guestPath.some(path => pathname.startsWith(path)))) {
            return NextResponse.redirect(new URL(`/${locale}/`, request.url));
            // response.headers.set('x-default-locale', defaultLocale);
            // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString());
            // return NextResponse.rewrite(new URL('/', request.url));

        }

        // Chặn quyền của nhân viên nếu vào admin
        const isNotOwnerPath = role !== Role.Owner && onlyOwnerPath.some(path => pathname.startsWith(path));
        if (isNotOwnerPath) {
            return NextResponse.redirect(new URL(`/${locale}/`, request.url));
            
            // response.headers.set('x-default-locale', defaultLocale);
            // response.headers.set('x-middleware-rewrite', new URL('/', request.url).toString());
            // return response;


        }

return response;
    }
    return response;
}


// export const config = {
//     matcher: ['/((?!_next|static|favicon.ico).*)'], // Chạy middleware trên tất cả các route
// };
export const config = {
    // Match only internationalized pathnames
    matcher: ['/', '/(vi|en)/:path*']
};