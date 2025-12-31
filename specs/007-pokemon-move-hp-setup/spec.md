# Feature Specification: Pokemon Move Selection and HP Setup

**Feature Branch**: `007-pokemon-move-hp-setup`
**Created**: 2025-12-31
**Status**: Draft
**Input**: User description: "When a pokemon is added to the users collection for any reason they should have the ability to select which moves the pokemon has for the level they are when they are obtained. The level is determined when it is captured, if it is a starter it's level 1 if it's captured or obtained it's the level it was when it was captured or obtained. Players should be able to choose average or roll for each level for their HP."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select Moves for New Pokemon (Priority: P1)

When a player adds a Pokemon to their collection (via starter selection, capture, or other acquisition method), they are presented with a move selection interface. The interface shows all moves available to that Pokemon at or below its current level. The player can select up to 4 moves from the available pool. The Pokemon cannot be added to the collection until move selection is complete.

**Why this priority**: Move selection is fundamental to the Pokemon's battle capabilities. Without selected moves, a Pokemon cannot participate meaningfully in gameplay. This is a blocking requirement for Pokemon acquisition.

**Independent Test**: Can be fully tested by adding any Pokemon to the collection and verifying the move selection modal appears, shows correct moves for the Pokemon's level, allows selection of up to 4 moves, and persists the selection.

**Acceptance Scenarios**:

1. **Given** a player selects a level 1 starter Pokemon, **When** the selection is confirmed, **Then** display a move selection interface showing only "start" moves (level 1 moves)
2. **Given** a player captures a level 6 Pokemon, **When** the capture is confirmed, **Then** display moves from "start", "level2", and "level6" pools combined
3. **Given** a player is on the move selection interface, **When** they select 4 moves, **Then** additional move selections are disabled until one is deselected
4. **Given** a player is on the move selection interface, **When** they have selected fewer than 4 moves, **Then** they can still confirm their selection (minimum 1 move required)
5. **Given** a player has selected their moves, **When** they click "Confirm Moves", **Then** the Pokemon is added to their collection with the selected moves saved

---

### User Story 2 - Choose HP Calculation Method (Priority: P1)

When a player adds a Pokemon to their collection, they can choose how to calculate the Pokemon's HP for each level. Two options are available: "Average" (takes the average roll for the hit die plus constitution modifier per level) or "Roll" (rolls the hit die for each level and adds constitution modifier). The player selects their preferred method before the Pokemon is finalized.

**Why this priority**: HP is a core stat that affects survivability in all combat. Allowing player choice between guaranteed average or risk/reward rolling adds strategic depth and player agency. This is equally important as move selection.

**Independent Test**: Can be fully tested by adding a Pokemon and verifying both HP calculation options work correctly, display the calculated HP, and persist to the database.

**Acceptance Scenarios**:

1. **Given** a player is adding a level 1 Pokemon with d6 hit dice, **When** they choose "Average", **Then** HP is calculated as base HP value (first level uses maximum die value)
2. **Given** a player is adding a level 5 Pokemon with d8 hit dice, **When** they choose "Average", **Then** HP is calculated as: max die (level 1) + average of die (4.5 rounded up = 5) times 4 levels + CON modifier times 5 levels
3. **Given** a player is adding a level 5 Pokemon, **When** they choose "Roll", **Then** the system rolls the hit die for levels 2-5 (level 1 uses max), shows each roll result, and calculates total HP
4. **Given** a player has chosen "Roll", **When** the rolls are displayed, **Then** each level's roll result is shown so the player can see the breakdown
5. **Given** a player is adding a Pokemon, **When** they have selected HP method and confirmed, **Then** the calculated HP value is saved to the database

---

### User Story 3 - Level Determines Available Moves (Priority: P2)

The system correctly interprets Pokemon level to determine which move pools are available. Level 1 Pokemon get "start" moves only. Higher level Pokemon get cumulative access to moves from all levels up to and including their current level.

**Why this priority**: This ensures the move selection interface shows correct options. Depends on the acquisition context providing the correct level.

**Independent Test**: Can be fully tested by adding Pokemon at various levels and verifying the correct move pools are available.

**Acceptance Scenarios**:

1. **Given** a starter Pokemon (always level 1), **When** move selection opens, **Then** only "start" moves are available
2. **Given** a Pokemon obtained at level 10, **When** move selection opens, **Then** moves from "start", "level2", "level6", and "level10" are all available
3. **Given** a Pokemon with no moves at certain levels, **When** move selection opens, **Then** only levels that have moves defined are included in the available pool

---

### User Story 4 - Setup Flow Integration (Priority: P2)

