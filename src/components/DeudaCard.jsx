import { fmt, pct, getEstado } from '../utils/format'
import { Badge, ProgressBar, Card } from './UI'
import styles from './DeudaCard.module.css'

export default function DeudaCard({ deuda, onEdit }) {
  const estado = getEstado(deuda)
  const p = pct(deuda.pagado, deuda.total)

  return (
    <Card>
      <div className={styles.head}>
        <div>
          <div className={styles.name}>{deuda.desc}</div>
          <div className={styles.sub}>{deuda.acr} · {deuda.tipo}</div>
        </div>
        <div className={styles.headRight}>
          <Badge label={estado.label} cls={estado.cls} />
          {onEdit && (
            <button className={styles.editBtn} onClick={() => onEdit(deuda)}>✏️</button>
          )}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.row}><span className={styles.lbl}>Deuda total</span><span>{fmt(deuda.total)}</span></div>
        <div className={styles.row}><span className={styles.lbl}>Pagado</span><span className={styles.green}>{fmt(deuda.pagado)}</span></div>
        <div className={styles.row}><span className={styles.lbl}>Saldo</span><span className={styles.red}>{fmt(deuda.total - deuda.pagado)}</span></div>
        {deuda.cuota > 0 && (
          <>
            <div className={styles.divider} />
            <div className={styles.row}><span className={styles.lbl}>Cuota mensual</span><span>{fmt(deuda.cuota)}</span></div>
          </>
        )}
        {deuda.tasa > 0 && (
          <div className={styles.row}><span className={styles.lbl}>Tasa mensual</span><span>{deuda.tasa}%</span></div>
        )}
        {deuda.fecha && (
          <div className={styles.row}><span className={styles.lbl}>Fecha límite</span><span>{deuda.fecha}</span></div>
        )}
        {deuda.notas && (
          <div className={styles.row}><span className={styles.lbl}>Notas</span><span className={styles.muted}>{deuda.notas}</span></div>
        )}
        <ProgressBar value={p} />
      </div>
    </Card>
  )
}
