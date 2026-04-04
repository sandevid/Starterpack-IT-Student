# Requirements Document

## Introduction

Starterpack IT Student is a mobile-first web application designed for high school students to manage their academic life. The application provides a comprehensive suite of tools including authentication, task management, calendar events, goal tracking, study playlists, and school product recommendations. Built with Next.js 16, Supabase, and Google OAuth, the application enforces a mobile-only design system with a fixed color palette and bottom navigation interface.

## Glossary

- **Application**: The Starterpack IT Student web application
- **User**: A high school student authenticated via Google OAuth
- **Profile**: User account data stored after Google OAuth authentication
- **Calendar_Event**: An academic calendar entry with date, title, notes, and color category
- **Todo**: A task item with title, completion status, and subject tag
- **Goal**: A high-level objective containing nested steps
- **Goal_Step**: A sub-task within a Goal
- **Playlist**: A Spotify playlist reference with URL and metadata
- **Essential**: A school product recommendation with icon, category, and description
- **Server_Action**: Next.js server-side function for data operations
- **RLS**: Row Level Security policy ensuring users access only their own data
- **Bottom_Sheet**: A modal component that slides up from the bottom of the screen
- **Toast**: A temporary notification message for user feedback
- **Tag**: A subject category label (math, english, science, ipa, ips, general)
- **Event_Color**: A color category for calendar events (exam, deadline, event, reminder)
- **Category**: A classification for Essentials (gadget, stationery, fashion, book, general)

## Requirements

### Requirement 1: Google OAuth Authentication

**User Story:** As a high school student, I want to log in with my Google account, so that I can securely access my academic data without creating a new password.

#### Acceptance Criteria

1. THE Application SHALL provide a login page with Google OAuth as the only authentication method
2. WHEN a User successfully authenticates via Google OAuth, THE Application SHALL create a Profile record if one does not exist
3. WHEN a User successfully authenticates, THE Application SHALL redirect them to the home dashboard
4. THE Application SHALL store the User's name, email, and avatar URL from Google OAuth in the Profile
5. THE Application SHALL protect all application routes with authentication middleware
6. WHEN an unauthenticated User attempts to access a protected route, THE Application SHALL redirect them to the login page
7. THE Application SHALL provide a logout function that clears the session and redirects to the login page

### Requirement 2: User Profile Management

**User Story:** As a User, I want my profile to be automatically created and maintained, so that the application can personalize my experience.

#### Acceptance Criteria

1. WHEN a User logs in for the first time, THE Application SHALL automatically create a Profile record with data from Google OAuth
2. THE Profile SHALL store the User's unique identifier, full name, email address, and avatar URL
3. THE Application SHALL enforce RLS policies ensuring Users can only access their own Profile
4. WHEN a User's Google account information changes, THE Application SHALL update the Profile on next login

### Requirement 3: Home Dashboard Display

**User Story:** As a User, I want to see a personalized dashboard when I open the app, so that I can quickly understand my current academic status.

#### Acceptance Criteria

1. THE Application SHALL display a greeting message with the User's name and avatar on the home dashboard
2. THE Application SHALL display quick statistics showing the count of pending Todos, active Goals, and upcoming Calendar_Events
3. THE Application SHALL display a preview of today's Todos limited to the first 5 items
4. THE Application SHALL display a preview of upcoming Calendar_Events limited to the next 3 events
5. WHEN a User has no data in a preview section, THE Application SHALL display an appropriate empty state message
6. THE Application SHALL fetch all dashboard data via Server_Actions with RLS enforcement

### Requirement 4: Academic Calendar Management

**User Story:** As a User, I want to manage my academic calendar with color-coded events, so that I can track exams, deadlines, and important dates.

#### Acceptance Criteria

1. THE Application SHALL display a monthly calendar view using React DayPicker
2. THE Application SHALL display color-coded markers on calendar dates that have Calendar_Events
3. THE Application SHALL use red for exam events, brown for deadline events, gray for event events, and tan for reminder events
4. THE Application SHALL display a list of Calendar_Events below the calendar ordered by date
5. WHEN a User creates a Calendar_Event, THE Application SHALL validate that title is required and date is a valid date
6. WHEN a User creates a Calendar_Event, THE Application SHALL save it via Server_Action and display a success Toast
7. WHEN a User updates a Calendar_Event, THE Application SHALL save changes via Server_Action and display a success Toast
8. WHEN a User deletes a Calendar_Event, THE Application SHALL remove it via Server_Action and display a success Toast
9. THE Application SHALL display Calendar_Event forms in a Bottom_Sheet modal
10. THE Application SHALL provide a color picker in the form with the four Event_Color options
11. THE Application SHALL enforce RLS ensuring Users can only access their own Calendar_Events
12. WHEN a Server_Action fails, THE Application SHALL display an error Toast with a descriptive message

