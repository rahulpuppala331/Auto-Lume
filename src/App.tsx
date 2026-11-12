import React, { useState, useEffect } from 'react';
import { Sidebar, AppPage } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { DetectPlatePage } from './pages/DetectPlatePage';
import { LiveDetectionPage } from './pages/LiveDetectionPage';
import { HistoryPage } from './pages/HistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { DeploymentModuleWrapper } from './components/DeploymentModuleWrapper';
import { DetectionDetailModal } from './components/DetectionDetailModal';
import {
  AnalyticsData,
  DashboardStats,
  DetectionRecord,
  SystemSettings,
  VehicleRecord,
} from './types';
import { sound } from './utils/soundEffects';

const INITIAL_SETTINGS: SystemSettings = {
  demoMode: false,
  confidenceThreshold: 75,
  highConfidenceThreshold: 90,
  reviewConfidenceThreshold: 70,
  maxUploadSizeBytes: 25 * 1024 * 1024,
  flaskApiUrl: 'http://localhost:5000',
  mongoDbConnected: true,
  yoloModelStatus: 'available',
  tesseractStatus: 'available',
  backendStatus: 'connected',
  theme: 'dark',
};

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>('dashboard');

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [detections, setDetections] = useState<DetectionRecord[]>([]);
  const [selectedRecordForModal, setSelectedRecordForModal] = useState<DetectionRecord | null>(null);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalDetections: 1248,
    platesDetected: 1167,
    todayDetections: 126,
    detectionSuccessRate: 94.8,
    averageConfidence: 94.2,
    imageCount: 820,
    videoCount: 310,
    cameraCount: 118,
    dailyTrends: [
      { day: 'Mon', count: 120, date: '2026-10-26' },
      { day: 'Tue', count: 145, date: '2026-10-27' },
      { day: 'Wed', count: 98, date: '2026-10-28' },
      { day: 'Thu', count: 176, date: '2026-10-29' },
      { day: 'Fri', count: 210, date: '2026-10-30' },
      { day: 'Sat', count: 185, date: '2026-10-31' },
      { day: 'Sun', count: 126, date: '2026-11-01' },
    ],
    confidenceBuckets: { high: 980, review: 192, low: 76 },
    topPlates: [
      { plateNumber: 'TS09AB1234', count: 14, lastSeen: '10:32 PM', status: 'detected' },
      { plateNumber: 'DL01CA4021', count: 9, lastSeen: '10:25 PM', status: 'detected' },
      { plateNumber: 'MH12PK8899', count: 7, lastSeen: '10:17 PM', status: 'detected' },
      { plateNumber: 'KA03MG7712', count: 6, lastSeen: '09:44 PM', status: 'detected' },
      { plateNumber: 'TS07CD4521', count: 3, lastSeen: '08:12 PM', status: 'review' },
    ],
  });

  // Fetch initial records and analytics from backend REST API
  useEffect(() => {
    fetchDetections();
    fetchAnalytics();
    fetchSettings();
  }, []);

  const fetchDetections = async () => {
    try {
      const res = await fetch('/api/detections');
      const data = await res.json();
      if (data.success && Array.isArray(data.detections)) {
        setDetections(data.detections);
      }
    } catch (e) {
      console.warn('Could not fetch detections from backend:', e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      if (data.success && data.analytics) {
        setAnalyticsData(data.analytics);
      }
    } catch (e) {
      console.warn('Could not fetch analytics:', e);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch (e) {
      console.warn('Could not fetch settings:', e);
    }
  };

  // Save new detection to database and sync state
  const handleSaveDetectionToDb = (newDetection: DetectionRecord) => {
    setDetections((prev) => [newDetection, ...prev.filter((d) => d.id !== newDetection.id)]);
    fetchAnalytics();
  };

  // Delete a detection record
  const handleDeleteRecord = async (id: string) => {
    try {
      await fetch(`/api/detections/${id}`, { method: 'DELETE' });
      setDetections((prev) => prev.filter((d) => d.id !== id));
      if (selectedRecordForModal?.id === id) {
        setSelectedRecordForModal(null);
      }
      fetchAnalytics();
    } catch (e) {
      console.warn('Delete error:', e);
    }
  };

  // Update settings handler
  const handleUpdateSettings = async (updates: Partial<SystemSettings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success) {
        setSettings((prev) => ({ ...prev, ...updates }));
      }
    } catch (e) {
      setSettings((prev) => ({ ...prev, ...updates }));
    }
  };

  // Derive dashboard stats from current detections
  const dashboardStats: DashboardStats = {
    totalDetections: analyticsData.totalDetections,
    platesDetected: analyticsData.platesDetected,
    detectionAccuracy: analyticsData.detectionSuccessRate,
    todayDetections: analyticsData.todayDetections,
    recentDetections: detections.slice(0, 10),
  };

  // Page title mapping
  const pageTitles: Record<AppPage, string> = {
    dashboard: 'Dashboard',
    detect: 'Detect Plate',
    live: 'Live Detection',
    history: 'Detection History',
    analytics: 'Analytics',
    settings: 'Settings',
    landing: 'AutoLume Overview',
    traffic: 'Traffic Monitoring & Speed Radar',
    parking: 'Smart Parking Gate Simulator',
    toll: 'Automated FASTag Toll Plaza',
    hotlist: 'Law Enforcement Hotlist & Sirens',
  };

  const latestDetection = detections[0];
  const currentPlate = latestDetection?.plateNumber || 'DL 7CQ 1939';
  const currentVehicle: VehicleRecord = {
    plateNumber: latestDetection?.plateNumber || 'MH12PK8899',
    normalizedPlate: (latestDetection?.plateNumber || 'MH12PK8899').replace(/[^A-Z0-9]/g, ''),
    make: latestDetection?.vehicleMetadata?.make || 'Hyundai',
    model: latestDetection?.vehicleMetadata?.model || 'i20',
    vehicleClass: latestDetection?.vehicleMetadata?.vehicleClass || 'Hatchback',
    color: latestDetection?.vehicleMetadata?.color || 'Fiery Red',
    stateName: latestDetection?.vehicleMetadata?.stateName || 'Maharashtra',
    isStolen: latestDetection?.vehicleMetadata?.isStolen ?? true,
    isWanted: false,
    alertReason:
      latestDetection?.vehicleMetadata?.alertReason ||
      'Reported Stolen at Deccan Gymkhana Police Station (FIR #419/2026)',
  };

  const isDeploymentModulePage =
    activePage === 'traffic' ||
    activePage === 'parking' ||
    activePage === 'toll' ||
    activePage === 'hotlist';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpenMobile={mobileMenuOpen}
        setIsOpenMobile={setMobileMenuOpen}
        demoMode={settings.demoMode}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Navbar
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          currentPageTitle={pageTitles[activePage]}
          demoMode={settings.demoMode}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'landing' && (
            <LandingPage
              onStartDetection={() => setActivePage('detect')}
              onViewDashboard={() => setActivePage('dashboard')}
            />
          )}

          {activePage === 'dashboard' && (
            <DashboardPage
              stats={dashboardStats}
              onNavigatePage={(p) => setActivePage(p)}
              onViewRecordDetail={(rec) => setSelectedRecordForModal(rec)}
            />
          )}

          {activePage === 'detect' && (
            <DetectPlatePage
              onSaveDetectionToDb={handleSaveDetectionToDb}
              soundEnabled={soundEnabled}
              demoMode={settings.demoMode}
            />
          )}

          {activePage === 'live' && (
            <LiveDetectionPage
              onSaveDetectionToDb={handleSaveDetectionToDb}
              soundEnabled={soundEnabled}
            />
          )}

          {activePage === 'history' && (
            <HistoryPage
              detections={detections}
              onViewRecordDetail={(rec) => setSelectedRecordForModal(rec)}
              onDeleteRecord={handleDeleteRecord}
            />
          )}

          {activePage === 'analytics' && <AnalyticsPage analytics={analyticsData} />}

          {activePage === 'settings' && (
            <SettingsPage settings={settings} onUpdateSettings={handleUpdateSettings} />
          )}

          {isDeploymentModulePage && (
            <DeploymentModuleWrapper
              currentModule={activePage}
              onChangeModule={(m) => setActivePage(m)}
              soundEnabled={soundEnabled}
              currentPlate={currentPlate}
              currentVehicle={currentVehicle}
            />
          )}
        </main>

        {/* Global Enterprise Footer */}
        <footer className="border-t border-slate-900 bg-slate-950/90 px-6 py-4 text-xs font-mono text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-amber-400 font-['Outfit'] text-sm tracking-tight">AutoLume</span>
            <span className="text-slate-400">– Intelligent License Plate Recognition System</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-500 text-[11px]">© 2026 AutoLume Systems Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 flex-wrap justify-center">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              All Systems Operational
            </span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors">Documentation</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors">Security & Compliance</span>
            <span className="text-slate-700">•</span>
            <span className="hover:text-amber-400 cursor-pointer transition-colors">Support Desk</span>
          </div>
        </footer>
      </div>

      {/* Detection Detail Modal */}
      <DetectionDetailModal
        detection={selectedRecordForModal}
        onClose={() => setSelectedRecordForModal(null)}
        onDelete={handleDeleteRecord}
      />
    </div>
  );
}
