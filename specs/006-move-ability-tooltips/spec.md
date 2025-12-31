# Feature Specification: Move and Ability Hover Tooltips

**Feature Branch**: `006-move-ability-tooltips`
**Created**: 2025-12-31
**Status**: Draft
**Input**: User description: "add a on hover popup to all moves and abilities that show all text for the move / ability"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Move Details on Hover (Priority: P1)

Users viewing a Pokemon's detail modal want to quickly see full move information without navigating away. When hovering over any move name, a tooltip appears showing the move's complete details including type, power stats, timing, PP, range, duration, and full description.

**Why this priority**: Moves are the primary interaction element users need details about. Move tooltips provide immediate value by surfacing critical gameplay information (damage, type, range) that was previously hidden.

**Independent Test**: Can be fully tested by opening any Pokemon detail modal, hovering over a move in the Starting Moves, Level-Up Moves, or TM Moves sections, and verifying tooltip displays with all move data.

**Acceptance Scenarios**:

1. **Given** a user has opened a Pokemon detail modal, **When** they hover over a move name in the Starting Moves section, **Then** a tooltip appears showing the move's name, type, power attributes, time, PP, duration, range, description, and higher level effects (if any)
2. **Given** a user has a tooltip visible, **When** they move their cursor away from the move, **Then** the tooltip disappears
3. **Given** a user hovers over a move, **When** the move data is unavailable, **Then** the tooltip displays a graceful "Details unavailable" message

---

### User Story 2 - View Ability Details on Hover (Priority: P2)

Users want to understand what each ability does without searching external resources. When hovering over an ability name, a tooltip appears showing the ability's full description.

**Why this priority**: Abilities are secondary to moves but equally important for understanding Pokemon capabilities. Hidden abilities especially need explanation.

**Independent Test**: Can be fully tested by opening any Pokemon detail modal, hovering over an ability in the Abilities section, and verifying tooltip displays the ability description.

**Acceptance Scenarios**:

1. **Given** a user has opened a Pokemon detail modal, **When** they hover over an ability name, **Then** a tooltip appears showing the ability's name and full description
2. **Given** an ability is marked as "Hidden", **When** the user hovers over it, **Then** the tooltip indicates this is a hidden ability along with the description
3. **Given** the ability data is unavailable, **When** the user hovers over it, **Then** the tooltip displays a graceful "Details unavailable" message

---

### User Story 3 - Accessible Tooltip Interaction (Priority: P3)

Users navigating via keyboard or touch devices can access tooltip information without requiring mouse hover.

**Why this priority**: Accessibility ensures all users can access move/ability details regardless of input method.

**Independent Test**: Can be tested by tabbing to a move/ability element and verifying tooltip appears on focus, or by tapping on mobile.

**Acceptance Scenarios**:

1. **Given** a user is navigating via keyboard, **When** they tab to a move or ability element, **Then** the tooltip appears on focus
2. **Given** a user is on a touch device, **When** they tap a move or ability, **Then** the tooltip appears
3. **Given** a tooltip is visible via focus/tap, **When** the user moves focus elsewhere or taps outside, **Then** the tooltip closes

---

### Edge Cases

- What happens when the tooltip would overflow the viewport edge? The tooltip repositions to remain fully visible.
- How does the system handle moves/abilities not found in the data source? Display "Details unavailable" message.
- What happens when multiple tooltips could be triggered simultaneously? Only one tooltip displays at a time; new hover closes previous.
- How do tooltips behave when scrolling the modal content? Tooltips dismiss on scroll to prevent positioning issues.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a tooltip when users hover over any move name in the Pokemon detail modal
- **FR-002**: System MUST display a tooltip when users hover over any ability name in the Pokemon detail modal
- **FR-003**: Move tooltips MUST show: move name, type (with visual indicator), power attributes, time, PP count, duration, range, full description text, and higher level effects when available
- **FR-004**: Ability tooltips MUST show: ability name, hidden status indicator (if applicable), and full description text
- **FR-005**: Tooltips MUST appear within 200ms of hover to feel responsive
- **FR-006**: Tooltips MUST disappear when the cursor leaves the trigger element
- **FR-007**: Tooltips MUST reposition automatically when they would otherwise overflow viewport boundaries
- **FR-008**: System MUST support keyboard focus to trigger tooltips for accessibility
- **FR-009**: System MUST support tap interaction for tooltips on touch devices
- **FR-010**: Only one tooltip MUST be visible at any given time
- **FR-011**: Tooltips MUST gracefully handle missing data by showing "Details unavailable"
- **FR-012**: Tooltips MUST be visually consistent with the existing application design

### Key Entities

- **Move**: Represents a Pokemon attack/action with attributes: id, name, type, power, time, pp, duration, range, description, higherLevels
- **Ability**: Represents a Pokemon passive capability with attributes: id, name, description, hidden status

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view complete move information in under 1 second without leaving the modal
- **SC-002**: Users can view complete ability information in under 1 second without leaving the modal
- **SC-003**: 100% of move names in the modal are hoverable with tooltips
- **SC-004**: 100% of ability names in the modal are hoverable with tooltips
- **SC-005**: Tooltips remain fully visible regardless of trigger element position
- **SC-006**: Users can access tooltip information via keyboard navigation

## Assumptions

- Move and ability data is available in the existing Source folder JSON files (moves.json, abilities.json)
- The existing Pokemon detail modal is the primary location for displaying move/ability tooltips
- Tooltips should use existing application styling conventions for visual consistency
- Standard tooltip delay of 200ms provides good balance between responsiveness and avoiding accidental triggers
