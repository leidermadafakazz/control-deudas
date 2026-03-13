import { useApp } from '../context/AppContext'
import { fmt } from '../utils/format'
import { SectionLabel, Card } from '../components/UI'
import styles from './Pagos.module.css'

export default function Pagos() {
  const { pagos } = useApp()
  const sorted = [...pagos].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div>
      <SectionLabel>historial de pagos</SectionLabel>
      <Card>
        {sorted.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📭</div>
            Sin pagos registrados aún.<br />Pulsa $ para registrar uno.
          </div>
        ) : (
          sorted.map(p => (
            <div key={p.id} className={styles.item}>
              <div>
                <div className={styles.desc}>{p.desc}</div>
                <div className={styles.meta}>
                  {p.fecha} · {p.medio}
                  {p.comp ? ` · ${p.comp}` : ''}
                  {p.obs  ? ` · ${p.obs}`  : ''}
                </div>
              </div>
              <div className={styles.amt}>-{fmt(p.monto)}</div>
            </div>
          ))
        )}
      </Card>
    </div>
  )
}
