
import React from 'react';
import { getCurrentUser } from '../services/authService';
import AdminDashboard from './Admin/AdminDashboard';
import InstitutionDashboard from './Institution/InstitutionDashboard';
import UserDashboard from './User/UserDashboard';
import ScholarDashboard from './ScholarDashboard';
import Home from './Home';

const Dashboard: React.FC = () => {
  const user = getCurrentUser();

  if (!user) return <Home />;

  switch (user.role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'INSTITUTION':
      return <InstitutionDashboard />;
    case 'SCHOLAR':
      return <ScholarDashboard />;
    case 'USER':
      return <UserDashboard />;
    default:
      return <Home />;
  }
};

export default Dashboard;
