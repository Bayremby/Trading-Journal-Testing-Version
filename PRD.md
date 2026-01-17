# Product Requirements Document (PRD)
## Silence Journal - Trading Psychology Journal

**Version:** 1.0  
**Date:** 2024  
**Product:** Silence Journal  
**Target Audience:** ICT (Inner Circle Trader) traders focused on psychology, discipline, and reflective journaling

---

## 1. Executive Summary

### 1.1 Product Overview
Silence Journal is a minimalist, purpose-built trading journal application designed specifically for ICT traders. Unlike traditional trading journals that focus primarily on profits and metrics, Silence Journal emphasizes psychology, discipline, and reflective journaling to help traders develop better mental frameworks and trading habits.

### 1.2 Product Vision
To create a trading journal that helps traders understand their psychology, maintain discipline, and learn from every trade through structured reflection rather than just tracking profits.

### 1.3 Key Differentiators
- **Psychology-First Approach**: Focus on mental state, discipline, and rule adherence
- **ICT-Specific**: Built for Inner Circle Trader methodology
- **Minimalist Design**: Clean, distraction-free interface
- **Reflection-Driven**: Structured reflection prompts for deeper learning
- **Rule-Based Analytics**: Track and analyze rule violations for psychological insights

---

## 2. Product Goals & Objectives

### 2.1 Primary Goals
1. Help traders maintain discipline through rule tracking and violation analytics
2. Enable deep reflection on trading decisions and psychology
3. Provide actionable insights into trading behavior patterns
4. Support multiple trading systems/models within a single journal
5. Create a calm, focused environment for journaling

### 2.2 Success Metrics
- User engagement: Daily active users
- Trade entry completion rate
- Reflection quality (measured by text length and depth)
- Rule adherence improvement over time
- User retention (30-day, 90-day)

---

## 3. User Personas

### 3.1 Primary Persona: The Disciplined ICT Trader
- **Age:** 25-45
- **Experience:** Intermediate to advanced trader
- **Goals:** Improve discipline, reduce rule violations, understand trading psychology
- **Pain Points:** 
  - Lack of structured reflection
  - Difficulty tracking rule adherence
  - Need for psychology-focused analytics
  - Multiple trading systems to manage

### 3.2 Secondary Persona: The Learning Trader
- **Age:** 20-35
- **Experience:** Beginner to intermediate
- **Goals:** Learn from mistakes, build good habits, track progress
- **Pain Points:**
  - Overwhelmed by complex trading journals
  - Need for clear structure and guidance
  - Want to understand what went wrong/right

---

## 4. Core Features & Functionality

### 4.1 Dashboard (Overview Page)

#### 4.1.1 Overview Metrics
- **Total Equity (R)**: Cumulative realized R from all trades
- **Win Rate**: Percentage of winning trades
- **Performance Activity Chart**: Equity curve visualization showing progression over time
- **Recent Activity**: List of recent trades with quick access to review

#### 4.1.2 Filtering & Search
- Search trades by instrument/pair
- Date range filtering (start date, end date)
- Clear filters functionality

#### 4.1.3 Visual Design
- Clean, minimalist interface
- Dark/Light theme support
- Smooth animations and transitions
- Responsive grid layouts

**User Flow:**
1. User lands on dashboard after login
2. Views key metrics at a glance
3. Can filter/search recent trades
4. Click on any trade to review details

---

### 4.2 Trade Entry Modal

#### 4.2.1 Step 1: Trade Basics
**Required Fields:**
- **Instrument**: Single-select from user-configured list (e.g., EURUSD, GBPUSD, NASDAQ, ES, GOLD, USDJPY)
- **Sessions**: Multi-select from user-configured sessions (e.g., London, New York, Pre-NY, Asia)
- **Trade Outcome**: Win / Break Even / Loss
- **Date**: Trade date picker
- **System**: Select trading system/model
- **Risk %**: Risk percentage per trade
- **RR (Risk/Reward)**: Expected risk-reward ratio
- **Realized R**: Automatically calculated based on outcome:
  - **Winner**: `Risk % × RR` (e.g., 2% × 2 = 4R)
  - **Break Even**: Always 0R
  - **Loss**: `-Risk %` (e.g., -1%)

**User Flow:**
1. Click floating "+" button or "New Entry" button
2. Select instrument from grid
3. Select one or more sessions
4. Choose trade outcome (Win/BE/Loss)
5. Fill in date, system, risk, and RR
6. Realized R auto-calculates
7. Proceed to Step 2

#### 4.2.2 Step 2: Visuals & Model Checks
**Screenshots:**
- Upload multiple screenshots (Entry/HTF/Result)
- Image preview with delete functionality
- Drag-and-drop or click to upload

