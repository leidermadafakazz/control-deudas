import { createContext, useContext, useState, useCallback } from 'react'

const STORAGE_KEY = 'control-deudas-v1'

const INITIAL_DATA = {
  deudas: [
    { id: 1, desc: 'Préstamo personal', acr: 'Bancolombia', tipo: 'Préstamo', total: 5000000, pagado: 1000000, cuota: 350000, tasa: 1.8, fecha: '2027-01-01', notas: 'Libre inversión' },
    { id: 2, desc: 'Nequi préstamo',    acr: 'Nequi',       tipo: 'App',      total: 800000,  pagado: 200000,  cuota: 100000, tasa: 2.2, fecha: '2026-02-15', notas: 'Nómina' },
    { id: 3, desc: 'Moto',              acr: 'Financiera',  tipo: 'Vehículo', total: 8000000, pagado: 2000000, cuota: 450000, tasa: 1.5, fecha: '2027-03-01', notas: 'Honda CB' },
    { id: 4, desc: 'Préstamo familiar', acr: 'Familia',     tipo: 'Personal', total: 1500000, pagado: 500000,  cuota: 0,      tasa: 0,   fecha: '',           notas: 'Sin intereses' },
  ],
  pagos: [
    { id: 101, deudaId: 2, desc: 'Nequi préstamo',    monto: 100000, fecha: '2025-02-01', medio: 'Nequi',         comp: 'NEQ-001', obs: 'Abono 1' },
    { id: 102, deudaId: 3, desc: 'Moto',              monto: 450000, fecha: '2025-02-15', medio: 'PSE',           comp: 'FIN-034', obs: 'Cuota enero' },
    { id: 103, deudaId: 1, desc: 'Préstamo personal', monto: 350000, fecha: '2025-03-01', medio: 'Transferencia', comp: 'BC-112',  obs: 'Cuota marzo' },
  ],
  nextId: 200,
}

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) { /* ignore */ }
  return INITIAL_DATA
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(() => loadData())

  const save = useCallback((newState) => {
    setState(newState)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  }, [])

  const agregarDeuda = useCallback((deuda) => {
    save(prev => {
      const next = { ...prev, deudas: [...prev.deudas, { ...deuda, id: prev.nextId }], nextId: prev.nextId + 1 }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const editarDeuda = useCallback((id, datos) => {
    save(prev => {
      const next = { ...prev, deudas: prev.deudas.map(d => d.id === id ? { ...d, ...datos } : d) }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const eliminarDeuda = useCallback((id) => {
    save(prev => {
      const next = { ...prev, deudas: prev.deudas.filter(d => d.id !== id), pagos: prev.pagos.filter(p => p.deudaId !== id) }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const registrarPago = useCallback((pago) => {
    setState(prev => {
      const deuda = prev.deudas.find(d => d.id === pago.deudaId)
      if (!deuda) return prev
      const next = {
        ...prev,
        deudas: prev.deudas.map(d => d.id === pago.deudaId
          ? { ...d, pagado: Math.min(d.total, d.pagado + pago.monto) }
          : d
        ),
        pagos: [...prev.pagos, { ...pago, id: prev.nextId, desc: deuda.desc }],
        nextId: prev.nextId + 1,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <AppContext.Provider value={{ ...state, agregarDeuda, editarDeuda, eliminarDeuda, registrarPago }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
