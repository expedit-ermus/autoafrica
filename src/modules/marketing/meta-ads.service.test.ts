import { describe, it, expect } from 'vitest'
import { MetaAdsService } from './meta-ads.service'

describe('MetaAdsService MCP', () => {
  const service = new MetaAdsService()

  it('lists existing active campaigns', async () => {
    const campaigns = await service.listCampaigns()
    expect(campaigns.length).toBeGreaterThan(0)
    expect(campaigns[0].status).toBe('ACTIVE')
  })

  it('creates a new targeted Meta Ads campaign', async () => {
    const campaign = await service.createCampaign({
      name: 'Campagne San-Pédro Transport',
      targetCity: 'San-Pédro',
      dailyBudget: 20000,
      currency: 'XOF',
    })

    expect(campaign.id).toContain('meta_camp_')
    expect(campaign.name).toBe('Campagne San-Pédro Transport')
    expect(campaign.targetCity).toBe('San-Pédro')
    expect(campaign.dailyBudget).toBe(20000)
  })

  it('returns aggregated performance metrics summary', async () => {
    const summary = await service.getPerformanceSummary()

    expect(summary.activeCampaignsCount).toBeGreaterThan(0)
    expect(summary.totalImpressions).toBeGreaterThan(0)
    expect(summary.averageCtr).toBeGreaterThan(0)
  })

  it('rejects campaign creation with invalid budget', async () => {
    await expect(
      service.createCampaign({
        name: 'Campagne Invalide',
        targetCity: 'Abidjan',
        dailyBudget: -100,
      }),
    ).rejects.toThrow('Nom de campagne et budget journalier positif requis')
  })
})
