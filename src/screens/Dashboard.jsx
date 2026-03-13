import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { fmt } from '../utils/format'
import { KpiCard, SectionLabel, Card } from '../components/UI'
import DeudaCard from '../components/DeudaCard'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { deudas } = useApp()
  const [ingresos, setIngresos] = useState(() => parseFloat(localStorage.getItem('ingresos') || '0'))

  const total   = deudas.reduce((s, d) => s + d.total,  0)
  const pagado  = deudas.reduce((s, d) => s + d.pagado, 0)
  const saldo   = total - pagado
  const activas = deudas.filter(d => d.pagado < d.total)

  // Cálculo mensual
  const cuotasMes    = activas.reduce((s, d) => s + (d.cuota || 0), 0)
  const pctIngresos  = ingresos > 0 ? Math.round((cuotasMes / ingresos) * 100) : null

  // Interés vs capital del mes (suma aproximada)
  const interesMes = activas.reduce((s, d) => {
    const t = (d.tasa || 0) / 100
    const salPendiente = d.total - d.pagado
    return s + salPendiente * t
  }, 0)
  const capitalMes = Math.max(0, cuotasMes - interesMes)

  const pctInteres = cuotasMes > 0 ? Math.round((interesMes / cuotasMes) * 100) : 0
  const pctCapital = 100 - pctInteres

  const handleIngresos = (e) => {
    const v = parseFloat(e.target.value) || 0
    setIngresos(v)
    localStorage.setItem('ingresos', v)
  }

  // Color del porcentaje de ingresos
  const colorPct = pctIngresos === null ? '' :
    pctIngresos <= 30 ? styles.green :
    pctIngresos <= 50 ? styles.orange : styles.red

  return (
    <div>
      <SectionLabel>resumen general</SectionLabel>
      <div className={styles.kpiGrid}>
        <KpiCard label="Deuda total"     value={fmt(total)}  color="red"    />
        <KpiCard label="Ya pagado"       value={fmt(pagado)} color="green"  />
        <KpiCard label="Saldo pendiente" value={fmt(saldo)}  color="blue"   />
        <KpiCard label="Deudas activas"  value={activas.length} color="purple" />
      </div>

      {/* PAGO MENSUAL */}
      <SectionLabel>pago mensual</SectionLabel>
      <Card padding="16px">

        {/* Total cuotas mes */}
        <div className={styles.monthRow}>
          <span className={styles.monthLbl}>Total cuotas este mes</span>
          <span className={styles.monthVal}>{fmt(cuotasMes)}</span>
        </div>

        {/* Ingresos */}
        <div className={styles.ingresosRow}>
          <label className={styles.ingresosLbl}>Tus ingresos mensuales ($)</label>
          <input
            type="number"
            className={styles.ingresosInput}
            value={ingresos || ''}
            onChange={handleIngresos}
            placeholder="Ej: 3000000"
          />
        </div>

        {/* % de ingresos */}
        {pctIngresos !== null && (
          <div className={styles.pctBox}>
            <div className={styles.pctHeader}>
              <span className={styles.monthLbl}>Destinas a deudas</span>
              <span className={`${styles.pctValue} ${colorPct}`}>{pctIngresos}% de tus ingresos</span>
            </div>
            <div className={styles.barWrap}>
              <div
                className={`${styles.barFill} ${colorPct}`}
                style={{ width: `${Math.min(100, pctIngresos)}%` }}
              />
            </div>
            <div className={styles.pctHint}>
              {pctIngresos <= 30
                ? '✅ Estás dentro de un rango saludable (menos del 30%)'
                : pctIngresos <= 50
                ? '⚠️ Estás en zona de riesgo (30–50% de tus ingresos)'
                : '🚨 Nivel crítico — más del 50% de ingresos en deudas'}
            </div>
          </div>
        )}

        {/* Interés vs Capital */}
        {cuotasMes > 0 && (
          <>
            <div className={styles.divider} />
            <div className={styles.monthLbl} style={{ marginBottom: 10 }}>De tu cuota mensual:</div>
            <div className={styles.splitRow}>
              <div className={styles.splitItem}>
                <div className={styles.splitDot} style={{ background: 'var(--red)' }} />
                <div>
                  <div className={styles.splitAmt}>{fmt(interesMes)}</div>
                  <div className={styles.splitLbl}>Intereses ({pctInteres}%)</div>
                </div>
              </div>
              <div className={styles.splitItem}>
                <div className={styles.splitDot} style={{ background: 'var(--green)' }} />
                <div>
                  <div className={styles.splitAmt}>{fmt(capitalMes)}</div>
                  <div className={styles.splitLbl}>Capital ({pctCapital}%)</div>
                </div>
              </div>
            </div>
            {/* Barra interés vs capital */}
            <div className={styles.splitBar}>
              <div className={styles.splitBarInt} style={{ width: `${pctInteres}%` }} />
              <div className={styles.splitBarCap} style={{ width: `${pctCapital}%` }} />
            </div>
            <div className={styles.splitHint}>
              De cada {fmt(cuotasMes)} que pagas, solo {fmt(capitalMes)} reducen tu deuda real.
            </div>
          </>
        )}
      </Card>

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