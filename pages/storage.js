import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../lib/authContext'
import ProtectedRoute from '../components/ProtectedRoute'
import StorageView from '../components/StorageView'

export default function StoragePage() {
  const { user, signOut } = useAuth()

  return (
    <ProtectedRoute>
      <Head>
        <title>Pokemon Storage - Pokemon Selector</title>
        <meta name="description" content="Your Pokemon Storage" />
      </Head>

      <main className="storage-page-container">
        <header className="storage-page-header">
          <h1>Pokemon Storage</h1>
          <nav className="storage-nav">
            <Link href="/dashboard" className="nav-link">
              Back to Dashboard
            </Link>
          </nav>
        </header>

        <section className="storage-content">
          <StorageView />
        </section>
      </main>
    </ProtectedRoute>
  )
}
