import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DomisAuto - AI Automation Dashboard',
  description: 'Enterprise AI Automation System',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: '#111827',
        color: '#fff',
        padding: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid #374151' }}>
          <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>🤖 DomisAuto</h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>AI Automation System</p>
        </div>
        <nav style={{ padding: '1rem 0', flex: 1 }}>
          {[
            { href: '/dashboard', label: '📊 Overview' },
            { href: '/dashboard/automations', label: '⚡ Automations' },
            { href: '/dashboard/tasks', label: '📋 Tasks' },
            { href: '/dashboard/integrations', label: '🔌 Integrations' },
            { href: '/dashboard/analytics', label: '📈 Analytics' },
            { href: '/dashboard/settings', label: '⚙️ Settings' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 1.5rem',
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'background 0.15s',
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #374151', fontSize: '0.75rem', color: '#6b7280' }}>
          v1.0.0 • domislink.com
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: '240px',
        flex: 1,
        background: '#f9fafb',
        minHeight: '100vh',
        padding: '2rem',
      }}>
        {children}
      </main>
    </div>
  );
}
