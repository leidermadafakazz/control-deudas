import { useState, useEffect } from 'react'
import { Modal, Field, Btn } from './UI'
import { fmt, today } from '../utils/format'

export default function ModalPago({ open, onClose, onSave, deudas }) {
  const [form, setForm] = useState({ deudaId: '', monto: '', fecha: today(), medio: 'Nequi', comp: '', obs: '' })

  useEffect(() => {
    if (open && deudas.length) {
      setForm(f => ({ ...f, deudaId: deudas[0].id, fecha: today(), monto: '', comp: '', obs: '' }))
    }
  }, [open, deudas])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  // Deuda seleccionada
  const deuda = deudas.find(d => d.id === form.deudaId)
  const monto = parseFloat(form.monto) || 0

  // Calcular desglose en tiempo real
  const saldoActual = deuda ? deuda.total - (deuda.pagado || 0) : 0
  const tasa = deuda ? (deuda.tasa || 0) / 100 : 0
  const interesMes = Math.round(saldoActual * tasa)
  const abonoCapital = Math.max(0, Math.round(monto - interesMes))
  const tieneInteres = tasa > 0 && monto > 0

  const handleSave = () => {
    if (!monto || !form.deudaId) return
    onSave({ ...form, monto })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Registrar pago">
      <Field label="Deuda">
        <select value={form.deudaId} onChange={set('deudaId')}>
          {deudas.map(d => <option key={d.id} value={d.id}>{d.desc}</option>)}
        </select>
      </Field>
      <Field label="Monto pagado ($)">
        <input type="number" value={form.monto} onChange={set('monto')} placeholder="0" />
      </Field>

      {/* Desglose en tiempo real */}
      {tieneInteres && monto > 0 && (
        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 500 }}>Desglose de tu pago:</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
            <span style={{ color: 'var(--red)' }}>▼ Intereses del mes</span>
            <span style={{ fontWeight: 600, color: 'var(--red)' }}>{fmt(interesMes)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'var(--green)' }}>▲ Abono a capital</span>
            <span style={{ fontWeight: 600, color: 'var(--green)' }}>{fmt(abonoCapital)}</span>
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Tu saldo se reducirá en <strong>{fmt(abonoCapital)}</strong>
          </div>
        </div>
      )}

      <Field label="Fecha">
        <input type="date" value={form.fecha} onChange={set('fecha')} />
      </Field>
      <Field label="Medio de pago">
        <select value={form.medio} onChange={set('medio')}>
          {['Nequi','PSE','Transferencia','Efectivo','Daviplata','Otro'].map(m => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </Field>
      <Field label="Comprobante # (opcional)">
        <input type="text" value={form.comp} onChange={set('comp')} placeholder="Número o referencia" />
      </Field>
      <Field label="Observaciones">
        <input type="text" value={form.obs} onChange={set('obs')} placeholder="Opcional" />
      </Field>
      <Btn onClick={handleSave}>Registrar pago</Btn>
      <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
    </Modal>
  )
}