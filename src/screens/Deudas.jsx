import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { SectionLabel } from '../components/UI'
import DeudaCard from '../components/DeudaCard'
import ModalDeuda from '../components/ModalDeuda'
import styles from './Deudas.module.css'

export default function Deudas() {
  const { deudas, agregarDeuda, editarDeuda, eliminarDeuda } = useApp()
  const [modal, setModal] = useState(false)
  const [editando, setEditando] = useState(null)

  const handleEdit = (deuda) => { setEditando(deuda); setModal(true) }
  const handleClose = () => { setModal(false); setEditando(null) }
  const handleSave = (datos) => editando ? editarDeuda(editando.id, datos) : agregarDeuda(datos)
  const handleDelete = () => eliminarDeuda(editando.id)

  return (
    <div>
      <SectionLabel>todas mis deudas</SectionLabel>
      {deudas.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✅</div>
          No hay deudas. ¡Estás libre!<br />Pulsa + para agregar una.
        </div>
      ) : (
        deudas.map(d => <DeudaCard key={d.id} deuda={d} onEdit={handleEdit} />)
      )}
      <ModalDeuda
        open={modal}
        onClose={handleClose}
        onSave={handleSave}
        onDelete={handleDelete}
        deuda={editando}
      />
    </div>
  )
}
