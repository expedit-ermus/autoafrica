import { NextResponse } from 'next/server'
import { metaAdsService } from '@/modules/marketing/meta-ads.service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'xml'

  if (format === 'json') {
    const feed = await metaAdsService.generateMetaCatalogFeed()
    return NextResponse.json({
      title: 'AutoAfrique Automotive Meta Commerce Catalog Feed',
      itemCount: feed.length,
      items: feed,
    })
  }

  const xmlContent = await metaAdsService.generateMetaCatalogFeedXML()

  return new NextResponse(xmlContent, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
