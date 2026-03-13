---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer has zero context for our codebase and questionable taste. Document everything they need to know: which files to touch for each task, code, testing, docs they might need to check, how to test it. Give them the whole plan as bite-sized tasks. DRY. YAGNI. TDD. Frequent commits.

Assume they are a skilled developer, but know almost nothing about our toolset or problem domain. Assume they don't know good test design very well.

**Announce at start:** "I'm using the writing-plans skill to create the implementation plan."

**Context:** This should be run in a dedicated worktree (created by brainstorming skill).

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- "Write the failing test" - step
- "Run it to make sure it fails" - step
- "Implement the minimal code to make the test pass" - step
- "Run the tests and make sure they pass" - step
- "Commit" - step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Task Structure

> **프론트엔드 TDD 원칙:**
> - **순수 로직** (알고리즘, 유틸 함수): 단위 테스트 TDD 적용 (Vitest/Jest)
> - **UI 컴포넌트/애니메이션**: Playwright MCP 검증으로 대체 가능 (렌더링, 인터랙션, 시각 효과 확인)

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.tsx:123-145`
- Test: `src/__tests__/exact/path/to/test.test.ts`

**Step 1: Write the failing test**

```typescript
import { describe, it, expect } from 'vitest'
import { functionName } from '../path/to/module'

describe('functionName', () => {
  it('should behave as expected', () => {
    const result = functionName(input)
    expect(result).toEqual(expected)
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/__tests__/path/test.test.ts`
Expected: FAIL with "functionName is not defined" or similar

**Step 3: Write minimal implementation**

```typescript
export function functionName(input: InputType): OutputType {
  return expected
}
```

**Step 4: Run test to verify it passes**

Run: `npx vitest run src/__tests__/path/test.test.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/__tests__/path/test.test.ts src/path/file.ts
git commit -m "feat: add specific feature"
```
````

> **UI 컴포넌트 검증 (TDD 대신 Playwright MCP 사용 시):**
> 1. 컴포넌트 구현 후 `npm run dev` 실행
> 2. `browser_navigate` → `browser_snapshot`으로 렌더링 확인
> 3. `browser_click` 등으로 인터랙션 검증
> 4. `browser_console_messages(level: "error")`로 에러 없음 확인

## Remember
- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
- Reference relevant skills with @ syntax
- DRY, YAGNI, TDD, frequent commits

## Execution Handoff

After saving the plan, offer execution choice:

**"Plan complete and saved to `docs/plans/<filename>.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?"**

**If Subagent-Driven chosen:**
- **REQUIRED SUB-SKILL:** Use superpowers:subagent-driven-development
- Stay in this session
- Fresh subagent per task + code review

**If Parallel Session chosen:**
- Guide them to open new session in worktree
- **REQUIRED SUB-SKILL:** New session uses superpowers:executing-plans
