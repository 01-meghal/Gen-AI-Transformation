import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import { theme } from './styles/theme';
import { store } from './store';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SourcesPage } from './pages/SourcesPage';
import { TransformationWizardPage } from './pages/TransformationWizardPage';
import { OutputWorkspacePage } from './pages/OutputWorkspacePage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { BrandProfilesPage } from './pages/BrandProfilesPage';
import { PromptsAdminPage } from './pages/PromptsAdminPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { UsageObservabilityPage } from './pages/UsageObservabilityPage';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [navExtra, setNavExtra] = useState<any>(null);

  const handleNavigate = (tab: string, extra?: any) => {
    setCurrentTab(tab);
    if (extra) setNavExtra(extra);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
          <Navbar />
          <Box sx={{ display: 'flex' }}>
            <Sidebar currentTab={currentTab} onSelectTab={(t) => handleNavigate(t)} />
            <Box sx={{ flexGrow: 1, minWidth: 0, minHeight: 'calc(100vh - 64px)' }}>
              {currentTab === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
              {currentTab === 'projects' && <ProjectsPage onNavigate={handleNavigate} />}
              {currentTab === 'sources' && <SourcesPage onNavigate={handleNavigate} initialSourceId={navExtra?.sourceId} />}
              {currentTab === 'wizard' && <TransformationWizardPage onNavigate={handleNavigate} initialSourceId={navExtra?.sourceId} />}
              {currentTab === 'outputs' && <OutputWorkspacePage onNavigate={handleNavigate} outputId={navExtra?.outputId || 1} />}
              {currentTab === 'reviews' && <ReviewQueuePage onNavigate={handleNavigate} />}
              {currentTab === 'brands' && <BrandProfilesPage />}
              {currentTab === 'prompts' && <PromptsAdminPage />}
              {currentTab === 'integrations' && <IntegrationsPage />}
              {currentTab === 'observability' && <UsageObservabilityPage />}
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
