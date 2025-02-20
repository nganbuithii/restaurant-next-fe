import { access } from 'fs'
import next from 'next'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const privatePath = ['/manage']
const unAuthPath = ['/login']
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    console.log(pathname)
    const isAuth =Boolean(request.cookies.get('access_token')?.value)

    // nếu bắt đầu với manage và chưa logindirect về
    // chưa login thì k cho vào private path
    if(privatePath.some(path=>pathname.startsWith(path)) && !isAuth){
        return NextResponse.redirect(new URL('/login',request.url))
    }
    // đăng nhập thành công thì k cho vào trang login
    if(unAuthPath.some(path=>pathname.startsWith(path)) && !isAuth){
        return NextResponse.redirect(new URL('/',request.url))
    }
    return NextResponse.next()

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/manage:path*','/login']
}