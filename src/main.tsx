import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import NewsPage from './pages/NewsPage';
import InnovationPage from './pages/InnovationPage';
import DoDSmallBusinessPage from './pages/DoDSmallBusinessPage';
import ConsortiumsPage from './pages/ConsortiumsPage';
import ConsultantApplication from './pages/ConsultantApplication';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import MapPage from './pages/MapPage';

// Legal Pages
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import AccessibilityPage from './pages/AccessibilityPage';
import DmcaPage from './pages/DmcaPage';

// New Engage Pages
import SubmitEventPage from './pages/SubmitEventPage';
import AddCompanyPage from './pages/AddCompanyPage';
import AddConsortiumPage from './pages/AddConsortiumPage';
import AddInnovationPage from './pages/AddInnovationPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'events',
        element: <EventsPage />,
      },
      {
        path: 'news',
        element: <NewsPage />,
      },
      {
        path: 'innovation',
        element: <InnovationPage />,
      },
      {
        path: 'dod-business',
        element: <DoDSmallBusinessPage />,
      },
      {
        path: 'consortiums',
        element: <ConsortiumsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'apply',
        element: <ConsultantApplication />,
      },
      {
        path: 'admin',
        element: <AdminPage />,
      },
      {
        path: 'map',
        element: <MapPage />,
      },
      // Legal Routes
      {
        path: 'terms',
        element: <TermsPage />,
      },
      {
        path: 'privacy',
        element: <PrivacyPage />,
      },
      {
        path: 'accessibility',
        element: <AccessibilityPage />,
      },
      {
        path: 'dmca',
        element: <DmcaPage />,
      },
      // Engage Routes
      {
        path: 'submit-event',
        element: <SubmitEventPage />,
      },
      {
        path: 'add-company',
        element: <AddCompanyPage />,
      },
      {
        path: 'add-consortium',
        element: <AddConsortiumPage />,
      },
      {
        path: 'add-innovation',
        element: <AddInnovationPage />,
      }
    ],
  },
]);

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}