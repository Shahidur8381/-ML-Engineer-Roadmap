# 📝 Types Directory

## Overview

This directory contains TypeScript type definitions, interfaces, and type utilities that provide type safety throughout the ML Roadmap Tracker application. These types ensure consistency, enable better IDE support, and prevent runtime errors.

## Type Categories

### Core Application Types

#### Progress Tracking Types

```typescript
// Week progress tracking
interface WeekProgress {
  id: number;
  title: string;
  description: string;
  topics: string[];
  completed: boolean;
  completedAt?: Date;
  notes?: string;
  timeSpent?: number; // in hours
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: WeekCategory;
}

// Overall progress data structure
interface ProgressData {
  weeks: WeekProgress[];
  projects: ProjectProgress[];
  milestones: Milestone[];
  statistics: ProgressStatistics;
  metadata: ProgressMetadata;
}

// Progress statistics
interface ProgressStatistics {
  totalWeeks: number;
  completedWeeks: number;
  completionPercentage: number;
  totalTimeSpent: number;
  averageWeeklyTime: number;
  streak: number;
  longestStreak: number;
}
```

#### Project and Milestone Types

```typescript
// Project milestone tracking
interface ProjectProgress {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  difficulty: DifficultyLevel;
  estimatedHours: number;
  actualHours?: number;
  completed: boolean;
  completedAt?: Date;
  githubUrl?: string;
  demoUrl?: string;
  technologies: string[];
  learningOutcomes: string[];
  status: ProjectStatus;
}

// Learning milestones
interface Milestone {
  id: string;
  title: string;
  description: string;
  type: MilestoneType;
  requirements: string[];
  achieved: boolean;
  achievedAt?: Date;
  certificate?: Certificate;
}
```

### Enumeration Types

#### Week Categories

```typescript
enum WeekCategory {
  FOUNDATIONS = "foundations",
  MATHEMATICS = "mathematics",
  PROGRAMMING = "programming",
  DATA_SCIENCE = "data_science",
  MACHINE_LEARNING = "machine_learning",
  DEEP_LEARNING = "deep_learning",
  SPECIALIZED = "specialized",
  PROJECTS = "projects",
  DEPLOYMENT = "deployment",
  ETHICS = "ethics",
}
```

#### Difficulty Levels

```typescript
enum DifficultyLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  EXPERT = "expert",
}
```

#### Project Categories

```typescript
enum ProjectCategory {
  CLASSIFICATION = "classification",
  REGRESSION = "regression",
  CLUSTERING = "clustering",
  NLP = "nlp",
  COMPUTER_VISION = "computer_vision",
  TIME_SERIES = "time_series",
  REINFORCEMENT_LEARNING = "reinforcement_learning",
  WEB_APPLICATION = "web_application",
  MOBILE_APP = "mobile_app",
  API_DEVELOPMENT = "api_development",
}
```

#### Status Types

```typescript
enum ProjectStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  PAUSED = "paused",
  CANCELLED = "cancelled",
}

enum MilestoneType {
  KNOWLEDGE = "knowledge",
  SKILL = "skill",
  PROJECT = "project",
  CERTIFICATION = "certification",
  ACHIEVEMENT = "achievement",
}
```

### Cloud Sync Types

#### Synchronization Types

```typescript
// Cloud sync result
interface SyncResult {
  success: boolean;
  timestamp: Date;
  error?: SyncError;
  message?: string;
  conflictsResolved?: number;
  dataVersion?: string;
}

// Sync error types
enum SyncError {
  AUTHENTICATION_FAILED = "authentication_failed",
  NETWORK_ERROR = "network_error",
  DATA_CORRUPTION = "data_corruption",
  RATE_LIMITED = "rate_limited",
  CONFLICT_RESOLUTION_FAILED = "conflict_resolution_failed",
  INVALID_DATA_FORMAT = "invalid_data_format",
}

// Sync configuration
interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // in milliseconds
  conflictResolution: ConflictResolutionStrategy;
  retryAttempts: number;
  backupRetention: number; // number of backups to keep
}

enum ConflictResolutionStrategy {
  LOCAL_WINS = "local_wins",
  REMOTE_WINS = "remote_wins",
  MERGE = "merge",
  MANUAL = "manual",
}
```

#### GitHub Integration Types

```typescript
// GitHub Gist structure
interface GitHubGist {
  id: string;
  url: string;
  created_at: string;
  updated_at: string;
  description: string;
  public: boolean;
  files: Record<string, GistFile>;
}

interface GistFile {
  filename: string;
  type: string;
  language: string;
  content: string;
  size: number;
}

// GitHub API response types
interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

interface GitHubApiError {
  message: string;
  errors?: Array<{
    field: string;
    code: string;
    message: string;
  }>;
  documentation_url: string;
}
```

### UI Component Types

#### Component Props

```typescript
// Week card component props
interface WeekCardProps {
  week: WeekProgress;
  onToggleComplete: (weekId: number) => void;
  onUpdateNotes: (weekId: number, notes: string) => void;
  showDetails?: boolean;
  isExpanded?: boolean;
  className?: string;
}

// Dashboard component props
interface DashboardProps {
  progress: ProgressData;
  onProgressUpdate: (progress: ProgressData) => void;
  syncStatus: SyncStatus;
  onSync: () => Promise<void>;
}

// Modal component props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: ModalSize;
  closable?: boolean;
}

enum ModalSize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
  FULLSCREEN = "fullscreen",
}
```

