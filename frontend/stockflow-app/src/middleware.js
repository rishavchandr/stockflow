import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/signup']
const DEFAULT_LOGIN = '/login'
const DEFAULT_HOME   = '/dashboard'

export function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('sf_token')?.value

  const isPublic = PUBLIC_ROUTES.includes(pathname)

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN, request.url))
  }

  if (token && isPublic) {
    return NextResponse.redirect(new URL(DEFAULT_HOME, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}