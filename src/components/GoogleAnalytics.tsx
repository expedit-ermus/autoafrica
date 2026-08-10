'use client'

import Script from 'next/script'
import { Suspense, useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { setGAConsent } from '@/lib/gtag'

const DEFAULT_GA_ID = 'G-46T65CMVH0'

function AnalyticsPageViews() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_ID
  const isFirstRun = useRef(true)

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return
    // Première exécution : le page_view initial est déjà envoyé par le
    // script d'init (config sans send_page_view). On ne suit que les
    // navigations suivantes (routage cote client).
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
    if (typeof gtag !== 'function') return
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    gtag('config', measurementId, { page_path: url })
  }, [pathname, searchParams, measurementId])

  useEffect(() => {
    if (!measurementId) return
    setGAConsent({ analytics_storage: 'granted', ad_storage: 'denied' })
  }, [measurementId])

  return null
}

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || DEFAULT_GA_ID

  if (!measurementId) return null

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  )
}