# Layered Hook Architecture

This document defines the layering contract for React Native components scaffolded by `/rn-component`.

## Layers

### View (`index.tsx`)
- JSX only — no state, no logic, no side effects.
- Consumes exactly three hooks: `useStyles`, `useReanimatedStyles`, and `use<ComponentName>ViewModel`.
- Receives props typed as `I<ComponentName>Props`.

### ViewModel (`hooks/use<ComponentName>ViewModel/`)
- Single owner of all component logic.
- May use: `useState`, `useReducer`, `useMemo`, `useCallback`, `useEffect`, store subscriptions.
- Calls functions from `services/` and `library/` as needed.
- Returns `IUse<ComponentName>ViewModelReturn`.

### Static Styles (`styles.ts`)
- Exports `useStyles(props: I<ComponentName>Props)` — a hook that returns a `StyleSheet.create({})` result.
- Memoized with `useMemo`.
- No animated properties here.

### Animation Styles (`hooks/useReanimatedStyles/`)
- All `react-native-reanimated` logic lives here.
- Receives `IUseReanimatedStylesProps` (never static styles).
- Never contains `StyleSheet.create` calls.

### Services (`services/`)
- Plain async functions (API calls, AsyncStorage, etc.).
- No hooks allowed.
- Called from ViewModel only — never from the View.

### Library (`library/`)
- Pure utility functions.
- No hooks, no side effects.
- May be called from ViewModel or from services.

## Type conventions
- Interfaces use the `I` prefix: `IComponentNameProps`, `IUseComponentNameViewModelReturn`.
- Plain types (union, intersection, alias) have no prefix.
- Every folder that has public exports has a barrel `index.ts`.

## Barrel cycle rule
Templates use deep relative imports only (e.g. `./types`, `../useReanimatedStyles/types`).
Never use `../..` shorthand — it creates import cycles between barrels.