**Model Checks:**
- Checklist of active rules from selected trading system
- Each rule can be checked/unchecked
- Visual indication of rules followed vs. violated

**Custom Criteria:**
- Multi-select options based on system configuration
- Custom questions and checklists defined per system

**User Flow:**
1. Upload screenshots (optional)
2. Review and check off rules followed
3. Complete custom criteria for the system
4. Proceed to Step 3

#### 4.2.3 Step 3: Reflection
**Reflection Fields:**
- **Draw on Liquidity?**: Where was price attracted to?
- **HTF Narrative**: The story behind the setup
- **What Went Well**: Strengths in execution
- **Mistakes to Correct**: Specific behavioral or tactical flaws
- **Lesson Learned**: The single biggest takeaway (highlighted field)

**User Flow:**
1. Fill in liquidity draw analysis
2. Write HTF narrative
3. Reflect on what went well
4. Identify mistakes (highlighted section)
5. Extract key lesson
6. Save trade entry

#### 4.2.4 Edit & Delete
- Edit existing trades (opens same modal with pre-filled data)
- Delete trades with confirmation
- All fields editable after creation

---

### 4.3 Trade Review Modal

#### 4.3.1 Trade Details Display
- Complete trade information in read-only view
- Screenshots gallery
- Rules followed/violated status
- Custom criteria responses
- Full reflection text

#### 4.3.2 Actions
- **Edit**: Opens trade entry modal with pre-filled data
- **Delete**: Remove trade with confirmation
- **Close**: Return to previous view

**User Flow:**
1. Click on trade from dashboard or trades list
2. Review all trade details
3. Option to edit or delete
4. Close to return

---

### 4.4 Trades Page

#### 4.4.1 View Modes
- **Table View**: 
  - Columns: Date, Pair, System, Realized R, Actions
  - Sortable by date
  - Click row to review trade
  
- **Calendar View**:
  - Monthly calendar layout
  - Trades displayed on their respective dates
  - Color-coded by outcome (Win/Loss/BE)
  - Click date to add new trade
  - Click trade to review

#### 4.4.2 Navigation
- Month navigation (previous/next)
- Current month indicator
- Quick add trade button

**User Flow:**
1. Navigate to Trades page
2. Choose view mode (Table/Calendar)
3. Browse trades
4. Click to review or add new

---

### 4.5 Trading Systems Page

#### 4.5.1 System Management
- **Multiple Systems**: Create and manage multiple trading systems/models
- **System List**: Sidebar with all systems
- **Active System**: Selected system displayed in main panel
- **Create New**: Build new trading system from scratch
- **Edit Name**: Inline editing of system name
- **Delete System**: Remove system (with confirmation)

#### 4.5.2 Hard Rules Section
- **Rule List**: All rules for the active system
- **Active/Inactive Toggle**: Enable/disable rules
- **Add Rule**: Type and press Enter to add new rule
- **Delete Rule**: Remove rule from system
- **Visual States**: 
  - Active rules: Normal text
  - Inactive rules: Strikethrough, grayed out

**Rule Structure:**
- Rule ID (auto-generated)
- Rule text (user-defined)
- Active status (boolean)

#### 4.5.3 Confluence Spec Section
- **Custom Criteria**: System-specific properties/questions
- **Types**:
  - **Question**: Text input with optional guidance
  - **Checklist**: Multiple checkable items
  - **Multi-select**: Select multiple options from list

**Property Builder:**
- Select type (Question/Checklist/Multi-select)
- Enter title/description
- For Questions: Add optional internal note/guidance
- For Checklist/Multi-select: Define options list
- Save property to system

**User Flow:**
1. Select system from sidebar
2. View/edit Hard Rules
3. Add/edit Confluence Spec properties
4. Rules and criteria appear in trade entry modal

---

### 4.6 Settings Page

#### 4.6.1 Appearance
- **Theme Selection**: 
  - Light Mode
  - Dark Mode
- Theme persists across sessions
- Immediate visual update

#### 4.6.2 Risk Management
- **Default Risk Per Trade**: Set default risk percentage
- Used as default in trade entry modal
- Editable per trade

#### 4.6.3 Tracked Instruments
- **Instrument List**: Display all configured instruments
- **Add Instrument**: Add new trading pairs/instruments
- **Remove Instrument**: Delete instrument from list
- Instruments appear in trade entry modal selector

#### 4.6.4 Trading Sessions
- **Session List**: Display all configured trading sessions
- **Add Session**: Add new session (e.g., London, New York, Asia)
- **Remove Session**: Delete session from list
- Sessions appear as multi-select in trade entry modal

**User Flow:**
1. Navigate to Settings
2. Change theme (immediate effect)
3. Adjust default risk
4. Manage instruments list
5. Manage sessions list
6. Changes saved automatically

