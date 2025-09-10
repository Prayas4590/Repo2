import { Outlet, useLocation } from 'react-router-dom';
import TopAppBar from './TopAppBar';
import BottomNavigation from './BottomNavigation';
import { useRole } from '@/contexts/RoleContext';

const Layout = () => {
  const { getRoleTheme } = useRole();
  const location = useLocation();

  const topPadding = 'pt-14';
  const hideGlobalBottomNav = location.pathname === '/asha';

  return (
    <div className={`min-h-screen pb-14 ${topPadding} ${getRoleTheme()}`}>
      <TopAppBar />
      <main className="container mx-auto px-4 py-4 max-w-md">
        <Outlet />
      </main>
      {!hideGlobalBottomNav && <BottomNavigation />}
    </div>
  );
};

export default Layout;
