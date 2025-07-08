export interface Resource {
  title: string;
  url: string;
  type: 'documentation' | 'tutorial' | 'course' | 'video' | 'article';
}

export interface WeekData {
  week: number;
  startDate: string;
  concept: string;
  practice: string;
  hoursExpected: number;
  hoursCompleted: number;
  completed: boolean;
  notes: string;
  resources: Resource[];
  priority: 'high' | 'medium' | 'low';
  category: string;
  tags: string[];
}

export interface FilterOptions {
  category: string;
  priority: string;
  completed: boolean | null;
  searchTerm: string;
}
