import React, { useState } from "react";
import { WeekData } from "../types";

interface Props {
  roadmap: WeekData[];
}

function ProjectMilestones({ roadmap }: Props) {
  const [isGlobalExpanded, setIsGlobalExpanded] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const projects = roadmap.filter(week => week.category === 'project');

  const toggleProject = (weekNumber: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedProjects(newExpanded);
  };

  const getProjectStatus = (project: WeekData) => {
    if (project.completed) return { status: 'completed', color: 'green', icon: '✅' };
    if (project.hoursCompleted > 0) return { status: 'in-progress', color: 'yellow', icon: '🔄' };
    return { status: 'upcoming', color: 'gray', icon: '⏳' };
  };

  if (projects.length === 0) return null;

  return (
    <div id="project-milestones" className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="text-2xl mr-3">🚀</span>
          Project Milestones
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setIsGlobalExpanded(!isGlobalExpanded);
              setExpandedProjects(new Set());
            }}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
          >
            {/* <span>{isGlobalExpanded ? '📦' : '📖'}</span>
            <span>{isGlobalExpanded ? 'Wrap All' : 'Expand All'}</span> */}
          </button>
          <span className="text-sm text-gray-500">
            {projects.filter(p => p.completed).length} of {projects.length} completed
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {projects.map(project => {
          const { status, color, icon } = getProjectStatus(project);
          const isExpanded = isGlobalExpanded || expandedProjects.has(project.week);
          const shouldShowToggle = project.practice.length > 200;
          return (
            <div
              key={project.week}
              className={`p-4 border-l-4 rounded-lg ${
                color === 'green' ? 'border-green-500 bg-green-50' :
                color === 'yellow' ? 'border-yellow-500 bg-yellow-50' :
                'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{icon}</span>
                    <h3 className="font-semibold text-gray-800">
                      Week {project.week}: {project.concept.replace('🚀 PROJECT: ', '')}
                    </h3>
                    {shouldShowToggle && !isGlobalExpanded && (
                      <button
                        onClick={() => toggleProject(project.week)}
                        className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 transition-colors"
                      >
                        {expandedProjects.has(project.week) ? '📄 Less' : '📖 More'}
                      </button>
                    )}
                  </div>
                  <p
                    className={`text-sm text-gray-600 mb-2 transition-all duration-300 ${
                      isExpanded ? 'whitespace-pre-wrap' : ''
                    }`}
                    style={!isExpanded ? {
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical' as any,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    } : {}}
                  >
                    {project.practice}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>📅 {project.startDate}</span>
                    <span>⏱️ {project.hoursExpected}h expected</span>
                    <span>✅ {project.hoursCompleted}h completed</span>
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    color === 'green' ? 'bg-green-100 text-green-800' :
                    color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {status.toUpperCase().replace('-', ' ')}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      color === 'green' ? 'bg-green-500' :
                      color === 'yellow' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${Math.min((project.hoursCompleted / project.hoursExpected) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectMilestones;
