import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider, useApp } from './context/AppContext'
import { fechaLarga } from './utils/format'
import Login       from './screens/Login'
import Dashboard   from './screens/Dashboard'
import Deudas      from './screens/Deudas'
import Pagos       from './screens/Pagos'
import Calculadora from './screens/Calculadora'
import ModalDeuda  from './components/ModalDeuda'
import ModalPago   from './components/ModalPago'
import styles from './App.module.css'

const TABS = [
  { id: 'dashboard',   label: 'Inicio',      icon: '🏠' },
  { id: 'deudas',      label: 'Deudas',      icon: '📋' },
  { id: 'pagos',       label: 'Pagos',       icon: '📅' },
  { id: 'calculadora', label: 'Calculadora', icon: '🧮' },
]

function AppInner() {
  const { user, loading: authLoading, logout } = useAuth()
  const { deudas, loading: dataLoading, agregarDeuda, registrarPago } = useApp()
  const [tab,        setTab]        = useState('dashboard')
  const [modalDeuda, setModalDeuda] = useState(false)
  const [modalPago,  setModalPago]  = useState(false)

  if (authLoading) return <div className={styles.splash}>💰</div>
  if (!user)       return <Login />

  const screen = {
    dashboard:   <Dashboard />,
    deudas:      <Deudas />,
    pagos:       <Pagos />,
    calculadora: <Calculadora />,
  }

  const fabLabel = tab === 'pagos' ? '$' : tab === 'calculadora' ? null : '+'
  const openFab  = () => tab === 'pagos' ? setModalPago(true) : setModalDeuda(true)

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.title}>💰 Control de Deudas</h1>
          <div className={styles.date}>{fechaLarga()}</div>
        </div>
        <button className={styles.logoutBtn} onClick={logout} title="Cerrar sesión">
          <span className={styles.avatar}>
            {user.photoURL
              ? <img src={user.photoURL} alt="" className={styles.avatarImg} />
              : (user.displayName || user.email || '?')[0].toUpperCase()
            }
          </span>
        </button>
      </header>

      <main className={styles.main} key={tab}>
        {dataLoading ? <div className={styles.loading}>Cargando...</div> : screen[tab]}
      </main>

      <nav className={styles.nav}>
        {TABS.map(t => (
          <button
            key={t.id}
            className={`${styles.navBtn} ${tab === t.id ? styles.active : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className={styles.navIcon}>{t.icon}</span>
            <span className={styles.navLabel}>{t.label}</span>
          </button>
        ))}
      </nav>

      {fabLabel && (
        <button className={styles.fab} onClick={openFab}>{fabLabel}</button>
      )}

      <ModalDeuda
        open={modalDeuda}
        onClose={() => setModalDeuda(false)}
        onSave={agregarDeuda}
        deuda={null}
      />
      <ModalPago
        open={modalPago}
        onClose={() => setModalPago(false)}
        onSave={registrarPago}
        deudas={deudas}
      />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </AuthProvider>
  )
}