---

### 4.7 Data Storage

#### 4.7.1 Local Storage
- All data stored in browser localStorage
- No backend/server required
- Data persists across sessions

#### 4.7.2 Data Structure
- **Trades**: Array of trade objects
- **Settings**: User preferences and configurations
- **Recaps**: Weekly recap data (future feature)

#### 4.7.3 Data Migration
- Automatic migration for new fields
- Backward compatibility maintained
- Default values for missing data

---

## 5. Technical Specifications

### 5.1 Technology Stack
- **Framework**: React 19.2.3
- **Language**: TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **Routing**: React Router DOM 7.12.0
- **Charts**: Recharts 3.6.0
- **Icons**: Lucide React 0.562.0
- **Styling**: Tailwind CSS (utility-first)

### 5.2 Architecture
- **Component-Based**: Modular React components
- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: localStorage API
- **No Backend**: Fully client-side application

### 5.3 Key Components
- `App.tsx`: Main application container, routing, state management
- `Layout.tsx`: Sidebar navigation, theme toggle
- `Dashboard.tsx`: Overview page with metrics and charts
- `Trades.tsx`: Trade list with table/calendar views
- `TradeEntryModal.tsx`: Multi-step trade entry form
- `TradeReviewModal.tsx`: Trade detail view
- `TradingSystem.tsx`: System management interface
- `Settings.tsx`: User preferences and configuration

### 5.4 Utilities
- `storage.ts`: LocalStorage abstraction layer
- `math.ts`: Metrics calculation (win rate, equity curve, etc.)
- `constants.ts`: Default values and initial settings

### 5.5 Type Definitions
- Comprehensive TypeScript interfaces
- Type-safe data structures
- Trade, UserSettings, TradingSystemModel, etc.

---

## 6. User Experience (UX) Requirements

### 6.1 Design Principles
1. **Minimalism**: Clean, uncluttered interface
2. **Focus**: Emphasize psychology and reflection
3. **Calm**: Soothing colors and animations
4. **Clarity**: Clear visual hierarchy
5. **Efficiency**: Quick access to common actions

### 6.2 Visual Design
- **Color Scheme**: 
  - Light: White backgrounds, black text, subtle grays
  - Dark: Deep blacks, white text, subtle grays
  - Accent colors: Emerald (wins), Rose (losses), Slate (break even)
- **Typography**: Bold, uppercase labels; clear hierarchy
- **Spacing**: Generous padding and margins
- **Borders**: Subtle, rounded corners (2rem+ radius)
- **Shadows**: Soft, minimal shadows for depth

### 6.3 Animations
- Fade-in on page load
- Slide-up for cards
- Scale on hover/interaction
- Smooth transitions (300-500ms)
- Stagger animations for lists

### 6.4 Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg
- Grid layouts adapt to screen size
- Touch-friendly button sizes
- Modal full-screen on mobile

### 6.5 Accessibility
- Keyboard navigation support
- Focus states visible
- Semantic HTML
- ARIA labels where needed
- Color contrast compliance

---

## 7. Functional Requirements

### 7.1 Trade Entry
- **FR-1**: User must be able to create a new trade entry
- **FR-2**: User must select instrument from configured list
- **FR-3**: User must be able to select multiple sessions
- **FR-4**: User must select trade outcome (Win/BE/Loss)
- **FR-5**: Realized R must auto-calculate based on outcome, risk, and RR
- **FR-6**: User must be able to upload multiple screenshots
- **FR-7**: User must be able to check/uncheck rules from selected system
- **FR-8**: User must complete custom criteria for selected system
- **FR-9**: User must be able to save trade entry
- **FR-10**: User must be able to edit existing trade
- **FR-11**: User must be able to delete trade with confirmation

### 7.2 Trading Systems
- **FR-12**: User must be able to create multiple trading systems
- **FR-13**: User must be able to add/edit/delete rules
- **FR-14**: User must be able to toggle rules active/inactive
- **FR-15**: User must be able to create custom criteria (Question/Checklist/Multi-select)
- **FR-16**: User must be able to edit system name
- **FR-17**: User must be able to delete system (with confirmation)

### 7.3 Settings
- **FR-18**: User must be able to switch between light/dark theme
- **FR-19**: User must be able to set default risk percentage
- **FR-20**: User must be able to add/remove instruments
- **FR-21**: User must be able to add/remove sessions
- **FR-22**: All settings must persist across sessions

### 7.4 Dashboard
- **FR-23**: Dashboard must display total equity (R)
- **FR-24**: Dashboard must display win rate percentage
- **FR-25**: Dashboard must display equity curve chart
- **FR-26**: Dashboard must display recent trades list
- **FR-27**: User must be able to filter trades by date range
- **FR-28**: User must be able to search trades by instrument

