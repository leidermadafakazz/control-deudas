import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const { user } = useAuth()
  const [deudas,  setDeudas]  = useState([])
  const [pagos,   setPagos]   = useState([])
  const [loading, setLoading] = useState(true)

  const deudasRef = user ? collection(db, 'users', user.uid, 'deudas') : null
  const pagosRef  = user ? collection(db, 'users', user.uid, 'pagos')  : null

  useEffect(() => {
    if (!deudasRef) { setDeudas([]); setLoading(false); return }
    const q = query(deudasRef, orderBy('creadoEn', 'asc'))
    return onSnapshot(q, (snap) => {
      setDeudas(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [user])

  useEffect(() => {
    if (!pagosRef) { setPagos([]); return }
    const q = query(pagosRef, orderBy('creadoEn', 'desc'))
    return onSnapshot(q, (snap) => {
      setPagos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [user])

  const agregarDeuda = useCallback(async (datos) => {
    if (!deudasRef) return
    await addDoc(deudasRef, { ...datos, creadoEn: serverTimestamp() })
  }, [user])

  const editarDeuda = useCallback(async (id, datos) => {
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid, 'deudas', id), datos)
  }, [user])

  const eliminarDeuda = useCallback(async (id) => {
    if (!user) return
    await deleteDoc(doc(db, 'users', user.uid, 'deudas', id))
    const pagosDeLaDeuda = pagos.filter(p => p.deudaId === id)
    await Promise.all(pagosDeLaDeuda.map(p =>
      deleteDoc(doc(db, 'users', user.uid, 'pagos', p.id))
    ))
  }, [user, pagos])

  const registrarPago = useCallback(async (pago) => {
    if (!user || !deudasRef || !pagosRef) return
    const deuda = deudas.find(d => d.id === pago.deudaId)
    if (!deuda) return

    // Calcular interés y capital del pago
    const saldoActual = deuda.total - (deuda.pagado || 0)
    const tasa = (deuda.tasa || 0) / 100
    const interesMes = saldoActual * tasa
    const abonoCapital = Math.max(0, pago.monto - interesMes)

    // Solo se resta el abono a capital del saldo
    const nuevoPagado = Math.min(deuda.total, (deuda.pagado || 0) + abonoCapital)

    await updateDoc(doc(db, 'users', user.uid, 'deudas', pago.deudaId), { pagado: nuevoPagado })
    await addDoc(pagosRef, {
      ...pago,
      desc: deuda.desc,
      interesMes: Math.round(interesMes),
      abonoCapital: Math.round(abonoCapital),
      creadoEn: serverTimestamp(),
    })
  }, [user, deudas])

  return (
    <AppContext.Provider value={{ deudas, pagos, loading, agregarDeuda, editarDeuda, eliminarDeuda, registrarPago }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)