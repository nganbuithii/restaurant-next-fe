import { access } from 'fs'
import next from 'next'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePath = ['/manage']
const unAuthPath = ['/login']
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('access_token')?.value;
    const isAuth = Boolean(accessToken);

    console.log("isAuth:", isAuth, "Path:", pathname);

    // Nếu truy cập trang cần quyền (privatePath) mà chưa đăng nhập => Chuyển hướng đến trang login
    if (privatePath.some(path => pathname.startsWith(path)) && !isAuth) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Nếu đã đăng nhập mà vào trang /login => Chuyển hướng về trang chủ
    if (unAuthPath.some(path => pathname.startsWith(path)) && isAuth) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}


// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/manage:path*','/login']
}