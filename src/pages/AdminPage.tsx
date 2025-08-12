// src/pages/AdminPage.tsx
import React from 'react';
import LoginGate from '../components/LoginGate';
import AdminPanel from '../components/AdminPanel';

export default function AdminPage() {
  return (
    <LoginGate requireAdmin redirectTo="/admin">
      <AdminPanel />
    </LoginGate>
  );
}
