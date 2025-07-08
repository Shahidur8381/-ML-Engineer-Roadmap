import React, { useEffect, useState } from "react";
import WeekCard from "./WeekCard";
import AddWeekModal from "./AddWeekModal";
import ProgressTimeline from "./ProgressTimeline";
import MotivationalQuote from "./MotivationalQuote";
import PM from "./PM";
import RoadmapPhases from "./RoadmapPhases";
import CloudSync from "./CloudSync";
import { WeekData, FilterOptions } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Dashboard() {
  const [roadmap, setRoadmap] = useLocalStorage<WeekData[]>('ml-roadmap', []);
  const [filteredRoadmap, setFilteredRoadmap] = useState<WeekData[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    priority: "all",
    completed: null,
    searchTerm: ""
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const WEEKS_PER_PAGE = 12;

  useEffect(() => {
    const loadRoadmapData = async () => {
      try {
        console.log("Loading roadmap data...");
        
        // Check if we have data in localStorage first
        const savedData = localStorage.getItem('ml-roadmap');
        
        if (savedData) {
          // Use saved data from localStorage (preserves user changes)
          const parsedData = JSON.parse(savedData);
          console.log(`Loaded ${parsedData.length} weeks from localStorage (with user changes)`);
          setRoadmap(parsedData);
          setFilteredRoadmap(parsedData);
          setLoading(false);
        } else {
          // First time load - fetch from JSON file
          const response = await fetch("/roadmap.json");
          const data: WeekData[] = await response.json();
          console.log(`Loaded ${data.length} weeks from roadmap.json (fresh data)`);
          
          setRoadmap(data);
          setFilteredRoadmap(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading roadmap:", error);
        setLoading(false);
      }
    };

    loadRoadmapData();
  }, []); // Only run once on component mount

  useEffect(() => {
    if (roadmap.length > 0) {
      setFilteredRoadmap(roadmap);
    }
  }, [roadmap]);

  useEffect(() => {
    let filtered = roadmap;

    // Filter by category
    if (filters.category !== "all") {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    // Filter by priority
    if (filters.priority !== "all") {
      filtered = filtered.filter(item => item.priority === filters.priority);
    }

    // Filter by completion status
    if (filters.completed !== null) {
      filtered = filtered.filter(item => item.completed === filters.completed);
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.concept.toLowerCase().includes(searchLower) ||
        item.practice.toLowerCase().includes(searchLower) ||
        item.notes.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    setFilteredRoadmap(filtered);
  }, [filters, roadmap]);

  const handleUpdateWeek = (week: number, updates: Partial<WeekData>) => {
    const updatedRoadmap = roadmap.map(item =>
      item.week === week ? { ...item, ...updates } : item
    );
    setRoadmap(updatedRoadmap);
  };

  const handleAddWeek = (newWeekData: Omit<WeekData, 'week'>) => {
    const nextWeek = Math.max(...roadmap.map(w => w.week), 0) + 1;
    const newWeek: WeekData = {
      ...newWeekData,
      week: nextWeek
    };
    setRoadmap([...roadmap, newWeek]);
  };

  const handleDeleteWeek = (weekToDelete: number) => {
    if (window.confirm('Are you sure you want to delete this week?')) {
      setRoadmap(roadmap.filter(item => item.week !== weekToDelete));
    }
  };

  const handleCloudSyncDataUpdate = (newData: WeekData[]) => {
    if (newData && Array.isArray(newData) && newData.length > 0) {
      setRoadmap(newData);
      setFilteredRoadmap(newData);
    } else {
      console.error("Invalid data received from cloud sync:", newData);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(roadmap, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ml-roadmap-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedData)) {
            setRoadmap(importedData);
          }
        } catch (error) {
          alert('Error importing file. Please check the format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const stats = {
    total: roadmap.length,
    completed: roadmap.filter(item => item.completed).length,
    inProgress: roadmap.filter(item => !item.completed).length,
    totalHours: roadmap.reduce((sum, item) => sum + item.hoursExpected, 0),
    completedHours: roadmap.reduce((sum, item) => sum + item.hoursCompleted, 0),
    projects: roadmap.filter(item => item.category === 'project'),
    currentWeek: (() => {
      // Find the first incomplete week as the current week
      const incompleteWeek = roadmap.find(item => !item.completed);
      if (incompleteWeek) return incompleteWeek;
      
      // If all weeks are complete, current week is the last week
      if (roadmap.length > 0) return roadmap[roadmap.length - 1];
      
      // Fallback: try to find manually tagged current week
      return roadmap.find(item => 
        item.tags.includes('current') || item.notes.toLowerCase().includes('current')
      );
    })(),
    completionRate: roadmap.length > 0 ? Math.round((roadmap.filter(item => item.completed).length / roadmap.length) * 100) : 0
  };

  const categories = Array.from(new Set(roadmap.map(item => item.category)));
  const priorities = ["high", "medium", "low"];

  // Pagination logic
  const totalPages = Math.ceil(filteredRoadmap.length / WEEKS_PER_PAGE);
  const startIndex = (currentPage - 1) * WEEKS_PER_PAGE;
  const endIndex = startIndex + WEEKS_PER_PAGE;
  const currentWeeks = filteredRoadmap.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to dashboard content instead of top
    const dashboardElement = document.getElementById('dashboard-content');
    if (dashboardElement) {
      dashboardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback to window scroll if element not found
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  // Quick action handlers
  const handleCloudDataUpdate = (newData: WeekData[]) => {
    setRoadmap(newData);
    setFilteredRoadmap(newData);
    setCurrentPage(1);
  };

  const handleForceRefresh = async () => {
    const confirmReset = window.confirm(
      "⚠️ This will reset ALL your progress and reload fresh data from roadmap.json. Are you sure?"
    );
    
    if (!confirmReset) return;
    
    setLoading(true);
    try {
      // Clear localStorage cache to reset all progress
      localStorage.removeItem('ml-roadmap');
      
      // Fetch fresh data from JSON
      const response = await fetch("/roadmap.json?t=" + Date.now()); // Cache buster
      const data: WeekData[] = await response.json();
      
      setRoadmap(data);
      setFilteredRoadmap(data);
      setCurrentPage(1);
      setLoading(false);
    } catch (error) {
      console.error("Error force refreshing roadmap:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cloud Sync - Moved to top for production */}
      <CloudSync roadmap={roadmap} onDataUpdate={handleCloudSyncDataUpdate} />

      {/* Current Progress Highlight */}
      {stats.currentWeek && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl animate-pulse">🎯</span>
              <div>
                <h2 className="text-xl font-bold">Currently Working On</h2>
                <p className="text-blue-100">Week {stats.currentWeek.week} • {stats.currentWeek.startDate}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.currentWeek.hoursCompleted}/{stats.currentWeek.hoursExpected}h</p>
              <p className="text-blue-100 text-sm">
                {Math.round((stats.currentWeek.hoursCompleted / stats.currentWeek.hoursExpected) * 100)}% complete
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{stats.currentWeek.concept}</h3>
            <p className="text-blue-100">{stats.currentWeek.practice}</p>
            <div className="w-full bg-blue-800 rounded-full h-3 mt-3">
              <div 
                className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((stats.currentWeek.hoursCompleted / stats.currentWeek.hoursExpected) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <ProgressTimeline roadmap={roadmap} />

      {/* Roadmap Phases */}
      <RoadmapPhases roadmap={roadmap} />

      {/* Project Milestones */}
      <PM roadmap={roadmap} />

      {/* Motivational Quote */}
      <MotivationalQuote />

      {/* Stats Dashboard */}
      <div id="dashboard" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Weeks</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <div className="text-4xl opacity-80">📚</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Completed</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
              <p className="text-green-100 text-xs">
                {stats.completionRate}% of roadmap
              </p>
            </div>
            <div className="text-4xl opacity-80">✅</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Projects</p>
              <p className="text-3xl font-bold">{stats.projects.filter(p => p.completed).length}/{stats.projects.length}</p>
              <p className="text-purple-100 text-xs">
                {stats.projects.length > 0 ? Math.round((stats.projects.filter(p => p.completed).length / stats.projects.length) * 100) : 0}% completed
              </p>
            </div>
            <div className="text-4xl opacity-80">🚀</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">In Progress</p>
              <p className="text-3xl font-bold">{stats.inProgress}</p>
            </div>
            <div className="text-4xl opacity-80">⏳</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Hours Progress</p>
              <p className="text-3xl font-bold">{stats.completedHours}/{stats.totalHours}</p>
              <p className="text-indigo-100 text-xs">
                {stats.totalHours > 0 ? Math.round((stats.completedHours / stats.totalHours) * 100) : 0}% of hours
              </p>
            </div>
            <div className="text-4xl opacity-80">⏰</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Filters & Search</h2>
          <div className="flex flex-wrap items-center space-x-2">
            {/* Quick Jump to Page */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Quick Jump:</label>
              <select
                value={currentPage}
                onChange={(e) => handlePageChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <option key={page} value={page}>
                    Weeks {((page - 1) * WEEKS_PER_PAGE) + 1}-{Math.min(page * WEEKS_PER_PAGE, filteredRoadmap.length)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleForceRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              disabled={loading}
              title="Reset all progress and reload fresh data"
            >
              🔄 Reset Progress
            </button>
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              📥 Export
            </button>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm">
              📤 Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              placeholder="Search concepts, tags..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="project">🚀 Projects Only</option>
              {categories.filter(cat => cat !== 'project').map(category => (
                <option key={category} value={category}>
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Completion Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.completed === null ? "all" : filters.completed.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({
                  ...filters, 
                  completed: value === "all" ? null : value === "true"
                });
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="true">Completed</option>
              <option value="false">In Progress</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => setFilters({
                category: "all",
                priority: "all", 
                completed: null,
                searchTerm: ""
              })}
              className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredRoadmap.length)} of {filteredRoadmap.length} weeks
          {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
        </p>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Week Cards */}
      <div id="dashboard-content" className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {currentWeeks.length > 0 ? (
          currentWeeks.map((week) => (
            <WeekCard 
              key={week.week} 
              data={week} 
              onUpdate={handleUpdateWeek}
              onDelete={handleDeleteWeek}
              isCurrentWeek={stats.currentWeek?.week === week.week}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-gray-500 mb-2">No weeks found</p>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Bottom Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Add Week Modal */}
      <AddWeekModal onAddWeek={handleAddWeek} />
    </div>
  );
}
