# NPC Actions and Intelligence Enhancement Spec

## Overview
This document outlines the current functionality of Non-Player Characters (NPCs) in Cosmic Trader and proposes enhancements to make them active, intelligent participants in the galaxy. The goal is to transform NPCs from static entities into dynamic actors that can trade, upgrade, and evolve, creating a more immersive and challenging gameplay experience.

## Current NPC Functionality Analysis

### Core Systems
- **Creation**: NPCs are generated with faction-specific names (Duran, Vinari, Trader) and ship archetypes
- **Movement**: Random movement with 30% chance per turn to move to adjacent sectors
- **Combat**: NPCs can engage in ship-to-ship battles (fighters, missiles, shields)
- **Economy**: NPCs have credits (500-2000 on creation) but no active economic participation
- **Power Calculation**: Based on hull/shields/weapons + credits/20 + kills*1000 + (player-owned ports/planets*2500 for player only)

### Limitations
- No trading at ports or spaceports
- No equipment upgrades or ship purchases
- No resource management or cargo operations
- No long-term strategic behavior
- No faction-specific AI patterns
- Placeholder-only direct NPC trading
- Static power levels (only increases via kills)

### Existing Actions
- Move randomly around the galaxy
- Engage in combat when encountered
- Can be scanned for information
- Have faction affiliations
- Accumulate kills to increase power

## Proposed NPC Intelligence Enhancements

### Economic Participation
**Trading at Ports**
- NPCs visit ports based on faction needs (e.g., Duran buy ore/tech, Vinari buy exotic resources)
- Automated buy/sell decisions based on cargo capacity and credit availability
- Faction-specific trading preferences and behaviors
- Port ownership mechanics: NPCs can attempt to capture unowned ports

**Resource Management**
- NPCs maintain cargo inventories
- Strategic resource acquisition for faction goals
- Black market participation for rare items
- Supply chain disruption tactics (e.g., Vinari blocking trade routes)

### Ship and Equipment Upgrades
**Hardware Upgrades**
- Visit spaceports for equipment purchases (fighters, missiles, scanners)
- Computer level upgrades for better hacking/defense
- Warp drive installation for faster movement
- Fuel management and refueling

**Ship Progression**
- Gradual ship class upgrades (Interceptor → Frigate → Cruiser)
- Credit accumulation through trading and bounties
- Salvage operations for upgrade materials
- Faction-specific upgrade paths

### Combat and Strategic Behavior
**Enhanced Combat AI**
- Tactical retreat when damaged
- Formation flying with allied NPCs
- Ambush tactics in asteroid fields
- Hit-and-run attacks on weaker targets

**Territorial Control**
- Patrol faction-controlled sectors
- Defend owned ports and planets
- Aggressive expansion into neutral territories
- Alliance formations between NPCs

### Intelligence and Learning
**Adaptive Behavior**
- Learn from combat encounters (avoid strong players)
- Memory of player tactics and weaknesses
- Reputation system affecting NPC reactions
- Dynamic difficulty scaling based on player progress

**Faction Dynamics**
- Internal faction politics and conflicts
- Trade agreements between factions
- Espionage and sabotage operations
- Technology sharing within factions

## Implementation Goals

### Phase 1: Basic Economic Participation
- Implement NPC port visiting logic
- Add automated trading decisions
- Enable cargo management
- Basic upgrade purchasing

### Phase 2: Advanced AI Behaviors
- Strategic movement patterns
- Combat learning algorithms
- Faction interaction systems
- Dynamic difficulty adjustment

### Phase 3: Full Galaxy Integration
- NPC-driven economy fluctuations
- Political event chains
- Player reputation impacts
- Emergent gameplay scenarios

## Technical Implementation Considerations

### AI Decision Making
- State machines for NPC behavior
- Priority queues for action selection
- Pathfinding for strategic movement
- Memory systems for learned behaviors

### Performance Optimization
- NPC activity throttling based on player proximity
- Batch processing for distant NPCs
- Efficient sector scanning algorithms
- Memory management for NPC data

### Balance Considerations
- NPC growth rate limits to prevent overwhelming players
- Escalating difficulty curves
- Player countermeasures (bounties, alliances)
- Economic impact controls

## Creative NPC Capabilities

### Duran NPCs
- Industrial focus: Build mining operations on planets
- Military expansion: Conquer and fortify ports
- Technology development: Research new weapon systems
- Clan politics: Internal power struggles affecting behavior

### Vinari NPCs
- Mystical exploration: Discover ancient artifacts
- Energy manipulation: Solar array networks for power
- Diplomatic intrigue: Negotiate with other factions
- Psychic abilities: Enhanced scanning and prediction