### Requirement 5: To-Do List Management

**User Story:** As a User, I want to manage my tasks with subject tags and completion tracking, so that I can organize my schoolwork effectively.

#### Acceptance Criteria

1. THE Application SHALL display Todos in two collapsible sections: "In Progress" and "Done"
2. THE Application SHALL display incomplete Todos in the "In Progress" section
3. THE Application SHALL display completed Todos in the "Done" section
4. WHEN a User toggles a Todo checkbox, THE Application SHALL update the completion status via Server_Action with optimistic UI updates
5. THE Application SHALL display each Todo with a checkbox, title text, and Tag badge
6. THE Application SHALL support six Tag values: math, english, science, ipa, ips, and general
7. WHEN a User creates a Todo, THE Application SHALL validate that title is required and Tag is one of the six valid values
8. WHEN a User creates a Todo, THE Application SHALL save it via Server_Action and display a success Toast
9. WHEN a User updates a Todo, THE Application SHALL save changes via Server_Action and display a success Toast
10. WHEN a User deletes a Todo, THE Application SHALL remove it via Server_Action and display a success Toast
11. THE Application SHALL display Todo forms in a Bottom_Sheet modal
12. THE Application SHALL enforce RLS ensuring Users can only access their own Todos
13. WHEN a Server_Action fails, THE Application SHALL display an error Toast with a descriptive message
14. WHEN a User has no Todos in a section, THE Application SHALL display an appropriate empty state message

### Requirement 6: Goals Tracker Management

**User Story:** As a User, I want to track big goals with nested steps and progress visualization, so that I can break down large objectives into manageable tasks.

#### Acceptance Criteria

1. THE Application SHALL display Goals as expandable cards
2. THE Application SHALL display a progress bar on each Goal card showing the percentage of completed Goal_Steps
3. WHEN a User expands a Goal card, THE Application SHALL display all associated Goal_Steps
4. THE Application SHALL calculate progress as (completed Goal_Steps / total Goal_Steps) × 100
5. WHEN a User creates a Goal, THE Application SHALL validate that title is required
6. WHEN a User creates a Goal, THE Application SHALL save it via Server_Action and display a success Toast
7. WHEN a User updates a Goal, THE Application SHALL save changes via Server_Action and display a success Toast
8. WHEN a User deletes a Goal, THE Application SHALL remove it and all associated Goal_Steps via Server_Action and display a success Toast
9. THE Application SHALL allow inline creation of Goal_Steps within an expanded Goal card
10. WHEN a User creates a Goal_Step, THE Application SHALL validate that title is required and associate it with the parent Goal
11. WHEN a User creates a Goal_Step, THE Application SHALL save it via Server_Action and display a success Toast
12. WHEN a User toggles a Goal_Step checkbox, THE Application SHALL update the completion status via Server_Action and recalculate the Goal progress
13. WHEN a User deletes a Goal_Step, THE Application SHALL remove it via Server_Action and display a success Toast
14. THE Application SHALL display Goal forms in a Bottom_Sheet modal
15. THE Application SHALL enforce RLS ensuring Users can only access their own Goals and Goal_Steps
16. WHEN a Server_Action fails, THE Application SHALL display an error Toast with a descriptive message
17. WHEN a User has no Goals, THE Application SHALL display an appropriate empty state message

### Requirement 7: Study Playlist Management

**User Story:** As a User, I want to save and organize my Spotify study playlists, so that I can quickly access music that helps me focus.

#### Acceptance Criteria

1. THE Application SHALL display Playlists as a list of cards
2. THE Application SHALL display each Playlist card with a music icon, name, description, and "Open Spotify" button
3. WHEN a User clicks "Open Spotify", THE Application SHALL open the Playlist URL in a new browser tab
4. WHEN a User creates a Playlist, THE Application SHALL validate that name is required and URL matches the pattern "open.spotify.com"
5. WHEN a User creates a Playlist, THE Application SHALL save it via Server_Action and display a success Toast
6. WHEN a User updates a Playlist, THE Application SHALL save changes via Server_Action and display a success Toast
7. WHEN a User deletes a Playlist, THE Application SHALL remove it via Server_Action and display a success Toast
8. THE Application SHALL display Playlist forms in a Bottom_Sheet modal
9. THE Application SHALL enforce RLS ensuring Users can only access their own Playlists
10. WHEN a Server_Action fails, THE Application SHALL display an error Toast with a descriptive message
11. WHEN a User has no Playlists, THE Application SHALL display an appropriate empty state message

