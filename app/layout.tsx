export const metadata = {
  title: 'DomisAuto AI System',
  description: 'Multi-tenant AI Automation for Domislink',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#f9f9f9' }}>
        <nav style={{ padding: '1rem', background: '#000', color: '#fff' }}>
          <strong>DOMISAUTO</strong> | Global AI Network
        </nav>
        {children}
      </body>
    </html>
  )
}