### Trader NPCs
- Merchant caravans: Protected trade routes
- Black market operations: Illegal goods trading
- Information networks: Intelligence gathering
- Economic manipulation: Market speculation

### Universal NPC Features
- Ghost ship phenomena: Abandoned vessels with valuable cargo
- Pirate activities: Random raids on trade routes
- Bounty hunting: NPCs hunting high-value targets
- Smuggling operations: Hidden cargo runs

## Risks and Challenges

### Gameplay Balance
- Risk of NPCs becoming too powerful too quickly
- Player frustration from aggressive NPC behavior
- Economic instability from NPC trading
- Performance issues with complex AI

### Implementation Complexity
- AI pathfinding in large galaxy
- Memory usage for NPC state tracking
- Synchronization of NPC actions
- Debugging emergent behaviors

### Player Experience
- Learning curve for dealing with smart NPCs
- Potential for "NPC griefing" scenarios
- Need for clear feedback on NPC activities
- Balancing solo vs. multiplayer considerations

## Success Metrics

### Engagement
- Increased player session times
- Higher replayability due to dynamic galaxy
- More strategic decision-making
- Enhanced immersion in faction politics

### Balance
- Consistent difficulty scaling
- Fair economic competition
- Reasonable NPC growth rates
- Player agency preservation

### Technical
- Smooth performance with enhanced NPCs
- Reliable AI behavior patterns
- Minimal bugs in complex interactions
- Scalable architecture for future features

## Conclusion

Enhancing NPC intelligence will transform Cosmic Trader from a static trading game into a living, breathing galaxy where every action has consequences. NPCs that can trade, upgrade, and strategize will create genuine threats and opportunities, making the game world feel alive and responsive to player choices.

The key is implementing these features incrementally, starting with basic economic participation and building toward sophisticated AI behaviors. This approach ensures the game remains balanced and enjoyable while dramatically increasing its depth and replayability.

## File Structure and Implementation Breakdown

### Core NPC Files
- **core/npc.js**: Enhanced movement AI, combat decisions, faction interactions
- **modules/factions.js**: Faction-specific behaviors, diplomacy, territory control
- **ship-definitions.js**: NPC ship creation, upgrade paths, equipment management

### Economic and Trading
- **modules/commerce.js**: NPC trading logic, port interactions, resource management
- **modules/galactic-bank.js** (new): Bank system, interest calculations, persistent storage
- **data/game-data.js**: Update equipment costs, trading parameters for NPCs

### Planet and Territory
- **modules/planets.js**: Mining mechanics, colony management, resource extraction
- **modules/mechanics.js**: Planet claiming combat, territory defense

### UI and State
- **core/state.js**: Add bank data, planet ownership, NPC memory systems
- **modules/ui.js**: Bank interface, planet management screens, NPC status displays

### NPC Capabilities Documentation

#### What NPCs Can Do
- **Movement**: Strategic pathfinding, patrol routes, trade route navigation
- **Trading**: Buy/sell at ports, resource acquisition, black market participation
- **Combat**: Tactical engagements, retreat logic, formation tactics
- **Upgrades**: Equipment purchases, ship class progression, technology acquisition
- **Economy**: Bank deposits/withdrawals, interest accumulation, wealth management
- **Territory**: Planet mining, port claiming, faction expansion
- **Intelligence**: Learn from encounters, adapt to player tactics, reputation tracking

#### What NPCs Cannot Do
- **Meta-game**: Break fourth wall, exploit game mechanics intentionally
- **Instant Actions**: Teleport, infinite resources, god-mode abilities
- **Player Exclusives**: Custom ship naming, manual save/load, direct UI manipulation
- **Overpowered**: One-shot kills, infinite range attacks, perfect accuracy
- **Unrealistic**: Time travel, dimension hopping, reality manipulation

## Implementation Phases

### Phase 1: Foundation (Current Branch)
1. Galactic bank system implementation
2. Basic NPC trading at ports
3. Planet mining mechanics
4. Equipment upgrade expansion
5. NPC equipment upgrades at spaceports (purpose-driven)

### Phase 2: Intelligence
1. Strategic movement AI
2. Combat learning algorithms
3. Faction diplomacy system
4. Reputation and memory systems

### Phase 3: Integration
1. Full NPC economic participation
2. Territory control mechanics
3. Emergent gameplay scenarios
4. Performance optimization

## Next Steps
1. Implement basic NPC trading at ports
2. Add equipment upgrade logic
3. Develop strategic movement AI
4. Test balance and performance
5. Iterate based on player feedback</content>
</xai:function_call/>
<xai:function_call name="run">
<parameter name="command">npm test