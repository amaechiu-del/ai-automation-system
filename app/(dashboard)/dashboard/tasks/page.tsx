export const dynamic = 'force-dynamic';

export default function TasksPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>Task Monitor</h1>
        <p style={{ margin: '0.25rem 0 0', color: '#6b7280' }}>Real-time task execution monitoring</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Pending', count: '—', color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Running', count: '—', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Completed', count: '—', color: '#10b981', bg: '#ecfdf5' },
          { label: 'Failed', count: '—', color: '#ef4444', bg: '#fef2f2' },
        ].map(item => (
          <div
            key={item.label}
            style={{
              background: item.bg,
              border: `1px solid ${item.color}30`,
              borderRadius: '0.75rem',
              padding: '1.25rem',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: item.color }}>{item.count}</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: '#374151' }}>{item.label}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
          <h2 style={{ margin: 0, fontSize: '0.975rem', fontWeight: 600, color: '#111827' }}>Recent Tasks</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
          Task history will appear here. Use{' '}
          <code style={{ background: '#f3f4f6', padding: '0.1rem 0.375rem', borderRadius: '0.25rem' }}>GET /api/tasks</code>{' '}
          to fetch tasks programmatically.
        </div>
      </div>
    </div>
  );
}
