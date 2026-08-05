'use client'

import Script from 'next/script'
import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { setGAConsent } from '@/lib/gtag'

function AnalyticsPageViews() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return
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
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

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
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  )
}
