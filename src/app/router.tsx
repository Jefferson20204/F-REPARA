import { createHashRouter } from 'react-router';
import { PublicOnly, RequireAuth, RequireMode, RootRedirect } from '../features/auth/guards';
import LoginPage from '../features/auth/pages/LoginPage';
import ModeSelectPage from '../features/auth/pages/ModeSelectPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import { ProfileLayout } from '../features/profile/ProfileLayout';
import ProfilePage from '../features/profile/ProfilePage';
import ComingSoonPage from '../features/shell/ComingSoonPage';
import HomePage from '../features/shell/HomePage';
import { ModeLayout } from '../features/shell/ModeLayout';
import { TabsLayout } from '../features/shell/TabsLayout';
import { CLIENT_TABS, TECHNICIAN_TABS } from '../features/shell/tabs';
import ApplicationFormPage from '../features/technician-application/ApplicationFormPage';
import TechnicianGatePage from '../features/technician-application/TechnicianGatePage';

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
            children: [
              {
                element: <ProfileLayout />,
                children: [
                  {
                    element: <TabsLayout tabs={CLIENT_TABS} />,
                    children: [
                      { path: '/cliente', element: <HomePage mode="client" /> },
                      { path: '/cliente/servicios', element: <ComingSoonPage title="Mis servicios" /> },
                      { path: '/cliente/asistente', element: <ComingSoonPage title="Asistente" /> },
                      { path: '/cliente/perfil', element: <ProfilePage /> },
                    ],
                  },
                  // Flujo de postulación: pantallas completas, sin bottom menu.
                  { path: '/cliente/tecnico', element: <TechnicianGatePage /> },
                  { path: '/cliente/tecnico/postular', element: <ApplicationFormPage /> },
                ],
              },
            ],
          },
          {
            element: <RequireMode mode="technician" />,
            children: [
              {
                element: <ProfileLayout />,
                children: [
                  {
                    element: <TabsLayout tabs={TECHNICIAN_TABS} />,
                    children: [
                      { path: '/tecnico', element: <HomePage mode="technician" /> },
                      { path: '/tecnico/servicios', element: <ComingSoonPage title="Mis servicios" /> },
                      { path: '/tecnico/perfil', element: <ProfilePage /> },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <RootRedirect /> },
    ],
  },
]);
