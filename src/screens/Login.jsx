import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const { loginGoogle, loginEmail, registerEmail } = useAuth()
  const [mode,     setMode]     = useState('login') // 'login' | 'register'
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleGoogle = async () => {
    setError(''); setLoading(true)
    try { await loginGoogle() }
    catch (e) { setError('No se pudo iniciar con Google.') }
    finally { setLoading(false) }
  }

  const handleEmail = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (mode === 'login') await loginEmail(email, password)
      else await registerEmail(email, password, name)
    } catch (err) {
      const msgs = {
        'auth/user-not-found':   'No existe una cuenta con ese correo.',
        'auth/wrong-password':   'Contraseña incorrecta.',
        'auth/email-already-in-use': 'Ese correo ya está registrado.',
        'auth/weak-password':    'La contraseña debe tener al menos 6 caracteres.',
        'auth/invalid-email':    'Correo inválido.',
        'auth/invalid-credential': 'Correo o contraseña incorrectos.',
      }
      setError(msgs[err.code] || 'Ocurrió un error. Intenta de nuevo.')
    } finally { setLoading(false) }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logo}>💰</div>
        <h1 className={styles.title}>Control de Deudas</h1>
        <p className={styles.sub}>
          {mode === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratis'}
        </p>

        {/* Google */}
        <button className={styles.googleBtn} onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuar con Google
        </button>

        <div className={styles.divider}><span>o</span></div>

        {/* Email form */}
        <form onSubmit={handleEmail}>
          {mode === 'register' && (
            <div className={styles.field}>
              <label>Nombre</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" required />
            </div>
          )}
          <div className={styles.field}>
            <label>Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
          </div>
          <div className={styles.field}>
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        <button className={styles.switchBtn} onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}>
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  )
}
