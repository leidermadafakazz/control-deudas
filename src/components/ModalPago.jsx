import { useState, useEffect } from 'react'
import { Modal, Field, Btn } from './UI'
import { today } from '../utils/format'

export default function ModalPago({ open, onClose, onSave, deudas }) {
  const [form, setForm] = useState({ deudaId: '', monto: '', fecha: today(), medio: 'Nequi', comp: '', obs: '' })

  useEffect(() => {
    if (open && deudas.length) {
      setForm(f => ({ ...f, deudaId: deudas[0].id, fecha: today(), monto: '', comp: '', obs: '' }))
    }
  }, [open, deudas])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = () => {
    const monto = parseFloat(form.monto) || 0
    if (!monto) return
    onSave({ ...form, deudaId: parseInt(form.deudaId), monto })
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
