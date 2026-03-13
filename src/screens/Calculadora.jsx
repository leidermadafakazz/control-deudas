import { useState, useEffect } from 'react'
import { fmt } from '../utils/format'
import { SectionLabel, Card } from '../components/UI'
import styles from './Calculadora.module.css'

function calcular({ monto, tasa, cuotas, pagado, costoExtra }) {
  const m    = parseFloat(monto)      || 0
  const t    = (parseFloat(tasa) || 0) / 100
  const n    = parseInt(cuotas)       || 1
  const ya   = parseFloat(pagado)     || 0
  const extra = parseFloat(costoExtra)|| 0

  const cuota      = t === 0 ? m / n : m * (t * Math.pow(1 + t, n)) / (Math.pow(1 + t, n) - 1)
  const cuotaTotal = cuota + extra
  const totalPagar = cuotaTotal * n
  const totalExtras = extra * n
  const saldo      = m - ya
  const pagadas    = ya > 0 && cuota > 0 ? Math.floor(ya / cuota) : 0
  const restantes  = Math.max(0, n - pagadas)

  const amort = []
  let sal = m
  for (let i = 1; i <= Math.min(36, n); i++) {
    const intMes = sal * t
    const cap    = cuota - intMes
    sal = Math.max(0, sal - cap)
    amort.push({ i, salIni: sal + cap, intMes, cap, extra, cuotaTotal: cuota + extra, salFin: sal })
  }

  return { cuota, cuotaTotal, totalPagar, intereses: cuota * n - m, totalExtras, costoTotal: totalPagar, saldo, restantes, amort, tieneExtra: extra > 0 }
}

export default function Calculadora() {
  const [form, setForm] = useState({ monto: '14037000', tasa: '1.88', cuotas: '36', pagado: '0', costoExtra: '0' })
  const [res,  setRes]  = useState(null)

  useEffect(() => { setRes(calcular(form)) }, [form])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div>
      <SectionLabel>datos de entrada</SectionLabel>
      <Card padding="16px">
        <div className={styles.field}>
          <label>Monto de la deuda ($)</label>
          <input type="number" value={form.monto} onChange={set('monto')} />
        </div>
        <div className={styles.field}>
          <label>Tasa de interés mensual (%)</label>
          <input type="number" value={form.tasa} step="0.1" onChange={set('tasa')} />
        </div>
        <div className={styles.field}>
          <label>Número de cuotas (meses)</label>
          <input type="number" value={form.cuotas} onChange={set('cuotas')} />
        </div>
        <div className={styles.field}>
          <label>Ya pagado ($)</label>
          <input type="number" value={form.pagado} onChange={set('pagado')} />
        </div>
        <div className={styles.field} style={{ marginBottom: 0 }}>
          <label>Costos adicionales por cuota ($) <span className={styles.hint}>ej: seguro, aval</span></label>
          <input type="number" value={form.costoExtra} onChange={set('costoExtra')} placeholder="0" />
        </div>
      </Card>

      {res && (
        <>
          <SectionLabel>resultados</SectionLabel>

          <div className={styles.resultCard}>
            <span className={styles.resultLbl}>Cuota base (capital + interés)</span>
            <span className={styles.resultVal}>{fmt(res.cuota)}</span>
          </div>

          {res.tieneExtra && (
            <div className={styles.resultCard}>
              <span className={styles.resultLbl}>Costos adicionales por cuota</span>
              <span className={`${styles.resultVal} ${styles.orange}`}>{fmt(parseFloat(form.costoExtra))}</span>
            </div>
          )}

          <div className={`${styles.resultCard} ${res.tieneExtra ? styles.highlight : ''}`}>
            <span className={styles.resultLbl}>{res.tieneExtra ? 'Cuota total real' : 'Cuota mensual'}</span>
            <span className={styles.resultVal}>{fmt(res.cuotaTotal)}</span>
          </div>

          <div className={styles.resultCard}>
            <span className={styles.resultLbl}>Total intereses</span>
            <span className={`${styles.resultVal} ${styles.red}`}>{fmt(res.intereses)}</span>
          </div>

          {res.tieneExtra && (
            <div className={styles.resultCard}>
              <span className={styles.resultLbl}>Total costos adicionales</span>
              <span className={`${styles.resultVal} ${styles.orange}`}>{fmt(res.totalExtras)}</span>
            </div>
          )}

          <div className={`${styles.resultCard} ${styles.totalFinal}`}>
            <span className={styles.resultLbl}>Costo total del crédito</span>
            <span className={`${styles.resultVal} ${styles.red}`}>{fmt(res.costoTotal)}</span>
          </div>

          <div className={styles.resultCard}>
            <span className={styles.resultLbl}>Saldo pendiente</span>
            <span className={styles.resultVal}>{fmt(res.saldo)}</span>
          </div>
          <div className={styles.resultCard}>
            <span className={styles.resultLbl}>Cuotas restantes</span>
            <span className={styles.resultVal}>{res.restantes} meses</span>
          </div>

          <SectionLabel>tabla de amortización</SectionLabel>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Saldo inicial</th>
                  <th>Interés</th>
                  <th>Capital</th>
                  {res.tieneExtra && <th>Extras</th>}
                  <th>Cuota total</th>
                  <th>Saldo final</th>
                </tr>
              </thead>
              <tbody>
                {res.amort.map(row => (
                  <tr key={row.i}>
                    <td className={styles.tdCenter}>{row.i}</td>
                    <td>{fmt(row.salIni)}</td>
                    <td>{fmt(row.intMes)}</td>
                    <td>{fmt(row.cap)}</td>
                    {res.tieneExtra && <td className={styles.orange}>{fmt(row.extra)}</td>}
                    <td><strong>{fmt(row.cuotaTotal)}</strong></td>
                    <td>{fmt(row.salFin)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}