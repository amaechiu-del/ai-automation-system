export const dynamic = 'force-dynamic';

export default function AutomationsPage() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>Automations</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>Build and manage your automation workflows</p>
        </div>
      </div>

      {/* Automation Types */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { type: 'email', label: '📧 Email Automation', desc: 'Campaigns, newsletters, transactional emails', color: '#3b82f6' },
          { type: 'social_media', label: '📱 Social Media', desc: 'Schedule posts, analytics, engagement', color: '#8b5cf6' },
          { type: 'web_scraping', label: '🌐 Web Scraping', desc: 'Data extraction, monitoring, RPA', color: '#10b981' },
          { type: 'shopify_sync', label: '🛒 Shopify Sync', desc: 'Inventory, orders, product management', color: '#f59e0b' },
          { type: 'payment_reconciliation', label: '💳 Payment Reconciliation', desc: 'Stripe & Paystack transaction matching', color: '#ef4444' },
          { type: 'wordpress_publish', label: '📝 WordPress CMS', desc: 'Bulk publishing, SEO optimization', color: '#6366f1' },
          { type: 'sms_campaign', label: '💬 SMS Campaigns', desc: 'Twilio SMS/voice automation', color: '#ec4899' },
          { type: 'data_pipeline', label: '🔄 Data Pipeline', desc: 'ETL, transformations, integrations', color: '#14b8a6' },
        ].map(item => (
          <div
            key={item.type}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              cursor: 'pointer',
              borderLeft: `4px solid ${item.color}`,
            }}
          >
            <h3 style={{ margin: 0, fontSize: '0.975rem', fontWeight: 600, color: '#111827' }}>{item.label}</h3>
            <p style={{ margin: '0.375rem 0 1rem', fontSize: '0.8125rem', color: '#6b7280' }}>{item.desc}</p>
            <a
              href={`/api/automations?type=${item.type}`}
              style={{
                fontSize: '0.8125rem',
                color: item.color,
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              View →
            </a>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
          Connect to the API to see your automations. Use{' '}
          <code style={{ background: '#f3f4f6', padding: '0.1rem 0.375rem', borderRadius: '0.25rem' }}>GET /api/automations</code>{' '}
          to fetch them.
        </p>
      </div>
    </div>
  );
}
