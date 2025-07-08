import React from 'react';
import { WeekData } from '../types';

interface Props {
  roadmap: WeekData[];
}

export default function ProgressTimeline({ roadmap }: Props) {
  // Calculate which set of 12 weeks to show based on progress
  const getVisibleWeeksRange = () => {
    const totalWeeks = roadmap.length;
    const totalSets = Math.ceil(totalWeeks / 12);
    
    // Find the first incomplete week
    const firstIncompleteWeek = roadmap.find(week => !week.completed);
    
    if (!firstIncompleteWeek) {
      // All weeks are complete, show the last set
      const lastSetStart = Math.max(0, totalWeeks - 12);
      return {
        start: lastSetStart,
        end: totalWeeks,
        setNumber: totalSets,
        isLastSet: true
      };
    }
    
    // Find which set (group of 12) the first incomplete week belongs to
    const incompleteWeekIndex = roadmap.findIndex(week => week.week === firstIncompleteWeek.week);
    const currentSet = Math.floor(incompleteWeekIndex / 12) + 1;
    const setStartIndex = (currentSet - 1) * 12;
    const setEndIndex = Math.min(setStartIndex + 12, totalWeeks);
    
    return {
      start: setStartIndex,
      end: setEndIndex,
      setNumber: currentSet,
      isLastSet: currentSet === totalSets
    };
  };

  const { start, end, setNumber, isLastSet } = getVisibleWeeksRange();
  const visibleWeeks = roadmap.slice(start, end);
  const totalSets = Math.ceil(roadmap.length / 12);
  
  // Calculate progress for the current set
  const completedInSet = visibleWeeks.filter(week => week.completed).length;
  const progressPercentage = (completedInSet / visibleWeeks.length) * 100;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Learning Journey Timeline</h2>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Phase {setNumber} of {totalSets}</span>
          <span className="ml-2">({completedInSet}/{visibleWeeks.length} completed)</span>
        </div>
      </div>
      
      {/* Progress bar for current set */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Weeks {start + 1}-{end}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {visibleWeeks.map((week) => {
          const currentWeek = roadmap.find(w => 
            !w.completed && roadmap.findIndex(rw => rw.week === w.week) === roadmap.findIndex(rw => !rw.completed)
          );
          
          const isCurrent = week === currentWeek;
          
          let statusClass = '';
          let statusIcon = '';
          
          if (week.completed) {
            statusClass = 'bg-green-500 text-white shadow-lg';
            statusIcon = '✓';
          } else if (isCurrent) {
            statusClass = 'bg-blue-500 text-white animate-pulse shadow-lg ring-2 ring-blue-300';
            statusIcon = '🎯';
          } else {
            statusClass = 'bg-gray-300 text-gray-600';
            statusIcon = '○';
          }
          
          return (
            <div
              key={week.week}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${statusClass} transition-all duration-300 hover:scale-110 cursor-pointer`}
              title={`Week ${week.week}: ${week.concept} ${week.completed ? '(Completed)' : isCurrent ? '(Current)' : ''}`}
            >
              {week.completed ? statusIcon : week.week}
            </div>
          );
        })}
      </div>
      
      {/* Set navigation indicators */}
      {totalSets > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalSets }, (_, i) => i + 1).map(setNum => {
            const setStart = (setNum - 1) * 12;
            const setEnd = Math.min(setStart + 12, roadmap.length);
            const setWeeks = roadmap.slice(setStart, setEnd);
            const setCompleted = setWeeks.filter(w => w.completed).length;
            const isCurrentSet = setNum === setNumber;
            
            return (
              <div
                key={setNum}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isCurrentSet 
                    ? 'bg-blue-500 text-white' 
                    : setCompleted === setWeeks.length 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                }`}
                title={`Phase ${setNum}: Weeks ${setStart + 1}-${setEnd} (${setCompleted}/${setWeeks.length} completed)`}
              >
                {setNum}
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-600">Completed</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
          <span className="text-gray-600">Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
          <span className="text-gray-600">Upcoming</span>
        </div>
      </div>
    </div>
  );
}
