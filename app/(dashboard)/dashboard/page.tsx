export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002';
    const res = await fetch(`${baseUrl}/api/analytics`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      label: 'Total Automations',
      value: stats?.automations?.total ?? '—',
      sub: `${stats?.automations?.active ?? 0} active`,
      color: '#3b82f6',
    },
    {
      label: 'Tasks Executed',
      value: stats?.tasks?.total ?? '—',
      sub: `${stats?.tasks?.successRate ?? 0}% success rate`,
      color: '#10b981',
    },
    {
      label: 'Tasks Running',
      value: stats?.tasks?.running ?? '—',
      sub: `${stats?.tasks?.pending ?? 0} pending`,
      color: '#f59e0b',
    },
    {
      label: 'Webhook Events',
      value: stats?.webhooks?.total ?? '—',
      sub: `${stats?.webhooks?.processed ?? 0} processed`,
      color: '#8b5cf6',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>
          Dashboard Overview
        </h1>
        <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>
          Monitor your AI automation workflows in real-time
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {cards.map(card => (
          <div
            key={card.label}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              borderTop: `3px solid ${card.color}`,
            }}
          >
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{card.label}</p>
            <p style={{ margin: '0.5rem 0 0.25rem', fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
              {card.value}
            </p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: card.color }}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { href: '/dashboard/automations', label: '+ New Automation', color: '#3b82f6' },
            { href: '/dashboard/integrations', label: '🔌 Connect Integration', color: '#10b981' },
            { href: '/dashboard/tasks', label: '📋 View Tasks', color: '#f59e0b' },
            { href: '/dashboard/analytics', label: '📈 View Analytics', color: '#8b5cf6' },
          ].map(action => (
            <a
              key={action.href}
              href={action.href}
              style={{
                display: 'inline-block',
                padding: '0.625rem 1.25rem',
                background: action.color,
                color: '#fff',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {/* Status */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
          System Status
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { service: 'API Server', status: 'Operational', color: '#10b981' },
            { service: 'Firebase Database', status: stats ? 'Operational' : 'Checking...', color: stats ? '#10b981' : '#f59e0b' },
            { service: 'Automation Engine', status: 'Operational', color: '#10b981' },
            { service: 'Webhook Handler', status: 'Operational', color: '#10b981' },
          ].map(item => (
            <div key={item.service} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>{item.service}</span>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: item.color,
                background: `${item.color}20`,
                padding: '0.2rem 0.625rem',
                borderRadius: '9999px',
              }}>
                ● {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
