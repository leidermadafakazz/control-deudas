import { useApp } from '../context/AppContext'
import { fmt } from '../utils/format'
import { KpiCard, SectionLabel } from '../components/UI'
import DeudaCard from '../components/DeudaCard'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { deudas } = useApp()
  const total   = deudas.reduce((s, d) => s + d.total,  0)
  const pagado  = deudas.reduce((s, d) => s + d.pagado, 0)
  const saldo   = total - pagado
  const activas = deudas.filter(d => d.pagado < d.total).length

  return (
    <div>
      <SectionLabel>resumen general</SectionLabel>
      <div className={styles.kpiGrid}>
        <KpiCard label="Deuda total"      value={fmt(total)}  color="red"    />
        <KpiCard label="Ya pagado"        value={fmt(pagado)} color="green"  />
        <KpiCard label="Saldo pendiente"  value={fmt(saldo)}  color="blue"   />
        <KpiCard label="Deudas activas"   value={activas}     color="purple" />
      </div>

      <SectionLabel>mis deudas</SectionLabel>
      {deudas.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💸</div>
          No hay deudas registradas.<br />Pulsa + para agregar una.
        </div>
      ) : (
        deudas.map(d => <DeudaCard key={d.id} deuda={d} />)
      )}
    </div>
  )
}
