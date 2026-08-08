import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getMuiTheme } from './theme/muiTheme';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { EventDetailModal } from './components/events/EventDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { AppRoutes } from './routes';

const MainLayout: React.FC = () => {
  const { themeMode } = useApp();
  const muiTheme = getMuiTheme(themeMode);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className={`app-container min-h-screen ${themeMode === 'dark' ? 'dark bg-dark-bg text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className={`main-wrapper transition-all duration-300 ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <Header
            sidebarCollapsed={sidebarCollapsed}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            setMobileOpen={setMobileOpen}
          />

          <main className="content-body">
            <AppRoutes isFilterOpen={isFilterOpen} />
          </main>

          <Footer />
        </div>

        {/* Reusable Modals */}
        <EventDetailModal />
        <AuthModal />
      </div>
    </ThemeProvider>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
