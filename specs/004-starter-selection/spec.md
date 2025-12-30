# Feature Specification: Starter Pokemon Selection

**Feature Branch**: `004-starter-selection`
**Created**: 2025-12-30
**Status**: Draft
**Input**: User description: "Change the random pokemon functionality to generate a starter. There should be a bar that has all of the possible elements, then players can select 1 or 2 elements and all pokemon CR 1/2 and below that fit that criteria are shown to the player and they can select one to be their starter. This will need to be tracked in the database, players will have up to six active pokemon and unlimited pokemon in storage."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filter and Browse Starter Pokemon (Priority: P1)

A logged-in player wants to browse available starter Pokemon. They see a type filter bar displaying all 18 Pokemon types (bug, dark, dragon, electric, fairy, fighting, fire, flying, ghost, grass, ground, ice, normal, poison, psychic, rock, steel, water). The player can click 1 or 2 type buttons to filter the Pokemon list. The system displays all Pokemon with Challenge Rating (SR) 0.5 or below that match the selected type(s). Pokemon are displayed as cards showing sprite, name, types, and basic stats.

**Why this priority**: This is the foundation of the starter selection feature. Without filtering and browsing, players cannot discover and choose their starter Pokemon. It delivers immediate value by letting players explore available options.

**Independent Test**: Navigate to the starter selection page, click "Fire" type button, verify only Fire-type Pokemon with SR <= 0.5 appear. Click "Flying" as second type, verify list filters to Pokemon that are Fire, Flying, or Fire/Flying type.

**Acceptance Scenarios**:

1. **Given** a logged-in player on the starter selection page, **When** no types are selected, **Then** display a prompt to "Select 1 or 2 types to see available starters"
2. **Given** a logged-in player, **When** they click the "Grass" type button, **Then** display all Pokemon with SR <= 0.5 that have Grass as one of their types
3. **Given** a player with "Fire" selected, **When** they click "Dragon" as a second type, **Then** display Pokemon that are Fire-type, Dragon-type, or Fire/Dragon dual-type (union, not intersection)
4. **Given** a player with 2 types selected, **When** they click a third type, **Then** deselect the oldest selection and select the new type (max 2 types)
5. **Given** a player with types selected, **When** they click a selected type again, **Then** deselect that type

---

### User Story 2 - Select Starter Pokemon (Priority: P2)

After filtering and finding a Pokemon they like, the player clicks on a Pokemon card to view its full details (stats, abilities, description). They can then click "Choose as Starter" to add this Pokemon to their active team. The selection is saved to the database. The player is redirected to their dashboard where they can see their new starter in their active Pokemon roster.

**Why this priority**: This is the core action of the feature - actually selecting a starter. It depends on US1 (browsing) but is essential for completing the user journey.

**Independent Test**: With types filtered, click on a Pokemon card, view details modal, click "Choose as Starter", verify Pokemon appears in active roster on dashboard.

**Acceptance Scenarios**:

1. **Given** a player viewing filtered Pokemon, **When** they click on a Pokemon card, **Then** display a detail modal with full stats, ability, description, and "Choose as Starter" button
2. **Given** a player viewing a Pokemon detail modal, **When** they click "Choose as Starter", **Then** save the Pokemon to their active roster and redirect to dashboard
3. **Given** a player has no starter yet, **When** they select their first starter, **Then** the Pokemon is added to their active roster (slot 1 of 6)
4. **Given** a player already has a starter, **When** they try to select another starter from this page, **Then** show message "You already have a starter! Visit your Pokemon collection to manage your team."

---

### User Story 3 - View Active Pokemon Roster (Priority: P3)

A logged-in player can view their active Pokemon roster on the dashboard. The roster displays up to 6 Pokemon slots. Each filled slot shows the Pokemon's sprite, name, level, and types. Empty slots are displayed as placeholders. Players can see at a glance how many active Pokemon they have.

**Why this priority**: This lets players see the result of their starter selection and provides the foundation for future team management features.

