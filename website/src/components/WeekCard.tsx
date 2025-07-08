import React, { useState } from "react";
import { WeekData } from "../types";

interface Props {
  data: WeekData;
  onUpdate: (week: number, updates: Partial<WeekData>) => void;
  onDelete?: (week: number) => void;
  isCurrentWeek?: boolean;
}

export default function WeekCard({ data, onUpdate, onDelete, isCurrentWeek = false }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(data.notes);
  const [editedHours, setEditedHours] = useState(data.hoursCompleted);

  const progressPercentage = (data.hoursCompleted / data.hoursExpected) * 100;
  const isProject = data.category === 'project';

  const priorityColors = {
    high: "border-red-500 bg-red-50",
    medium: "border-yellow-500 bg-yellow-50", 
    low: "border-green-500 bg-green-50"
  };

  // Special styling for current week and projects
  let cardStyles = "";
  if (isCurrentWeek) {
    cardStyles = "bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-500 shadow-xl ring-2 ring-blue-300 ring-opacity-50";
  } else if (isProject) {
    cardStyles = "bg-gradient-to-br from-purple-50 to-pink-100 border-purple-500 shadow-lg ring-1 ring-purple-200";
  } else {
    cardStyles = `bg-white ${priorityColors[data.priority]}`;
  }

  const categoryIcons = {
    foundations: "🏗️",
    "data-manipulation": "🔧",
    visualization: "📊",
    databases: "🗄️",
    "data-collection": "📡",
    "machine-learning": "🤖",
    "deep-learning": "🧠",
    statistics: "📈",
    deployment: "🚀",
    "version-control": "📝",
    nlp: "💬",
    "computer-vision": "👁️",
    "time-series": "⏰",
    explainability: "🔍",
    mlops: "⚙️",
    portfolio: "🎨",
    project: "🚀"
  };

  const handleToggleComplete = () => {
    onUpdate(data.week, { 
      completed: !data.completed,
      hoursCompleted: !data.completed ? data.hoursExpected : data.hoursCompleted
    });
  };

  const handleSaveEdit = () => {
    onUpdate(data.week, {
      notes: editedNotes,
      hoursCompleted: editedHours
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedNotes(data.notes);
    setEditedHours(data.hoursCompleted);
    setIsEditing(false);
  };

  return (
    <div className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 overflow-hidden hover-lift ${cardStyles}`}>
      {/* Current Week Indicator */}
      {isCurrentWeek && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm font-semibold flex items-center">
          <span className="animate-pulse mr-2">🎯</span>
          CURRENTLY WORKING ON
        </div>
      )}
      
      {/* Project Week Indicator */}
      {isProject && !isCurrentWeek && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 text-sm font-semibold flex items-center">
          <span className="mr-2">🚀</span>
          HANDS-ON PROJECT
        </div>
      )}
      
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{categoryIcons[data.category] || "📚"}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Week {data.week}</h2>
              <p className="text-sm text-gray-500">{data.startDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              data.priority === 'high' ? 'bg-red-100 text-red-800' :
              data.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {data.priority.toUpperCase()}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(data.week)}
                className="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-xs flex items-center justify-center"
                title="Delete week"
              >
                ×
              </button>
            )}
            <button
              onClick={handleToggleComplete}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                data.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {data.completed && <span className="text-xs">✓</span>}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">
              {isProject ? "Project Description" : "Concept"}
            </h3>
            <p className={`text-gray-600 ${isProject ? 'text-base' : ''}`}>{data.concept}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">
              {isProject ? "Project Goals" : "Practice"}
            </h3>
            <p className={`text-gray-600 ${isProject ? 'text-base' : ''}`}>{data.practice}</p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">
                {data.hoursCompleted}/{data.hoursExpected}h ({Math.round(progressPercentage)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  data.completed ? 'bg-green-500' : 
                  isProject ? 'bg-purple-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          {isExpanded ? '↑ Show Less' : '↓ Show More'}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          {/* Notes Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Notes</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add your notes here..."
                />
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours Completed
                  </label>
                  <input
                    type="number"
                    value={editedHours}
                    onChange={(e) => setEditedHours(Number(e.target.value))}
                    min="0"
                    max={data.hoursExpected}
                    className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {data.notes || "No notes yet. Click edit to add some!"}
              </p>
            )}
          </div>

          {/* Resources */}
          {data.resources.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Resources</h3>
              <div className="space-y-2">
                {data.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
                  >
                    <span className="text-xl">
                      {resource.type === 'documentation' && '📚'}
                      {resource.type === 'tutorial' && '🎯'}
                      {resource.type === 'course' && '🎓'}
                      {resource.type === 'video' && '📹'}
                      {resource.type === 'article' && '📄'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 group-hover:text-blue-800">
                        {resource.title}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{resource.type}</p>
                    </div>
                    <span className="text-blue-600 group-hover:text-blue-800">→</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
