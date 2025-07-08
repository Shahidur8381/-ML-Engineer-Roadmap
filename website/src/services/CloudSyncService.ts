interface SyncConfig {
  gistId?: string;
  accessToken?: string;
  autoSync: boolean;
  syncInterval: number; // minutes
}

interface SyncResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class CloudSyncService {
  private config: SyncConfig;
  private lastSyncTime: number = 0;
  private autoSyncInterval: number | null = null;

  constructor(config: SyncConfig) {
    this.config = {
      autoSync: config.autoSync ?? false,
      syncInterval: config.syncInterval ?? 5,
      gistId: config.gistId,
      accessToken: config.accessToken
    };
  }

  // Find existing ML Roadmap Gist
  async findExistingGist(): Promise<string | null> {
    if (!this.config.accessToken) {
      return null;
    }

    try {
      const response = await fetch('https://api.github.com/gists', {
        headers: {
          'Authorization': `token ${this.config.accessToken}`,
        }
      });

      if (response.ok) {
        const gists = await response.json();
        const mlGist = gists.find((gist: any) => 
          gist.description === "ML Roadmap Progress" && 
          gist.files['ml-roadmap-progress.json']
        );
        
        if (mlGist) {
          return mlGist.id;
        }
      }
    } catch (error) {
      console.error("Error finding existing gist:", error);
    }
    
    return null;
  }

  // GitHub Gist API methods
  async createGist(data: any, description: string = "ML Roadmap Progress"): Promise<SyncResponse> {
    if (!this.config.accessToken) {
      return { success: false, message: "GitHub access token required" };
    }

    try {
      const response = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          public: false,
          files: {
            'ml-roadmap-progress.json': {
              content: JSON.stringify({
                roadmapData: data,
                lastUpdated: new Date().toISOString(),
                syncedFrom: navigator.userAgent,
                version: '1.0'
              }, null, 2)
            }
          }
        })
      });

      if (response.ok) {
        const gist = await response.json();
        this.config.gistId = gist.id;
        
        // Save the Gist ID globally so all browsers can access it
        localStorage.setItem('ml-roadmap-sync-config', JSON.stringify(this.config));
        localStorage.setItem('ml-roadmap-gist-id', gist.id);
        
        return { success: true, message: "Progress synced to cloud", data: gist };
      } else {
        const errorText = await response.text();
        console.error("Create Gist failed:", response.status, errorText);
        return { success: false, message: "Failed to create cloud backup" };
      }
    } catch (error) {
      console.error("Create Gist error:", error);
      return { success: false, message: `Sync error: ${error}` };
    }
  }

  async updateGist(data: any): Promise<SyncResponse> {
    if (!this.config.gistId || !this.config.accessToken) {
      return await this.createGist(data);
    }

    try {
      const response = await fetch(`https://api.github.com/gists/${this.config.gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            'ml-roadmap-progress.json': {
              content: JSON.stringify({
                roadmapData: data,
                lastUpdated: new Date().toISOString(),
                syncedFrom: navigator.userAgent,
                version: '1.0'
              }, null, 2)
            }
          }
        })
      });

      if (response.ok) {
        this.lastSyncTime = Date.now();
        return { success: true, message: "Progress synced successfully" };
      } else {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        return { success: false, message: `Failed to sync progress: ${response.status}` };
      }
    } catch (error) {
      console.error("Sync error:", error);
      return { success: false, message: `Sync error: ${error}` };
    }
  }

  async downloadProgress(): Promise<SyncResponse> {
    if (!this.config.gistId) {
      return { success: false, message: "No cloud backup found" };
    }

    try {
      const response = await fetch(`https://api.github.com/gists/${this.config.gistId}`);
      
      if (response.ok) {
        const gist = await response.json();
        const content = gist.files['ml-roadmap-progress.json']?.content;
        
        if (content) {
          const data = JSON.parse(content);
          
          // Handle both new and legacy data formats
          let roadmapData;
          if (data.roadmapData) {
            roadmapData = data.roadmapData;
          } else if (Array.isArray(data)) {
            roadmapData = data;
          } else {
            roadmapData = data;
          }
          
          return { success: true, message: "Progress downloaded from cloud", data: roadmapData };
        } else {
          return { success: false, message: "No progress data found in cloud" };
        }
      } else {
        return { success: false, message: "Failed to download progress" };
      }
    } catch (error) {
      console.error("Download error:", error);
      return { success: false, message: `Download error: ${error}` };
    }
  }

  // Auto-sync functionality
  startAutoSync(onSync: (result: SyncResponse) => void) {
    if (!this.config.autoSync) return;

    // Clear existing interval if any
    this.stopAutoSync();

    this.autoSyncInterval = setInterval(async () => {
      const localData = JSON.parse(localStorage.getItem('ml-roadmap') || '[]');
      if (localData.length > 0) {
        const result = await this.updateGist(localData);
        onSync(result);
      }
    }, this.config.syncInterval * 60 * 1000);
  }

  stopAutoSync() {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }
  }

  // Simple JSON hosting alternative (for users without GitHub)
  async syncToJsonBin(data: any, binId?: string): Promise<SyncResponse> {
    const API_KEY = '$2a$10$YOUR_JSONBIN_API_KEY'; // User would need to get this
    const url = binId 
      ? `https://api.jsonbin.io/v3/b/${binId}` 
      : 'https://api.jsonbin.io/v3/b';

    try {
      const response = await fetch(url, {
        method: binId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
          'X-Bin-Private': 'true'
        },
        body: JSON.stringify({
          roadmapData: data,
          lastUpdated: new Date().toISOString(),
          syncedFrom: navigator.userAgent
        })
      });

      if (response.ok) {
        const result = await response.json();
        return { 
          success: true, 
          message: "Progress synced to cloud", 
          data: { binId: result.metadata?.id || binId }
        };
      } else {
        return { success: false, message: "Failed to sync with JSONBin" };
      }
    } catch (error) {
      return { success: false, message: `JSONBin sync error: ${error}` };
    }
  }
}
