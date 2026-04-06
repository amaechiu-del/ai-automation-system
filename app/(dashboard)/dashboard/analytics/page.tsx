export const dynamic = 'force-dynamic';

export default function AnalyticsPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>Analytics</h1>
        <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>Performance metrics and insights</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 600, color: '#111827' }}>Analytics Dashboard</h2>
        <p style={{ margin: '0 auto 1.5rem', color: '#6b7280', fontSize: '0.875rem', maxWidth: '400px' }}>
          Real-time analytics will appear here as your automations run. Connect to the API endpoint for live data.
        </p>
        <code style={{ display: 'block', background: '#f3f4f6', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
          GET /api/analytics?tenantId=default
        </code>
      </div>
    </div>
  );
}
