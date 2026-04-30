# JSX style

## Conditional rendering

Never wrap a JSX subtree in parentheses as the branch of a ternary. Use the "line-break ternary" form with the `?`, JSX, and `: null` on their own lines.

### ✅ Correct

```tsx
{isRequired
  ?
  <Icon
    icon="Asterisk"
    size="small_16"
    color={value ? 'success' : 'error'}
  />
  : null
}
```

For simple inline branches (single `<Text>` / primitive), keeping everything on a single line is fine:

```tsx
{title ? <Text>{title}</Text> : null}
```

### ❌ Wrong

```tsx
{isRequired ? (
  <Icon
    icon="Asterisk"
    size="small_16"
    color={value ? 'success' : 'error'}
  />
) : null}
```

**Why:** Wrapping JSX in `()` as a ternary branch hides the structure — the `?` and `: null` visually collide with the JSX, and diffs become noisier when props change. The line-break form keeps the three pieces (`condition`, `JSX branch`, `else branch`) on their own axes and scans top-to-bottom.

**How to apply:**
- Any time you render JSX conditionally inside another JSX tree.
- Applies equally to `?:` with `null` and to `?:` with another element.
- When both branches are JSX, keep each on its own line with the `?` / `:` on their own lines too.
- Never introduce `(` `)` around a JSX branch purely for ternary grouping.

## `&&` guard

Prefer `{cond ? <JSX /> : null}` over `{cond && <JSX />}` when `cond` can be a falsy-but-renderable value (`0`, `''`, `NaN`) — React Native will render a stray `0` as text. Use `&&` only when `cond` is strictly boolean.
