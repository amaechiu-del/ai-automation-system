export const dynamic = 'force-dynamic';

export default function IntegrationsPage() {
  const integrations = [
    { id: 'stripe', name: 'Stripe', desc: 'Payment processing & subscriptions', category: 'Payments', icon: '💳', docsUrl: 'https://stripe.com/docs' },
    { id: 'paystack', name: 'Paystack', desc: 'African payment gateway', category: 'Payments', icon: '💰', docsUrl: 'https://paystack.com/docs/api' },
    { id: 'twilio', name: 'Twilio', desc: 'SMS, voice & messaging', category: 'Communication', icon: '📱', docsUrl: 'https://www.twilio.com/docs' },
    { id: 'sendgrid', name: 'SendGrid', desc: 'Email delivery service', category: 'Email', icon: '📧', docsUrl: 'https://docs.sendgrid.com' },
    { id: 'shopify', name: 'Shopify', desc: 'E-commerce automation', category: 'E-commerce', icon: '🛒', docsUrl: 'https://shopify.dev/docs/api' },
    { id: 'wordpress', name: 'WordPress', desc: 'CMS & content management', category: 'CMS', icon: '📝', docsUrl: 'https://developer.wordpress.org/rest-api' },
    { id: 'twitter', name: 'Twitter/X', desc: 'Social media automation', category: 'Social', icon: '🐦', docsUrl: 'https://developer.twitter.com/en/docs' },
    { id: 'linkedin', name: 'LinkedIn', desc: 'Professional network automation', category: 'Social', icon: '💼', docsUrl: 'https://learn.microsoft.com/en-us/linkedin' },
    { id: 'firebase', name: 'Firebase', desc: 'Database & authentication', category: 'Database', icon: '🔥', docsUrl: 'https://firebase.google.com/docs' },
    { id: 'supabase', name: 'Supabase', desc: 'Open-source Firebase alternative', category: 'Database', icon: '⚡', docsUrl: 'https://supabase.com/docs' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>Integrations</h1>
          <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>Connect third-party services to your automations</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {integrations.map(integration => (
          <div
            key={integration.id}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{integration.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.975rem', fontWeight: 600, color: '#111827' }}>{integration.name}</h3>
                  <span style={{
                    fontSize: '0.6875rem',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    padding: '0.1rem 0.5rem',
                    borderRadius: '9999px',
                  }}>
                    {integration.category}
                  </span>
                </div>
              </div>
              <span style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
              }}>
                Not connected
              </span>
            </div>
            <p style={{ margin: '0 0 1rem', fontSize: '0.8125rem', color: '#6b7280' }}>{integration.desc}</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  background: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Connect
              </button>
              <a
                href={integration.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  fontSize: '0.8125rem',
                  color: '#374151',
                  textDecoration: 'none',
                }}
              >
                Docs
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
