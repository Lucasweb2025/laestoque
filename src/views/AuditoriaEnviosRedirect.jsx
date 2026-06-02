import { Navigate, useLocation } from 'react-router-dom'

/** Mantém links antigos /auditoria/envios */
export default function AuditoriaEnviosRedirect() {
  const location = useLocation()
  return <Navigate to={`/auditoria?tipo=envio${location.hash}`} replace />
}