**Independent Test**: After selecting a starter, navigate to dashboard, verify active roster section shows the starter Pokemon with correct details in slot 1.

**Acceptance Scenarios**:

1. **Given** a logged-in player with a starter Pokemon, **When** they view the dashboard, **Then** display the active roster showing their Pokemon in slot 1
2. **Given** a logged-in player with no Pokemon, **When** they view the dashboard, **Then** display 6 empty roster slots with "No Pokemon" placeholders and a prompt to select a starter
3. **Given** a player with 3 active Pokemon, **When** they view the roster, **Then** show 3 filled slots and 3 empty slots

---

### User Story 4 - Pokemon Storage System (Priority: P4)

Players can store unlimited Pokemon beyond their 6 active slots. When a player's active roster is full (6 Pokemon) and they acquire a new Pokemon, it goes to storage. Players can view their storage and swap Pokemon between active roster and storage.

**Why this priority**: Storage is important for long-term gameplay but not essential for the initial starter selection flow. This can be implemented after the core selection mechanics work.

**Independent Test**: Fill active roster with 6 Pokemon, acquire a 7th, verify it goes to storage. Open storage view, verify swap functionality works.

**Acceptance Scenarios**:

1. **Given** a player with a full active roster (6 Pokemon), **When** they acquire a new Pokemon, **Then** the new Pokemon is automatically added to storage
2. **Given** a player with Pokemon in storage, **When** they view storage, **Then** display all stored Pokemon with sprite, name, and types
3. **Given** a player viewing storage, **When** they click "Move to Active" on a stored Pokemon and active roster has space, **Then** move the Pokemon to an active slot
4. **Given** a player viewing active roster, **When** they click "Move to Storage" on an active Pokemon, **Then** move the Pokemon to storage

---

### Edge Cases

- What happens when a player selects type combinations with no matching Pokemon? Display "No Pokemon match these types" message
- What happens if database save fails during starter selection? Show error message, allow retry, do not navigate away
- What happens if player navigates away during selection? No changes are saved until "Choose as Starter" is clicked
- How does system handle concurrent sessions? Last write wins; display current state on page load
- What if a player somehow has more than 6 active Pokemon? Enforce limit at API level; extra Pokemon go to storage

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display all 18 Pokemon types as clickable filter buttons
- **FR-002**: System MUST allow selection of 1 or 2 types maximum
- **FR-003**: System MUST filter Pokemon to show only those with SR <= 0.5 (Challenge Rating 1/2 or below)
- **FR-004**: System MUST filter by type using union logic (matches either selected type, not both required)
- **FR-005**: System MUST display filtered Pokemon as cards with sprite, name, and types
- **FR-006**: System MUST allow logged-in players to select one Pokemon as their starter
- **FR-007**: System MUST persist selected Pokemon to database linked to user account
- **FR-008**: System MUST enforce maximum of 6 active Pokemon per player
- **FR-009**: System MUST provide unlimited storage for Pokemon beyond the 6 active slots
- **FR-010**: System MUST display active Pokemon roster on dashboard
- **FR-011**: System MUST require authentication for starter selection and Pokemon management
- **FR-012**: System MUST prevent selecting a new starter if player already has one (from this page)

### Key Entities

- **PlayerPokemon**: A Pokemon owned by a player. Contains: id (UUID), user_id (FK to auth.users), pokemon_id (string, references Source data), is_active (boolean), slot_number (1-6 for active, null for storage), level (integer, default 1), acquired_at (timestamp), nickname (optional string)
- **Active Roster**: Up to 6 PlayerPokemon records where is_active=true and slot_number is 1-6
- **Storage**: Unlimited PlayerPokemon records where is_active=false and slot_number is null

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can filter and view starter Pokemon within 2 seconds of selecting types
- **SC-002**: Players can complete starter selection flow (filter, select, confirm) in under 1 minute
- **SC-003**: 100% of starter selections are correctly persisted to database
- **SC-004**: Dashboard correctly displays active roster state matching database records
- **SC-005**: System correctly enforces 6 active Pokemon limit with no exceptions
