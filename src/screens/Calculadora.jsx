import { useState, useEffect } from 'react'
import { fmt } from '../utils/format'
import { SectionLabel, Card } from '../components/UI'
import styles from './Calculadora.module.css'

function calcular({ monto, tasa, cuotas, pagado }) {
  const m = parseFloat(monto)  || 0
  const t = (parseFloat(tasa)  || 0) / 100
  const n = parseInt(cuotas)   || 1
  const ya = parseFloat(pagado)|| 0
  const cuota = t === 0 ? m / n : m * (t * Math.pow(1 + t, n)) / (Math.pow(1 + t, n) - 1)
  const totalPagar = cuota * n
  const saldo = m - ya
  const restantes = cuota > 0 ? Math.max(0, Math.ceil(saldo / cuota)) : n

  const amort = []
  let sal = m
  for (let i = 1; i <= Math.min(24, n); i++) {
    const intMes = sal * t
    const cap    = cuota - intMes
    sal = Math.max(0, sal - cap)
    amort.push({ i, salIni: sal + cap, intMes, cap, salFin: sal })
  }

  return { cuota, totalPagar, intereses: totalPagar - m, saldo, restantes, amort }
}

export default function Calculadora() {
  const [form, setForm] = useState({ monto: '5000000', tasa: '1.8', cuotas: '24', pagado: '0' })
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
        <div className={styles.field} style={{ marginBottom: 0 }}>
          <label>Ya pagado ($)</label>
          <input type="number" value={form.pagado} onChange={set('pagado')} />
        </div>
      </Card>

      {res && (
        <>
          <SectionLabel>resultados</SectionLabel>
          {[
            { lbl: 'Cuota mensual',     val: fmt(res.cuota),      color: '' },
            { lbl: 'Total a pagar',     val: fmt(res.totalPagar), color: '' },
            { lbl: 'Total intereses',   val: fmt(res.intereses),  color: 'red' },
            { lbl: 'Saldo pendiente',   val: fmt(res.saldo),      color: '' },
            { lbl: 'Cuotas restantes',  val: `${res.restantes} meses`, color: '' },
          ].map(({ lbl, val, color }) => (
            <div key={lbl} className={styles.resultCard}>
              <span className={styles.resultLbl}>{lbl}</span>
              <span className={`${styles.resultVal} ${color ? styles[color] : ''}`}>{val}</span>
            </div>
          ))}

          <SectionLabel>tabla de amortización</SectionLabel>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Saldo inicial</th>
                  <th>Interés</th>
                  <th>Capital</th>
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