### Requirement 8: School Essentials Management

**User Story:** As a User, I want to maintain a list of recommended school products with icons and categories, so that I can remember useful items for my academic needs.

#### Acceptance Criteria

1. THE Application SHALL display Essentials in a 2-column grid layout
2. THE Application SHALL display each Essential card with an icon, name, description, and Category badge
3. THE Application SHALL support ten icon options: Laptop, Headphones, BookOpen, Pen, Backpack, Watch, Glasses, Coffee, Package, and Star
4. THE Application SHALL support five Category values: gadget, stationery, fashion, book, and general
5. WHEN a User creates an Essential, THE Application SHALL validate that name is required, icon is one of the ten valid options, and Category is one of the five valid values
6. WHEN a User creates an Essential, THE Application SHALL save it via Server_Action and display a success Toast
7. WHEN a User updates an Essential, THE Application SHALL save changes via Server_Action and display a success Toast
8. WHEN a User deletes an Essential, THE Application SHALL remove it via Server_Action and display a success Toast
9. THE Application SHALL display Essential forms in a Bottom_Sheet modal with icon and Category selectors
10. THE Application SHALL enforce RLS ensuring Users can only access their own Essentials
11. WHEN a Server_Action fails, THE Application SHALL display an error Toast with a descriptive message
12. WHEN a User has no Essentials, THE Application SHALL display an appropriate empty state message

### Requirement 9: Bottom Navigation

**User Story:** As a User, I want persistent bottom navigation, so that I can quickly switch between different sections of the app.

#### Acceptance Criteria

1. THE Application SHALL display a bottom navigation bar with five tabs: Home, Calendar, Tasks, Goals, and More
2. THE Application SHALL keep the bottom navigation visible and sticky at all times
3. WHEN a User taps a navigation tab, THE Application SHALL navigate to the corresponding page
4. THE Application SHALL highlight the active tab in the bottom navigation
5. THE Application SHALL use Lucide React icons for all navigation tab icons

### Requirement 10: Mobile-First Design System

**User Story:** As a User, I want a consistent mobile-optimized interface, so that the app works well on my phone.

#### Acceptance Criteria

