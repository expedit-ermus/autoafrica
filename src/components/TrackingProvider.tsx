'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { track, trackPageView } from '@/lib/tracking'

const SCROLL_DEPTHS = [25, 50, 75, 100]

export default function TrackingProvider() {
  const pathname = usePathname()
  const pageStart = useRef<number | null>(null)
  const firedAt = useRef<Set<number>>(new Set())
  const activePath = useRef<string>(pathname)

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const ratio = Math.round((window.scrollY / docHeight) * 100)
      for (const depth of SCROLL_DEPTHS) {
        if (ratio >= depth && !firedAt.current.has(depth)) {
          firedAt.current.add(depth)
          track('scroll_depth', { page: pathname, depth: String(depth) })
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  useEffect(() => {
    const previous = activePath.current
    const nowMs = Date.now()
    if (pageStart.current == null) pageStart.current = nowMs
    if (previous !== pathname) {
      const duration = Math.round((nowMs - pageStart.current) / 1000)
      if (duration >= 1) track('time_on_page', { page: previous, duration })
      activePath.current = pathname
      pageStart.current = nowMs
      firedAt.current = new Set()
    }
    const timer = setTimeout(() => trackPageView(), 0)
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    return () => {
      if (pageStart.current == null) return
      const duration = Math.round((Date.now() - pageStart.current) / 1000)
      if (duration >= 1) track('time_on_page', { page: activePath.current, duration })
    }
  }, [])

  return null
}