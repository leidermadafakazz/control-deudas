import { useState, useEffect } from 'react'
import { Modal, Field, Btn } from './UI'
import { today } from '../utils/format'

const EMPTY = { desc: '', acr: '', tipo: 'Préstamo', total: '', pagado: '', cuota: '', tasa: '', fecha: '', notas: '' }

export default function ModalDeuda({ open, onClose, onSave, onDelete, deuda }) {
  const [form, setForm] = useState(EMPTY)
  const isEdit = !!deuda

  useEffect(() => {
    setForm(deuda ? { ...deuda } : EMPTY)
  }, [deuda, open])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSave = () => {
    if (!form.desc) return
    onSave({
      ...form,
      total:  parseFloat(form.total)  || 0,
      pagado: parseFloat(form.pagado) || 0,
      cuota:  parseFloat(form.cuota)  || 0,
      tasa:   parseFloat(form.tasa)   || 0,
    })
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm('¿Eliminar esta deuda?')) { onDelete(); onClose() }
  }

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Editar deuda' : 'Nueva deuda'}>
      <Field label="Descripción">
        <input type="text" value={form.desc} onChange={set('desc')} placeholder="Ej: Nequi préstamo" />
      </Field>
      <Field label="Acreedor">
        <input type="text" value={form.acr} onChange={set('acr')} placeholder="Ej: Nequi, Bancolombia..." />
      </Field>
      <Field label="Tipo">
        <select value={form.tipo} onChange={set('tipo')}>
          {['Préstamo','App','Vehículo','Tarjeta','Personal','Otro'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </Field>
      <Field label="Deuda total ($)">
        <input type="number" value={form.total} onChange={set('total')} placeholder="0" />
      </Field>
      <Field label="Ya pagado ($)">
        <input type="number" value={form.pagado} onChange={set('pagado')} placeholder="0" />
      </Field>
      <Field label="Cuota mensual ($)">
        <input type="number" value={form.cuota} onChange={set('cuota')} placeholder="0" />
      </Field>
      <Field label="Tasa de interés mensual (%)">
        <input type="number" value={form.tasa} onChange={set('tasa')} placeholder="0" step="0.1" />
      </Field>
      <Field label="Fecha límite">
        <input type="date" value={form.fecha} onChange={set('fecha')} />
      </Field>
      <Field label="Notas">
        <input type="text" value={form.notas} onChange={set('notas')} placeholder="Opcional" />
      </Field>
      <Btn onClick={handleSave}>Guardar deuda</Btn>
      <Btn variant="secondary" onClick={onClose}>Cancelar</Btn>
      {isEdit && <Btn variant="danger" onClick={handleDelete}>Eliminar deuda</Btn>}
    </Modal>
  )
}