1. THE Application SHALL enforce a maximum width of 430px for all layouts
2. THE Application SHALL use the color palette: Space Cadet (#25344F), Slate Gray (#617891), Tan (#D5B893), Coffee (#6F4D38), Caput (#632024), and Cream (#F5F0E8)
3. THE Application SHALL use Cream (#F5F0E8) as the background color
4. THE Application SHALL use rounded corners of 14px for all card components
5. THE Application SHALL use only Lucide React SVG icons throughout the interface
6. THE Application SHALL NOT display emoji characters in any UI element

### Requirement 11: Form Validation and Error Handling

**User Story:** As a User, I want clear feedback when I submit forms, so that I know if my data was saved successfully or if there are errors.

#### Acceptance Criteria

1. THE Application SHALL validate all form inputs using Zod schemas before submission
2. WHEN form validation fails, THE Application SHALL display inline error messages for each invalid field
3. WHEN a User submits a form, THE Application SHALL disable the submit button and show a loading state
4. WHEN a Server_Action succeeds, THE Application SHALL display a success Toast, close the form modal, and refresh the data
5. WHEN a Server_Action fails, THE Application SHALL display an error Toast with a descriptive message and keep the form open
6. THE Application SHALL use React Hook Form for all form state management

### Requirement 12: Data Security and Privacy

**User Story:** As a User, I want my data to be private and secure, so that other students cannot see my academic information.

#### Acceptance Criteria

1. THE Application SHALL enforce Row Level Security policies on all database tables
2. THE RLS policies SHALL ensure Users can only read, create, update, and delete their own records
3. THE Application SHALL perform all database operations through Server_Actions
4. THE Application SHALL validate User authentication before executing any Server_Action
5. WHEN an unauthenticated request is made, THE Application SHALL return an authentication error

### Requirement 13: Reusable Component Library

**User Story:** As a developer, I want reusable UI components, so that the interface remains consistent and maintainable.

#### Acceptance Criteria

1. THE Application SHALL provide a Modal component that implements Bottom_Sheet behavior
2. THE Application SHALL provide an EmptyState component for displaying empty list messages
3. THE Application SHALL provide a PageHeader component for consistent page titles
4. THE Application SHALL provide a Card component with the standard 14px border radius
5. THE Application SHALL provide a Button component with consistent styling and loading states
6. THE Application SHALL use these components consistently across all modules

### Requirement 14: Performance and User Experience

**User Story:** As a User, I want the app to feel fast and responsive, so that I can quickly manage my academic tasks.

#### Acceptance Criteria

1. WHEN a User toggles a Todo or Goal_Step checkbox, THE Application SHALL update the UI optimistically before the Server_Action completes
2. WHEN a Server_Action is in progress, THE Application SHALL display appropriate loading indicators
3. THE Application SHALL use React Hot Toast for all notification messages
4. THE Application SHALL automatically dismiss success Toast messages after 3 seconds
5. THE Application SHALL keep error Toast messages visible until manually dismissed

### Requirement 15: Calendar Event Parsing and Formatting

**User Story:** As a User, I want my calendar events to be stored and displayed correctly, so that I don't miss important dates.

#### Acceptance Criteria

1. WHEN a User selects a date in the calendar form, THE Application SHALL format it using date-fns before saving
2. WHEN the Application displays Calendar_Events, THE Application SHALL parse stored dates using date-fns
3. FOR ALL valid Calendar_Event dates, formatting then parsing SHALL produce an equivalent date value (round-trip property)
4. THE Application SHALL display dates in a human-readable format (e.g., "January 15, 2024")
5. THE Application SHALL sort Calendar_Events by date in ascending order

### Requirement 16: Data Integrity and Consistency

**User Story:** As a User, I want my data to remain consistent, so that the app accurately reflects my academic status.

#### Acceptance Criteria

1. WHEN a User deletes a Goal, THE Application SHALL also delete all associated Goal_Steps (cascade delete)
2. WHEN the Application calculates Goal progress, THE Application SHALL ensure the percentage is between 0 and 100
3. WHEN a User marks all Goal_Steps as complete, THE Application SHALL display 100% progress
4. WHEN a User has no Goal_Steps in a Goal, THE Application SHALL display 0% progress
5. THE Application SHALL maintain referential integrity between Goals and Goal_Steps via foreign key constraints
6. WHEN a User toggles a Todo checkbox multiple times rapidly, THE Application SHALL process all state changes in order without data loss

### Requirement 17: URL Validation for External Links

**User Story:** As a User, I want to ensure my Spotify playlist links are valid, so that the "Open Spotify" button works correctly.

#### Acceptance Criteria

1. WHEN a User enters a Playlist URL, THE Application SHALL validate that it contains "open.spotify.com"
2. WHEN a Playlist URL is invalid, THE Application SHALL display a validation error message
3. WHEN a User clicks "Open Spotify", THE Application SHALL open the URL in a new browser tab using target="\_blank"
4. THE Application SHALL add rel="noopener noreferrer" to all external links for security

### Requirement 18: Empty State Guidance

**User Story:** As a User, I want helpful messages when lists are empty, so that I understand what actions I can take.

#### Acceptance Criteria

1. WHEN a User has no Todos, THE Application SHALL display an empty state with a message encouraging them to create their first task
2. WHEN a User has no Calendar_Events, THE Application SHALL display an empty state with a message encouraging them to add an event
3. WHEN a User has no Goals, THE Application SHALL display an empty state with a message encouraging them to set a goal
4. WHEN a User has no Playlists, THE Application SHALL display an empty state with a message encouraging them to add a playlist
5. WHEN a User has no Essentials, THE Application SHALL display an empty state with a message encouraging them to add a product
6. THE Application SHALL display empty states using the EmptyState component with consistent styling

### Requirement 19: Collapsible Section State Management

**User Story:** As a User, I want to collapse completed tasks and expand goal details, so that I can focus on what's most relevant.

#### Acceptance Criteria

1. THE Application SHALL allow Users to toggle the "Done" section in the Todo list between collapsed and expanded states
2. WHEN the "Done" section is collapsed, THE Application SHALL hide completed Todos and display a count of hidden items
3. THE Application SHALL allow Users to toggle Goal cards between collapsed and expanded states
4. WHEN a Goal card is collapsed, THE Application SHALL hide Goal_Steps and show only the Goal title and progress bar
5. WHEN a Goal card is expanded, THE Application SHALL display all Goal_Steps with checkboxes
6. THE Application SHALL persist section states in component state (not database)

### Requirement 20: Icon Selection Interface

**User Story:** As a User, I want to choose icons for my school essentials, so that I can visually organize my product recommendations.

#### Acceptance Criteria

1. WHEN a User creates or edits an Essential, THE Application SHALL display a selector with all ten icon options
2. THE Application SHALL render each icon option using the corresponding Lucide React component
3. WHEN a User selects an icon, THE Application SHALL highlight the selected option
4. THE Application SHALL store the icon name as a string in the database
5. WHEN displaying an Essential, THE Application SHALL dynamically render the correct Lucide React icon based on the stored name
