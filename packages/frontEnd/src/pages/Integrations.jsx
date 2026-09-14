import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

// Integrations are now part of the consolidated AdminDashboard portal.
export default function Integrations() {
  const { navigate } = useApp();
  useEffect(() => { navigate('admin-dashboard'); }, []);
  return null;
}