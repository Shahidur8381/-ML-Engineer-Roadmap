import React from "react";
import { WeekData } from "../types";

interface Props {
  roadmap: WeekData[];
}

export default function RoadmapPhases({ roadmap }: Props) {
  // Define the phases of the ML roadmap for 52 weeks
  const phases = [
    {
      name: "Foundation Phase",
      weeks: "1-10",
      range: [1, 10],
      color: "blue",
      icon: "🏗️",
      description: "Python, Data Manipulation, Statistics"
    },
    {
      name: "ML Fundamentals",
      weeks: "11-20",
      range: [11, 20],
      color: "green",
      icon: "🤖",
      description: "Machine Learning, Deep Learning"
    },
    {
      name: "Advanced ML",
      weeks: "21-30",
      range: [21, 30],
      color: "purple",
      icon: "🧠",
      description: "Computer Vision, NLP, Advanced Topics"
    },
    {
      name: "Deployment & MLOps",
      weeks: "31-40",
      range: [31, 40],
      color: "indigo",
      icon: "🚀",
      description: "APIs, Deployment, DevOps, Production"
    },
    {
      name: "Specialization & Portfolio",
      weeks: "41-52",
      range: [41, 52],
      color: "pink",
      icon: "🎨",
      description: "Advanced Projects, Specializations, Portfolio"
    }
  ];

  const getPhaseStats = (range: number[]) => {
    const phaseWeeks = roadmap.filter(week => week.week >= range[0] && week.week <= range[1]);
    const completed = phaseWeeks.filter(week => week.completed).length;
    const total = phaseWeeks.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, percentage };
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "from-blue-500 to-blue-600",
        border: "border-blue-200",
        text: "text-blue-800",
        light: "bg-blue-50"
      },
      green: {
        bg: "from-green-500 to-green-600",
        border: "border-green-200",
        text: "text-green-800",
        light: "bg-green-50"
      },
      purple: {
        bg: "from-purple-500 to-purple-600",
        border: "border-purple-200",
        text: "text-purple-800",
        light: "bg-purple-50"
      },
      indigo: {
        bg: "from-indigo-500 to-indigo-600",
        border: "border-indigo-200",
        text: "text-indigo-800",
        light: "bg-indigo-50"
      },
      pink: {
        bg: "from-pink-500 to-pink-600",
        border: "border-pink-200",
        text: "text-pink-800",
        light: "bg-pink-50"
      }
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <span className="text-2xl mr-3">🗺️</span>
          Learning Journey Phases
        </h2>
        <span className="text-sm text-gray-500">
          Track your progress through each phase
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {phases.map((phase) => {
          const stats = getPhaseStats(phase.range);
          const colorClasses = getColorClasses(phase.color);
          
          return (
            <div 
              key={phase.name}
              className={`${colorClasses.light} ${colorClasses.border} border-2 rounded-lg p-4 hover:shadow-md transition-all duration-200`}
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">{phase.icon}</div>
                <h3 className={`font-bold text-sm ${colorClasses.text}`}>
                  {phase.name}
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Weeks {phase.weeks}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className={`font-semibold ${colorClasses.text}`}>
                    {stats.completed}/{stats.total}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${colorClasses.bg} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="text-center">
                  <span className={`text-lg font-bold ${colorClasses.text}`}>
                    {Math.round(stats.percentage)}%
                  </span>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <p className="text-xs text-gray-500 leading-tight">
                  {phase.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Overall Progress Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-slate-100 rounded-lg">
        <div className="text-center">
          <h4 className="font-semibold text-gray-800 mb-2">Overall Journey Progress</h4>
          <div className="flex justify-center items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {roadmap.filter(w => w.completed).length}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {roadmap.filter(w => !w.completed && w.hoursCompleted > 0).length}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {roadmap.filter(w => w.hoursCompleted === 0).length}
              </div>
              <div className="text-gray-600">Upcoming</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
