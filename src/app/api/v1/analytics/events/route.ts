import { NextRequest } from 'next/server'
import { analyticsService } from '@/modules/analytics/analytics.service'
import type { TrackEventInput } from '@/modules/analytics/analytics.service'
import { optionalAuth, requireAuth } from '@/modules/auth/auth.guard'
import { successResponse, handleApiError } from '@/shared/utils/response'

function detectBrowser(ua: string | null): string | undefined {
  if (!ua) return undefined
  if (ua.includes('Edg')) return 'edge'
  if (ua.includes('Chrome')) return 'chrome'
  if (ua.includes('Firefox')) return 'firefox'
  if (ua.includes('Safari')) return 'safari'
  return 'other'
}

function detectDevice(ua: string | null): string | undefined {
  if (!ua) return undefined
  if (/Mobile|Android|iPhone/i.test(ua)) return 'mobile'
  if (/Tablet|iPad/i.test(ua)) return 'tablet'
  return 'desktop'
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const filters = {
      event: searchParams.get('event') || undefined,
      entity: searchParams.get('entity') || undefined,
      entityId: searchParams.get('entityId') || undefined,
      from: searchParams.get('from') || undefined,
      to: searchParams.get('to') || undefined,
      limit: Number(searchParams.get('limit')) || undefined,
    }
    const result = await analyticsService.listEvents(filters)
    return successResponse(result)
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await optionalAuth(request)
    let body: Partial<TrackEventInput> = {}
    try {
      body = await request.json()
    } catch {
      body = {}
    }
    const ua = request.headers.get('user-agent')

    const event = await analyticsService.trackEvent({
      event: body.event ?? '',
      userId: body.userId || auth?.userId || undefined,
      sessionId: body.sessionId,
      entity: body.entity,
      entityId: body.entityId,
      properties: body.properties,
      country: body.country,
      city: body.city,
      device: body.device || detectDevice(ua),
      browser: body.browser || detectBrowser(ua),
      ip: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || undefined,
    })

    return successResponse(event, 'Événement enregistré', 201)
  } catch (error) {
    return handleApiError(error)
  }
}
