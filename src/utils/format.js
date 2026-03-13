export const fmt = (n) =>
  '$' + Math.round(n).toLocaleString('es-CO')

export const pct = (pagado, total) =>
  total > 0 ? Math.min(100, Math.round((pagado / total) * 100)) : 0

export const getEstado = (d) => {
  if (d.pagado >= d.total) return { label: 'Pagado',   cls: 'badge-done' }
  if (d.fecha && new Date(d.fecha) < new Date()) return { label: 'Atrasado', cls: 'badge-late' }
  return { label: 'Activo', cls: 'badge-active' }
}

export const today = () => new Date().toISOString().split('T')[0]

export const fechaLarga = () =>
  new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
