import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function AdminRecords() {
  const { navigate } = useApp();
  useEffect(() => { navigate('admin-dashboard'); }, []);
  return null;
}