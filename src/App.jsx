import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import { PLATAFORMA } from './config/plataforma'
import { rotasModuloEstoque } from './routes'

const demoEstatico = import.meta.env.VITE_DEMO_ESTATICO === 'true'

const basename =
  !demoEstatico && PLATAFORMA.basePath && PLATAFORMA.basePath !== '/'
    ? PLATAFORMA.basePath.replace(/\/$/, '')
    : undefined

const Router = demoEstatico ? HashRouter : BrowserRouter

export default function App() {
  return (
    <Router basename={basename}>
      <Routes>
        <Route element={<AppShell />}>
          {rotasModuloEstoque.map((rota) =>
            rota.index ? (
              <Route key="index" index element={rota.element} />
            ) : (
              <Route key={rota.path} path={rota.path} element={rota.element} />
            ),
          )}
        </Route>
      </Routes>
    </Router>
  )
}