### 7.5 Data Persistence
- **FR-29**: All trades must be saved to localStorage
- **FR-30**: All settings must be saved to localStorage
- **FR-31**: Data must persist across browser sessions
- **FR-32**: Data migration must handle missing fields gracefully

---

## 8. Non-Functional Requirements

### 8.1 Performance
- **NFR-1**: Page load time < 2 seconds
- **NFR-2**: Trade entry modal opens < 500ms
- **NFR-3**: Smooth 60fps animations
- **NFR-4**: Handle 1000+ trades without performance degradation

### 8.2 Reliability
- **NFR-5**: No data loss (localStorage reliability)
- **NFR-6**: Graceful error handling
- **NFR-7**: Data validation on input

### 8.3 Usability
- **NFR-8**: Intuitive navigation (no training required)
- **NFR-9**: Clear visual feedback for all actions
- **NFR-10**: Consistent design language throughout

### 8.4 Compatibility
- **NFR-11**: Support modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-12**: Responsive on mobile devices
- **NFR-13**: Works offline (no internet required)

---

## 9. Future Enhancements (Roadmap)

### 9.1 Phase 2 Features
- **Psychology Tab in Systems**: Rule violation analytics
  - Most violated rules
  - Performance impact of violations
  - Violation trends over time
  - Psychology insights and recommendations

- **Weekly Recaps**: 
  - Weekly review and reflection
  - Patient behavior tracking
  - Model respect tracking
  - Behavior improvement goals

### 9.2 Phase 3 Features
- **Export/Import**: 
  - Export trades to CSV/JSON
  - Import trades from other journals
  - Backup/restore functionality

- **Advanced Analytics**:
  - Performance by instrument
  - Performance by session
  - Performance by system
  - Correlation analysis

### 9.3 Phase 4 Features
- **Cloud Sync**: Optional cloud backup
- **Mobile App**: Native mobile application
- **Collaboration**: Share systems with other traders
- **Templates**: Pre-built system templates

---

## 10. Success Criteria

### 10.1 User Adoption
- 80% of users complete first trade entry
- 60% of users create at least one custom system
- 40% of users use reflection fields consistently

### 10.2 Engagement
- Average 3+ trades logged per week per active user
- 70% of users return within 7 days
- Average session duration > 5 minutes

### 10.3 Quality
- 90% of trades include reflection text
- 80% of trades have rules checked
- User satisfaction score > 4/5

---

## 11. Risks & Mitigations

### 11.1 Technical Risks
- **Risk**: localStorage size limits
  - **Mitigation**: Implement data compression, archive old trades

- **Risk**: Browser compatibility
  - **Mitigation**: Test on all major browsers, use polyfills if needed

### 11.2 User Experience Risks
- **Risk**: Complex multi-step entry process
  - **Mitigation**: Clear progress indicators, save drafts, skip optional steps

- **Risk**: Data loss concerns
  - **Mitigation**: Export functionality, clear backup instructions

### 11.3 Product Risks
- **Risk**: Low user engagement
  - **Mitigation**: Onboarding flow, helpful tooltips, reminder notifications

---

## 12. Glossary

- **ICT**: Inner Circle Trader methodology
- **R (Risk Units)**: Standardized risk measurement (1R = risk amount)
- **RR**: Risk/Reward ratio
- **HTF**: Higher Time Frame
- **FVG**: Fair Value Gap
- **POI**: Point of Interest
- **Realized R**: Actual R achieved from trade (calculated as Risk% × RR for wins, -Risk% for losses, 0 for break even)
- **Equity Curve**: Cumulative R over time
- **Hard Rules**: Non-negotiable trading rules
- **Confluence Spec**: Custom criteria for trade setup validation

---

## 13. Appendix

### 13.1 Realized R Calculation Formula
- **Winner**: `Realized R = Risk % × RR`
  - Example: Risk 2%, RR 2 → Realized R = 4
- **Break Even**: `Realized R = 0` (always)
- **Loss**: `Realized R = -Risk %`
  - Example: Risk 1% → Realized R = -1

### 13.2 Default Values
- **Default Risk**: 0.5%
- **Default RR**: 2.0
- **Default Instruments**: EURUSD, GBPUSD, NASDAQ, ES, GOLD, USDJPY
- **Default Sessions**: London, New York, Pre-NY, Asia

### 13.3 Data Models
See `types.ts` for complete TypeScript interfaces:
- Trade
- UserSettings
- TradingSystemModel
- Rule
- Criterion
- WeeklyRecap

---

**Document Status**: Active  
**Last Updated**: 2024  
**Next Review**: Quarterly
