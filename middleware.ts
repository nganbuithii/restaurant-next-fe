import { access } from 'fs'
import next from 'next'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePath = ['/manage']
const unAuthPath = ['/login']
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const isAuth = Boolean(accessToken);
    // console.log("Middleware Running:", { pathname, accessToken, refreshToken });

    // console.log("isAuth:", isAuth, "Path:", pathname);

    // Nếu truy cập trang cần quyền (privatePath) mà chưa đăng nhập => Chuyển hướng đến trang login
    if (privatePath.some(path => pathname.startsWith(path)) && !refreshToken) {
        const url = new URL('/login', request.url)
        url.searchParams.set('clearToken', 'true')
        return NextResponse.redirect(new URL('/login', request.url));
    }
    // nếu login rồi, nhưng accessToken hết hạn, thì chuyển hướng đến trang logout
    if (privatePath.some(path => pathname.startsWith(path)) && !accessToken && refreshToken) {
        const url = new URL('/logout', request.url)
        url.searchParams.set('refreshToken', refreshToken)
        return NextResponse.redirect(url);
    }

    // Nếu đã đăng nhập mà vào trang /login => Chuyển hướng về trang chủ
    if (unAuthPath.some(path => pathname.startsWith(path)) && accessToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    // if (privatePath.some(path => pathname.startsWith(path)) && !accessToken) {
    //     const response = NextResponse.redirect(new URL('/login', request.url));
    //     response.cookies.set('accessToken', '', { expires: new Date(0) }); // Xóa cookie
    //     return response;
    // }

    return NextResponse.next();
}


// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/((?!_next|static|favicon.ico).*)'], // Chạy middleware trên tất cả các route
};
