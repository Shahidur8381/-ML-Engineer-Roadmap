# 🎣 Hooks Directory

## Overview

This directory contains custom React hooks that encapsulate reusable stateful logic and side effects. These hooks provide clean abstractions for data management, local storage persistence, and progress tracking functionality.

## Custom Hooks

### `useLocalStorage.ts`

**Enhanced localStorage hook with type safety and synchronization**

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void];
```

**Features:**

- **Type-Safe Storage**: Full TypeScript support for stored values
- **Automatic Serialization**: JSON serialization/deserialization
- **SSR Compatible**: Safe for server-side rendering
- **Error Handling**: Graceful fallback for storage failures
- **Real-time Sync**: Updates across multiple tabs/windows
- **Performance Optimized**: Minimal re-renders with proper memoization

**Usage Example:**

```typescript
const [user, setUser] = useLocalStorage("user", { name: "", progress: 0 });
```

### `useShawonProgress.ts`

**Specialized progress tracking hook for ML roadmap**

```typescript
function useShawonProgress(): {
  progress: ProgressData;
  updateWeek: (week: number, completed: boolean) => void;
  updateProject: (projectId: string, completed: boolean) => void;
  getCompletionStats: () => CompletionStats;
  resetProgress: () => void;
  exportProgress: () => string;
};
```

**Features:**

- **Progress State Management**: Centralized progress tracking
- **Week Completion**: Track individual week completion status
- **Project Milestones**: Manage hands-on project completion
- **Statistics Calculation**: Real-time completion percentages
- **Data Export**: Progress data in portable format
- **Persistence**: Automatic localStorage synchronization
- **Validation**: Data integrity checks and error recovery

**Usage Example:**

```typescript
const { progress, updateWeek, getCompletionStats } = useShawonProgress();
const stats = getCompletionStats(); // { completed: 25, total: 52, percentage: 48 }
```

## Hook Design Patterns

### State Management Pattern

```typescript
// Standard hook structure
export function useCustomHook(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  const updateState = useCallback((newValue: T) => {
    setState(newValue);
    // Additional side effects
  }, []);

  return { state, updateState };
}
```

### Effect Management Pattern

```typescript
// Side effect encapsulation
export function useDataFetching(url: string) {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetch(url);
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
```

## Hook Categories

### Data Persistence Hooks

- **useLocalStorage**: Enhanced localStorage management
- **useSessionStorage**: Session-based storage (planned)
- **useIndexedDB**: Client-side database storage (planned)

### Progress Tracking Hooks

- **useShawonProgress**: ML roadmap progress management
- **useWeekProgress**: Individual week tracking (planned)
- **useProjectProgress**: Project milestone tracking (planned)

### API Integration Hooks

- **useCloudSync**: GitHub API synchronization (planned)
- **useGitHubAuth**: Authentication management (planned)
- **useApiCache**: Response caching with invalidation (planned)

### UI State Hooks

- **useModal**: Modal state management (planned)
- **useNotifications**: Toast/notification system (planned)
- **useTheme**: Dark/light mode toggle (planned)

## Best Practices

### Performance Optimization

```typescript
// Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Callback memoization to prevent re-renders
const handleClick = useCallback(
  (id: string) => {
    updateItem(id);
  },
  [updateItem]
);
```

### Error Handling

```typescript
// Robust error boundaries in hooks
try {
  const result = JSON.parse(localStorage.getItem(key) || "");
  return result;
} catch (error) {
  console.warn(`Failed to parse localStorage key "${key}":`, error);
  return initialValue;
}
```

### Type Safety

```typescript
// Generic hooks with proper typing
function useAsyncState<T>(asyncFunction: () => Promise<T>): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  // Implementation
}
```

## Integration with Components

### Usage in Components

```typescript
// Clean component integration
const WeekCard: React.FC<WeekCardProps> = ({ week }) => {
  const { progress, updateWeek } = useShawonProgress();
  const [isCompleted, setIsCompleted] = useLocalStorage(
    `week-${week.id}-completed`,
    false
  );

  const handleToggle = useCallback(() => {
    const newState = !isCompleted;
    setIsCompleted(newState);
    updateWeek(week.id, newState);
  }, [isCompleted, week.id, setIsCompleted, updateWeek]);

  return <div onClick={handleToggle}>{/* Component JSX */}</div>;
};
```

### State Composition

```typescript
// Combining multiple hooks
const Dashboard: React.FC = () => {
  const { progress, updateWeek } = useShawonProgress();
  const [filter, setFilter] = useLocalStorage("dashboard-filter", "all");
  const [sortBy, setSortBy] = useLocalStorage("dashboard-sort", "week");

  // Component logic using combined state
};
```

## Testing Strategy

### Hook Testing

```typescript
// Testing custom hooks with React Testing Library
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

test("should update localStorage value", () => {
  const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

  act(() => {
    result.current[1]("updated");
  });

  expect(result.current[0]).toBe("updated");
  expect(localStorage.getItem("test-key")).toBe('"updated"');
});
```

### Integration Testing

```typescript
// Testing hooks within components
import { render, fireEvent } from "@testing-library/react";
import ComponentUsingHook from "./ComponentUsingHook";

test("component updates when hook state changes", () => {
  const { getByText } = render(<ComponentUsingHook />);

  fireEvent.click(getByText("Update"));

  expect(getByText("Updated Value")).toBeInTheDocument();
});
```

## Future Enhancements

### Planned Hooks

#### `useCloudSync.ts`

**Advanced cloud synchronization management**

- Real-time data synchronization
- Conflict resolution algorithms
- Offline queue management
- Multi-device state consistency

#### `useProgress.ts`

**Enhanced progress tracking**

- Multiple progress types (week, project, skill)
- Progress analytics and insights
- Goal setting and tracking
- Progress sharing capabilities

#### `useNotifications.ts`

**In-app notification system**

- Toast notifications
- Progress milestones
- Reminder system
- Notification preferences

#### `useAnalytics.ts`

**Usage analytics tracking**

- User behavior tracking
- Performance metrics
- Feature usage statistics
- Privacy-compliant analytics

### Performance Optimizations

- **Debounced Updates**: Preventing excessive localStorage writes
- **Batch Operations**: Grouping multiple state updates
- **Selective Subscriptions**: Optimized state change notifications
- **Memory Management**: Cleanup of event listeners and timers

## Contributing

### Adding New Hooks

1. Create hook file with descriptive name: `useFeatureName.ts`
2. Implement with proper TypeScript typing
3. Add JSDoc comments for documentation
4. Include error handling and edge cases
5. Write comprehensive tests
6. Update this README with usage examples

### Hook Guidelines

- **Single Responsibility**: Each hook should have one clear purpose
- **Composability**: Hooks should work well together
- **Type Safety**: Full TypeScript coverage required
- **Performance**: Optimize for minimal re-renders
- **Documentation**: Clear usage examples and API documentation