The move selection and HP setup flow integrates seamlessly with all Pokemon acquisition methods. Whether selecting a starter, capturing in the wild, or receiving through trade/gift, the same setup interface appears before the Pokemon is added to the collection.

**Why this priority**: Ensures consistent experience across all ways Pokemon enter a collection. The flow must work for existing starter selection and future capture mechanics.

**Independent Test**: Can be fully tested by acquiring Pokemon through different methods and verifying the setup flow appears consistently.

**Acceptance Scenarios**:

1. **Given** a player selects a starter from the starter selection screen, **When** they click "Choose as Starter", **Then** the move/HP setup modal appears before the Pokemon is added
2. **Given** a player captures a wild Pokemon (future feature), **When** capture succeeds, **Then** the move/HP setup modal appears with the capture level determining available moves
3. **Given** a player completes the setup flow, **When** they close the modal, **Then** the Pokemon appears in their collection with all selected attributes

---

### Edge Cases

- What happens if a Pokemon's level has no new moves defined? The move pool includes all moves from previous levels only.
- What happens if a player tries to select more than 4 moves? The 5th selection is blocked; player must deselect one first.
- What happens if a player selects 0 moves? Require minimum of 1 move to proceed.
- What happens if HP roll results in very low HP? Accept the roll; this is the risk/reward of choosing "Roll".
- What happens if the player closes the setup modal without confirming? Pokemon is not added to collection; return to previous screen.
- What happens with TM moves or egg moves? These are not available at acquisition time; only level-learned moves are shown.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a move selection interface when any Pokemon is added to a player's collection
- **FR-002**: System MUST show all moves available at or below the Pokemon's current level
- **FR-003**: System MUST allow selection of 1 to 4 moves from the available pool
- **FR-004**: System MUST prevent selection of more than 4 moves simultaneously
- **FR-005**: System MUST provide two HP calculation options: "Average" and "Roll"
- **FR-006**: System MUST calculate "Average" HP as: max hit die (level 1) + (average hit die rounded up * remaining levels) + (CON modifier * total levels)
- **FR-007**: System MUST calculate "Roll" HP by rolling the hit die for each level after level 1 and displaying results
- **FR-008**: System MUST use maximum hit die value for level 1 HP (no rolling for first level)
- **FR-009**: System MUST persist selected moves to the player_pokemon record
- **FR-010**: System MUST persist calculated HP to the player_pokemon record
- **FR-011**: System MUST block Pokemon addition until both move selection and HP method are confirmed
- **FR-012**: System MUST determine Pokemon level based on acquisition context (level 1 for starters, capture level for captured Pokemon)
- **FR-013**: System MUST combine move pools from all applicable levels (start, level2, level6, etc.) based on Pokemon's level
- **FR-014**: System MUST exclude TM moves and egg moves from the initial selection pool
- **FR-015**: System MUST show move details (name, type, description) to help players make informed selections

### Key Entities

- **PlayerPokemon (extended)**: Existing entity from 004-starter-selection. New attributes: selected_moves (array of move IDs, max 4), current_hp (integer), max_hp (integer), hp_method (string: "average" or "roll"), hp_roll_history (array of roll results, optional)
- **Move Pool**: Derived from Pokemon species data. Combination of all level-learned moves at or below the Pokemon's current level.
- **HP Calculation**: Result of either average formula or dice rolls, stored permanently with the Pokemon.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete the move selection and HP setup flow in under 2 minutes
- **SC-002**: 100% of Pokemon added to collections have valid move selections (1-4 moves) persisted
- **SC-003**: 100% of Pokemon added to collections have HP calculated and persisted correctly
- **SC-004**: Move selection interface displays correct moves for Pokemon's level 100% of the time
- **SC-005**: Players can see move details before selection to make informed choices
- **SC-006**: HP roll results are displayed clearly so players understand their Pokemon's HP calculation

## Assumptions

- Pokemon data includes level-based move pools (start, level2, level6, etc.) as shown in the Source/pokemon/pokemon.json structure
- Hit dice values (d6, d8, etc.) are available in the Pokemon data
- Constitution modifier can be calculated from the Pokemon's CON attribute using standard formula: (CON - 10) / 2 rounded down
- The player_pokemon table from 004-starter-selection can be extended to store moves and HP data
- Level 1 always uses maximum hit die value per standard TTRPG rules (no death at level 1 due to bad rolls)
- Average hit die calculation rounds up (d6 average = 3.5 rounded to 4, d8 average = 4.5 rounded to 5)
- TM moves and egg moves will be handled in a separate feature for teaching moves after acquisition
