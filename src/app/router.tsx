import { createHashRouter } from 'react-router';
import { PublicOnly, RequireAuth, RequireMode, RootRedirect } from '../features/auth/guards';
import LoginPage from '../features/auth/pages/LoginPage';
import ModeSelectPage from '../features/auth/pages/ModeSelectPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import ClientHomePage from '../features/shell/ClientHomePage';
import { ModeLayout } from '../features/shell/ModeLayout';
import TechnicianHomePage from '../features/shell/TechnicianHomePage';

/* HashRouter: no depende de que el servidor/WebView resuelva rutas profundas dentro de la APK. */
export const router = createHashRouter([
  {
    element: <ModeLayout />,
    children: [
      {
        element: <PublicOnly />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/registro', element: <RegisterPage /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          { path: '/modo', element: <ModeSelectPage /> },
          {
            element: <RequireMode mode="client" />,
            children: [{ path: '/cliente', element: <ClientHomePage /> }],
          },
          {
            element: <RequireMode mode="technician" />,
            children: [{ path: '/tecnico', element: <TechnicianHomePage /> }],
          },
        ],
      },
      { path: '*', element: <RootRedirect /> },
    ],
  },
]);