#### UI State Types

```typescript
// Application state
interface AppState {
  progress: ProgressData;
  user: User | null;
  settings: UserSettings;
  ui: UIState;
  sync: SyncState;
}

// UI state management
interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  activeTab: string;
  notifications: Notification[];
  loading: boolean;
  errors: AppError[];
}

// Notification system
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: NotificationAction;
  createdAt: Date;
}

enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}
```

### Utility Types

#### Generic Utility Types

```typescript
// API response wrapper
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
  version: string;
}

// Paginated response
interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Form validation
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

#### Type Guards

```typescript
// Type guard functions
function isWeekProgress(obj: any): obj is WeekProgress {
  return (
    typeof obj === "object" &&
    typeof obj.id === "number" &&
    typeof obj.title === "string" &&
    typeof obj.completed === "boolean" &&
    Array.isArray(obj.topics)
  );
}

function isProgressData(obj: any): obj is ProgressData {
  return (
    typeof obj === "object" &&
    Array.isArray(obj.weeks) &&
    Array.isArray(obj.projects) &&
    obj.weeks.every(isWeekProgress)
  );
}

function isSyncResult(obj: any): obj is SyncResult {
  return (
    typeof obj === "object" &&
    typeof obj.success === "boolean" &&
    obj.timestamp instanceof Date
  );
}
```

#### Conditional Types

```typescript
// Conditional type utilities
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Example usage
type PartialWeekProgress = Optional<WeekProgress, "completedAt" | "notes">;
type RequiredProjectProgress = Required<
  ProjectProgress,
  "githubUrl" | "demoUrl"
>;
```

### Configuration Types

#### Application Configuration

```typescript
interface AppConfig {
  version: string;
  environment: Environment;
  features: FeatureFlags;
  api: ApiConfig;
  storage: StorageConfig;
  analytics: AnalyticsConfig;
}

enum Environment {
  DEVELOPMENT = "development",
  STAGING = "staging",
  PRODUCTION = "production",
}

interface FeatureFlags {
  cloudSync: boolean;
  analytics: boolean;
  notifications: boolean;
  darkMode: boolean;
  exportData: boolean;
  socialSharing: boolean;
}
```

#### User Settings

```typescript
interface UserSettings {
  theme: Theme;
  language: Language;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  sync: SyncSettings;
  display: DisplaySettings;
}

enum Theme {
  LIGHT = "light",
  DARK = "dark",
  AUTO = "auto",
}

enum Language {
  ENGLISH = "en",
  SPANISH = "es",
  FRENCH = "fr",
  GERMAN = "de",
}
```

## Type Organization

### File Structure

```
types/
├── index.ts              # Main type exports
├── progress.ts           # Progress-related types
├── sync.ts              # Cloud sync types
├── ui.ts                # UI component types
├── api.ts               # API-related types
├── config.ts            # Configuration types
├── utils.ts             # Utility types
└── guards.ts            # Type guard functions
```

### Export Strategy

```typescript
// index.ts - Main export file
export * from "./progress";
export * from "./sync";
export * from "./ui";
export * from "./api";
export * from "./config";
export * from "./utils";
export * from "./guards";

// Re-export common types for convenience
export type {
  WeekProgress,
  ProgressData,
  SyncResult,
  WeekCardProps,
  AppConfig,
} from "./index";
```

## Type Safety Best Practices

### Strict TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Runtime Type Validation

```typescript
// Zod schema validation (planned)
import { z } from "zod";

const WeekProgressSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  topics: z.array(z.string()),
  completed: z.boolean(),
  completedAt: z.date().optional(),
  notes: z.string().optional(),
});

// Runtime validation
function validateWeekProgress(data: unknown): WeekProgress {
  return WeekProgressSchema.parse(data);
}
```

## Testing Types

### Type Testing Utilities

```typescript
// Type assertion tests
import { expectType } from "tsd";

// Test type assignments
expectType<WeekProgress>({
  id: 1,
  title: "Introduction to ML",
  description: "Basic concepts",
  topics: ["ML", "AI"],
  completed: false,
  difficulty: "Beginner",
  category: WeekCategory.FOUNDATIONS,
});

// Test type guards
const unknownData: unknown = getSomeData();
if (isWeekProgress(unknownData)) {
  expectType<WeekProgress>(unknownData);
}
```

## Future Type Enhancements

### Planned Type Additions

- **Analytics Types**: User behavior and metrics
- **Notification Types**: In-app notification system
- **Plugin Types**: Extensibility through plugins
- **Theme Types**: Advanced theming system
- **Internationalization Types**: Multi-language support

### Type System Improvements

- **Branded Types**: Preventing primitive obsession
- **Template Literal Types**: Advanced string typing
- **Mapped Types**: Dynamic type generation
- **Conditional Types**: Complex type logic

## Contributing to Types

### Guidelines

1. **Descriptive Names**: Use clear, descriptive type names
2. **JSDoc Comments**: Document complex types
3. **Generic Constraints**: Use appropriate generic constraints
4. **Immutability**: Prefer readonly types where appropriate
5. **Composition**: Build complex types from simpler ones
6. **Validation**: Include runtime validation for external data
