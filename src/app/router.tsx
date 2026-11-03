import { createHashRouter } from 'react-router';
import { PublicOnly, RequireAuth, RequireMode, RootRedirect } from '../features/auth/guards';
import LoginPage from '../features/auth/pages/LoginPage';
import ModeSelectPage from '../features/auth/pages/ModeSelectPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import { ProfileLayout } from '../features/profile/ProfileLayout';
import ProfilePage from '../features/profile/ProfilePage';
import NewRequestPage from '../features/request/NewRequestPage';
import ComingSoonPage from '../features/shell/ComingSoonPage';
import HomePage from '../features/shell/HomePage';
import { ModeLayout } from '../features/shell/ModeLayout';
import { TabsLayout } from '../features/shell/TabsLayout';
import { CLIENT_TABS, TECHNICIAN_TABS } from '../features/shell/tabs';
import ApplicationFormPage from '../features/technician-application/ApplicationFormPage';
import TechnicianGatePage from '../features/technician-application/TechnicianGatePage';
import RequestSummaryPage from '../features/request/RequestSummaryPage';
import AnalysisPage from '../features/request/AnalysisPage';
import TechnicianAssignedPage from '../features/request/TechnicianAssignedPage';
import EditRequestPage from '../features/request/EditRequestPage';
import PaymentChargePage from '../features/request/PaymentChargePage';
import PaymentMethodPage from '../features/request/PaymentMethodPage';
import PaymentDonePage from '../features/request/PaymentDonePage';
import TrackingPage from '../features/request/TrackingPage';
import ChatPage from '../features/request/ChatPage';
import ArrivalPage from '../features/request/ArrivalPage';
import ServiceStatusPage from '../features/request/ServiceStatusPage';
import DiagnosisPage from '../features/request/DiagnosisPage';
import RepairPaymentPage from '../features/request/RepairPaymentPage';
import RepairDonePage from '../features/request/RepairDonePage';
import RatePage from '../features/request/RatePage';
import RatingSentPage from '../features/request/RatingSentPage';
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
                  // Flujo de nueva solicitud: pantallas completas, sin bottom menu.
                  { path: '/cliente/solicitud/nueva', element: <NewRequestPage /> },
                  { path: '/cliente/solicitud/resumen', element: <RequestSummaryPage /> },
                  { path: '/cliente/solicitud/analisis', element: <AnalysisPage /> },
                  { path: '/cliente/solicitud/tecnico-asignado', element: <TechnicianAssignedPage /> },
                  { path: '/cliente/solicitud/editar', element: <EditRequestPage /> },
                  { path: '/cliente/solicitud/pago', element: <PaymentChargePage /> },
                  { path: '/cliente/solicitud/metodo-pago', element: <PaymentMethodPage />},
                  { path: '/cliente/solicitud/pago-confirmado', element: <PaymentDonePage /> },
                  { path: '/cliente/solicitud/seguimiento', element: <TrackingPage /> },
                  { path: '/cliente/solicitud/chat', element: <ChatPage /> },
                  { path: '/cliente/solicitud/llego', element: <ArrivalPage /> },
                  { path: '/cliente/solicitud/estado', element: <ServiceStatusPage /> },
                  { path: '/cliente/solicitud/diagnostico', element: <DiagnosisPage /> },
                  { path: '/cliente/solicitud/pago-repair', element: <RepairPaymentPage /> },
                  { path: '/cliente/solicitud/reparacion-completa', element: <RepairDonePage /> },
                  { path: '/cliente/solicitud/calificar', element: <RatePage /> },
                  { path: '/cliente/solicitud/calificacion-enviada', element: <RatingSentPage /> },
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