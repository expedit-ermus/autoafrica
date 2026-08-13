import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// ─── Constants ───────────────────────────────────────────────────────────────

const ADMIN_ROLES = ['SUPER_ADMIN', 'TENANT_ADMIN', 'MODERATOR', 'SUPPORT']
const SELLER_ROLES = ['SELLER', 'SUPER_ADMIN', 'TENANT_ADMIN']

/** Routes uniquement accessibles aux Admins */
const ADMIN_PATHS = ['/dashboard/admin']

/** Routes uniquement accessibles aux Vendeurs/Admins */
const SELLER_PATHS = [
  '/dashboard/inventory',
  '/dashboard/crm',
  '/dashboard/suppliers',
  '/dashboard/purchase-orders',
  '/dashboard/containers',
  '/dashboard/customs',
  '/dashboard/delivery',
  '/dashboard/finance',
  '/dashboard/analytics',
  '/dashboard/vehicles',
  '/dashboard/marketplace',
  '/dashboard/parts-search',
]

/** Routes protégées par auth obligatoire */
const PROTECTED_PATHS = ['/dashboard']

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET missing')
  return new TextEncoder().encode(secret)
}

function isUnderPath(pathname: string, paths: string[]) {
  return paths.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only intercept dashboard routes (API is protected by auth.guard.ts)
  if (!isUnderPath(pathname, PROTECTED_PATHS)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value

  // No token → redirect to login
  if (!token) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  let payload: { userId: string; role?: string; status?: string } | null = null
  try {
    const { payload: p } = await jwtVerify(token, getSecret())
    payload = p as { userId: string; role?: string; status?: string }
  } catch {
    // Expired / invalid token
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/auth/login'
    return NextResponse.redirect(loginUrl)
  }

  const role = payload.role ?? 'BUYER'
  const status = payload.status ?? 'ACTIVE'

  // ── BANNED: refuse all access ──
  if (status === 'BANNED') {
    const blockedUrl = request.nextUrl.clone()
    blockedUrl.pathname = '/auth/blocked'
    blockedUrl.searchParams.set('reason', 'banned')
    return NextResponse.redirect(blockedUrl)
  }

  // ── SUSPENDED: refuse dashboard access (except /auth/* pages) ──
  if (status === 'SUSPENDED' && isUnderPath(pathname, PROTECTED_PATHS)) {
    const blockedUrl = request.nextUrl.clone()
    blockedUrl.pathname = '/auth/blocked'
    blockedUrl.searchParams.set('reason', 'suspended')
    return NextResponse.redirect(blockedUrl)
  }

  // ── ADMIN ZONE ──
  if (isUnderPath(pathname, ADMIN_PATHS)) {
    if (!ADMIN_ROLES.includes(role)) {
      // Non-admin trying to access /dashboard/admin → redirect to their home
      const homeUrl = request.nextUrl.clone()
      homeUrl.pathname = role === 'SELLER' ? '/dashboard/inventory' : '/dashboard/orders'
      return NextResponse.redirect(homeUrl)
    }
  }

  // ── SELLER ZONE ──
  if (isUnderPath(pathname, SELLER_PATHS)) {
    if (!SELLER_ROLES.includes(role)) {
      // Buyer trying to access seller-only pages → redirect to buyer home
      const homeUrl = request.nextUrl.clone()
      homeUrl.pathname = '/dashboard/orders'
      return NextResponse.redirect(homeUrl)
    }
    // Seller PENDING can access but frontend will show read-only banner
    // No server-side redirect needed here (handled in UI)
  }

  // Attach role and status as response headers for downstream use
  const response = NextResponse.next()
  response.headers.set('x-user-role', role)
  response.headers.set('x-user-status', status)
  response.headers.set('x-user-id', payload.userId)
  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
