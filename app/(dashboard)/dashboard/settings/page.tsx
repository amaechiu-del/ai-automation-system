export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>Settings</h1>
        <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>Configure your automation system</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[
          { title: 'General', desc: 'Application name, timezone, locale', icon: '⚙️' },
          { title: 'Security', desc: 'API keys, JWT secrets, webhook signing', icon: '🔒' },
          { title: 'Notifications', desc: 'Email alerts, Slack webhooks, SMS', icon: '🔔' },
          { title: 'Rate Limits', desc: 'API throttling, queue concurrency', icon: '⚡' },
          { title: 'Multi-Tenant', desc: 'Tenant management, subdomains', icon: '🏢' },
          { title: 'Data Retention', desc: 'Log retention, task history cleanup', icon: '🗄️' },
        ].map(section => (
          <div
            key={section.title}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.975rem', fontWeight: 600, color: '#111827' }}>{section.title}</h3>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280' }}>{section.desc}</p>
              </div>
            </div>
            <span style={{ color: '#9ca3af', fontSize: '1.25rem' }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
