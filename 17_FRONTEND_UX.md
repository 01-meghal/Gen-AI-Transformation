# Frontend UX Specification

[Index](./00_INDEX.md) · [Previous](./16_REVIEW_VERSIONING_COLLAB.md) · [Next](./18_ASYNC_REALTIME_JOBS.md)

---


## Route map

```text
/login
/app
/app/projects
/app/projects/:projectId
/app/sources/:sourceId
/app/transform/:sourceId
/app/outputs/:outputId
/app/reviews
/app/brands
/app/prompts              # admin
/app/integrations         # admin
/app/audit                # admin
/app/usage                # admin
```

## Main screens

### Dashboard
- recent projects,
- recent jobs,
- outputs awaiting review,
- usage snapshot,
- create transformation CTA.

### Project page
- sources list,
- outputs list,
- status filters,
- upload/add URL/add text actions.

### Source page
- metadata,
- processing status,
- normalized preview,
- extracted topics/claims optional,
- “Create transformation” action.

### Transformation wizard
Step 1: source confirmation.
Step 2: target formats.
Step 3: audience/tone/language/detail/objective/style.
Step 4: brand/length/custom instruction.
Step 5: review configuration and start.

### Generation workspace
Two-column desktop layout:
- left: source/evidence,
- right: generated structured editor/preview.

Controls:
- edit,
- regenerate,
- regenerate section,
- compare versions,
- quality panel,
- submit review,
- download.

### Review queue
- filter by project/output type/status,
- assignment optional,
- quality warnings visible,
- age/time since submission.

### Review detail
- source + evidence,
- output,
- diff,
- quality report,
- approve/request changes/reject.

## State management

Use RTK Query for server state.
Use Redux slices only for:
- auth/session UI state,
- transformation draft config,
- unsaved editor state,
- realtime connection/event state.

Do not mirror all API entities manually in Redux.

## API generated types

Prefer OpenAPI-generated TypeScript client/types.

## Realtime behavior

On job events:
- update progress bar,
- invalidate job/output/source queries at completion,
- show toast for success/failure,
- reconnect with exponential backoff.

## Editor behavior

- structured form/editor per output type,
- autosave only to local draft unless user explicitly saves version,
- warn on unsaved changes,
- show hard platform limit counters,
- disable review submit when blocking validation errors exist.

## Accessibility

- keyboard navigation for core flows,
- visible focus states,
- form labels and errors,
- semantic headings,
- color not sole status indicator,
- contrast compliant with common WCAG AA expectations.

## Responsive design

Desktop is primary for academic MVP.
Mobile/tablet:
- stack source and output panels,
- preserve read/review actions,
- complex inline editing may use full-screen section editor.

## Empty/loading/error states

Every screen defines:
- skeleton/loading,
- empty state with next action,
- recoverable error retry,
- permission denied state.

## Security UX

Never render raw unsanitized HTML from source or model.
External links open with safe attributes and display destination.
