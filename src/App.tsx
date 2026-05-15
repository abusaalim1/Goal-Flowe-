import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { DashboardPage } from './components/Dashboard/DashboardPage';
import { GoalsPage } from './components/Goals/GoalsPage';
import { GoalDetailPage } from './components/Goals/GoalDetailPage';
import { AnalyticsPage } from './components/Analytics/AnalyticsPage';
import { SettingsPage } from './components/Settings/SettingsPage';
import { EbookPage } from './components/Ebook/EbookPage';
import { useStore } from './store/useStore';

export default function App() {
  const { loadData, isLoading, settings } = useStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[var(--color-bg-soft)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
          <p className="font-display text-lg font-medium text-[var(--color-text-dark)]">Loading GoalFlow AI...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="goals/:id" element={<GoalDetailPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="ebook" element={<EbookPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
