import './globals.css'

export const metadata = {
  title: 'PitWall Analytics | F1 Pre-Race Intelligence',
  description: 'How current F1 drivers perform at every circuit on the calendar.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}