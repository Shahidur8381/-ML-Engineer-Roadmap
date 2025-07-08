import React, { useState, useEffect } from "react";
import { CloudSyncService } from "../services/CloudSyncService";
import CloudSyncGuide from "./CloudSyncGuide";
import { WeekData } from "../types";

interface Props {
  roadmap: WeekData[];
  onDataUpdate: (data: WeekData[]) => void;
}

export default function CloudSync({ roadmap, onDataUpdate }: Props) {
  const [syncService, setSyncService] = useState<CloudSyncService | null>(null);
  const [config, setConfig] = useState({
    gistId: '',
    accessToken: '',
    autoSync: false,
    syncInterval: 5
  });
  const [isConfigured, setIsConfigured] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [syncStatus, setSyncStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);
  const [devPassword, setDevPassword] = useState('');

  useEffect(() => {
    // Load saved config
    const savedConfig = localStorage.getItem('ml-roadmap-sync-config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      setIsConfigured(!!parsed.accessToken);
      setSyncService(new CloudSyncService(parsed));
    }

    // Load last sync time
    const lastSync = localStorage.getItem('ml-roadmap-last-sync');
    if (lastSync) {
      setLastSyncTime(lastSync);
    }
  }, []);

  const handleConfigSave = () => {
    const newConfig = { ...config };
    localStorage.setItem('ml-roadmap-sync-config', JSON.stringify(newConfig));
    setSyncService(new CloudSyncService(newConfig));
    setIsConfigured(!!newConfig.accessToken);
    setShowSetup(false);
    setSyncStatus('Configuration saved! Ready to sync.');
  };

  const handleUploadProgress = async () => {
    if (!syncService) return;
    
    setIsLoading(true);
    setSyncStatus('Uploading progress to cloud...');
    
    const result = await syncService.updateGist(roadmap);
    
    if (result.success) {
      const now = new Date().toISOString();
      setLastSyncTime(now);
      localStorage.setItem('ml-roadmap-last-sync', now);
      setSyncStatus('✅ Progress uploaded successfully!');
    } else {
      setSyncStatus(`❌ Upload failed: ${result.message}`);
    }
    
    setIsLoading(false);
  };

  const handleDownloadProgress = async () => {
    if (!syncService) return;
    
    setIsLoading(true);
    setSyncStatus('Downloading progress from cloud...');
    
    const result = await syncService.downloadProgress();
    
    if (result.success && result.data) {
      
      // Handle the data properly
      let dataToUpdate = result.data;
      if (result.data.roadmapData) {
        dataToUpdate = result.data.roadmapData;
      }
      
      onDataUpdate(dataToUpdate);
      const now = new Date().toISOString();
      setLastSyncTime(now);
      localStorage.setItem('ml-roadmap-last-sync', now);
      setSyncStatus('✅ Progress downloaded successfully!');
    } else {
      setSyncStatus(`❌ Download failed: ${result.message}`);
    }
    
    setIsLoading(false);
  };

  const handleSmartSync = async () => {
    if (!syncService) return;
    
    setIsLoading(true);
    setSyncStatus('🔄 Smart syncing...');
    
    try {
      // First, try to download existing data
      const downloadResult = await syncService.downloadProgress();
      
      if (downloadResult.success && downloadResult.data) {
        // Found cloud data, check if it's newer than local data
        const cloudData = downloadResult.data;
        const localData = roadmap;
        
        // Simple comparison: if cloud has different completion status, use cloud data
        const cloudCompleted = cloudData.filter((w: any) => w.completed).length;
        const localCompleted = localData.filter(w => w.completed).length;
        
        if (cloudCompleted !== localCompleted) {
          onDataUpdate(cloudData);
          const now = new Date().toISOString();
          setLastSyncTime(now);
          localStorage.setItem('ml-roadmap-last-sync', now);
          setSyncStatus(`✅ Downloaded cloud data with ${cloudCompleted} completed weeks`);
        } else {
          setSyncStatus('✅ Local and cloud data are in sync');
        }
      } else {
        // No cloud data found, upload local data
        const uploadResult = await syncService.updateGist(roadmap);
        if (uploadResult.success) {
          const now = new Date().toISOString();
          setLastSyncTime(now);
          localStorage.setItem('ml-roadmap-last-sync', now);
          setSyncStatus('✅ Uploaded local data to cloud (first time)');
        } else {
          setSyncStatus(`❌ Upload failed: ${uploadResult.message}`);
        }
      }
    } catch (error) {
      setSyncStatus(`❌ Smart sync failed: ${error}`);
    }
    
    setIsLoading(false);
  };

  const handleAutoSyncToggle = () => {
    const newConfig = { ...config, autoSync: !config.autoSync };
    setConfig(newConfig);
    localStorage.setItem('ml-roadmap-sync-config', JSON.stringify(newConfig));
    
    if (newConfig.autoSync && syncService) {
      syncService.startAutoSync((result) => {
        if (result.success) {
          const now = new Date().toISOString();
          setLastSyncTime(now);
          localStorage.setItem('ml-roadmap-last-sync', now);
          setSyncStatus('🔄 Auto-synced successfully');
        }
      });
      setSyncStatus('🔄 Auto-sync enabled');
    } else {
      if (syncService) {
        syncService.stopAutoSync();
      }
      setSyncStatus('Auto-sync disabled');
    }
  };

  const handleDevModeAccess = () => {
    if (devPassword === import.meta.env.VITE_DEV_PASSWORD) {
      const newConfig = {
        ...config,
        accessToken: import.meta.env.VITE_GITHUB_TOKEN,
        autoSync: true,
        syncInterval: 5,
        // Always use Shawon's shared Gist ID
        gistId: import.meta.env.VITE_GIST_ID
      };
      setConfig(newConfig);
      localStorage.setItem('ml-roadmap-sync-config', JSON.stringify(newConfig));
      localStorage.setItem('ml-roadmap-gist-id', import.meta.env.VITE_GIST_ID);
      const newSyncService = new CloudSyncService(newConfig);
      setSyncService(newSyncService);
      setIsConfigured(true);
      setShowDevMode(false);
      setDevPassword('');
      
      // Start auto-sync if enabled
      if (newConfig.autoSync) {
        newSyncService.startAutoSync((result) => {
          if (result.success) {
            const now = new Date().toISOString();
            setLastSyncTime(now);
            localStorage.setItem('ml-roadmap-last-sync', now);
          }
        });
      }
      
      // Automatically try to download existing progress first, then upload if none found
      setTimeout(async () => {
        setSyncStatus('� Checking for existing cloud data...');
        const downloadResult = await newSyncService.downloadProgress();
        
        if (downloadResult.success && downloadResult.data) {
          // Found existing data, use it
          onDataUpdate(downloadResult.data);
          const now = new Date().toISOString();
          setLastSyncTime(now);
          localStorage.setItem('ml-roadmap-last-sync', now);
          setSyncStatus('✅ Connected to Shawon\'s shared cloud! Data synced successfully.');
        } else {
          // No existing data, upload current progress
          setSyncStatus('📤 Uploading current progress to shared cloud storage...');
          const uploadResult = await newSyncService.updateGist(roadmap);
          if (uploadResult.success) {
            const now = new Date().toISOString();
            setLastSyncTime(now);
            localStorage.setItem('ml-roadmap-last-sync', now);
            setSyncStatus('🚀 Successfully uploaded to Shawon\'s shared cloud storage!');
          } else {
            setSyncStatus(`❌ Upload failed: ${uploadResult.message}`);
          }
        }
      }, 500);
    } else {
      setSyncStatus('❌ Invalid password');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="text-2xl mr-2">☁️</span>
          Cloud Sync
        </h3>
        <button
          onClick={() => setShowSetup(!showSetup)}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors mr-2"
        >
          ⚙️ Setup
        </button>
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
        >
          📖 Guide
        </button>
        <button
          onClick={() => setShowDevMode(!showDevMode)}
          className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
        >
          👨‍💻 I'm Shawon
        </button>
      </div>

      {showSetup && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold text-gray-700 mb-3">Cloud Sync Setup</h4>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                GitHub Personal Access Token
              </label>
              <input
                type="password"
                value={config.accessToken}
                onChange={(e) => setConfig({...config, accessToken: e.target.value})}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Create a token
                </a> with 'gist' scope to sync your progress
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Existing Gist ID (optional)
              </label>
              <input
                type="text"
                value={config.gistId}
                onChange={(e) => setConfig({...config, gistId: e.target.value})}
                placeholder="Leave empty to create new (or paste shared Gist ID)"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                To share across browsers: Copy the Gist ID from first browser and paste it here in second browser
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Auto-sync interval (minutes)
              </label>
              <input
                type="number"
                value={config.syncInterval}
                onChange={(e) => setConfig({...config, syncInterval: parseInt(e.target.value) || 5})}
                min="1"
                max="60"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleConfigSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {showDevMode && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-700 mb-3">🚀 Developer Access</h4>
          <p className="text-sm text-purple-600 mb-3">Enter password to use pre-configured developer settings</p>
          <p className="text-xs text-purple-500 mb-3">✨ Includes access to Shawon's shared cloud storage for syncing across all browsers/devices</p>
          
          <div className="flex gap-3">
            <input
              type="password"
              value={devPassword}
              onChange={(e) => setDevPassword(e.target.value)}
              placeholder="Enter password"
              className="flex-1 p-2 border border-purple-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && handleDevModeAccess()}
            />
            <button
              onClick={handleDevModeAccess}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Activate
            </button>
          </div>
        </div>
      )}

      {showGuide && (
        <div className="mb-6">
          <CloudSyncGuide />
        </div>
      )}

      {isConfigured ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {/* <button
              onClick={handleSmartSync}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 font-semibold"
            >
              <span>🔄</span>
              <span>Smart Sync</span>
            </button> */}

            <button
              onClick={handleUploadProgress}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <span>☁️⬆️</span>
              <span>Upload Progress</span>
            </button>

            <button
              onClick={handleDownloadProgress}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <span>☁️⬇️</span>
              <span>Download Progress</span>
            </button>

            <button
              onClick={handleAutoSyncToggle}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                config.autoSync 
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <span>{config.autoSync ? '🔄' : '⏸️'}</span>
              <span>{config.autoSync ? 'Auto-Sync ON' : 'Auto-Sync OFF'}</span>
            </button>

            {/* <button
              onClick={() => {
                console.log("Current roadmap data:", roadmap);
                console.log("LocalStorage data:", JSON.parse(localStorage.getItem('ml-roadmap') || '[]'));
                console.log("Config:", config);
                console.log("Current Gist ID:", localStorage.getItem('ml-roadmap-gist-id'));
                console.log("Sync Config:", JSON.parse(localStorage.getItem('ml-roadmap-sync-config') || '{}'));
                alert("Check console for debug info");
              }}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              🐛 Debug
            </button> */}
          </div>

          {lastSyncTime && (
            <div className="text-sm text-gray-600">
              Last sync: {new Date(lastSyncTime).toLocaleString()}
            </div>
          )}

          {config.gistId && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <strong>Shared Gist ID:</strong> <code className="bg-gray-200 px-1 rounded">{config.gistId}</code>
              <br />
              <span className="text-xs">Copy this ID to sync across browsers</span>
            </div>
          )}

          {syncStatus && (
            <div className={`text-sm p-3 rounded-lg ${
              syncStatus.includes('✅') ? 'bg-green-50 text-green-700' :
              syncStatus.includes('❌') ? 'bg-red-50 text-red-700' :
              'bg-blue-50 text-blue-700'
            }`}>
              {syncStatus}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-4xl mb-2">🔐</div>
          <p className="text-gray-600 mb-4">Configure cloud sync to access your progress from any browser</p>
          <button
            onClick={() => setShowSetup(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Setup Cloud Sync
          </button>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 How it works:</span> Your progress is securely stored in a private GitHub Gist. 
          Access it from any browser by entering your token.
        </p>
      </div>
    </div>
  );
}
