import styles from './UI.module.css'

export function Badge({ label, cls }) {
  return <span className={`${styles.badge} ${styles[cls]}`}>{label}</span>
}

export function ProgressBar({ value }) {
  return (
    <div className={styles.progWrap}>
      <div className={styles.progBar}>
        <div className={styles.progFill} style={{ width: `${value}%` }} />
      </div>
      <div className={styles.progLabel}>{value}% pagado</div>
    </div>
  )
}

export function KpiCard({ label, value, color }) {
  return (
    <div className={styles.kpi}>
      <div className={styles.kpiLabel}>{label}</div>
      <div className={`${styles.kpiValue} ${styles[color]}`}>{value}</div>
    </div>
  )
}

export function SectionLabel({ children }) {
  return <div className={styles.secLabel}>{children}</div>
}

export function Card({ children, padding }) {
  return (
    <div className={styles.card} style={padding ? { padding } : undefined}>
      {children}
    </div>
  )
}

export function Btn({ children, variant = 'primary', onClick, style }) {
  return (
    <button className={`${styles.btn} ${styles['btn-' + variant]}`} onClick={onClick} style={style}>
      {children}
    </button>
  )
}

export function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {children}
    </div>
  )
}

export function Modal({ id, open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className={styles.modalBg} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHandle} />
        <div className={styles.modalTitle}>{title}</div>
        {children}
      </div>
    </div>
  )
}
