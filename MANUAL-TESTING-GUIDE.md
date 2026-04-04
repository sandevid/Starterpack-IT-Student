# Manual Testing Guide - Starterpack IT Student

This guide provides step-by-step instructions for manually testing the application. Follow each section carefully and check off items as you complete them.

## Prerequisites

1. Start the development server: `npm run dev`
2. Open your browser to `http://localhost:3000`
3. Open browser DevTools (F12 or Cmd+Option+I)
4. Set up mobile viewport emulation

## 60.1 Test on Mobile Viewport (430px)

### Setup Mobile Viewport

**Chrome/Edge DevTools:**
1. Press F12 to open DevTools
2. Click the device toolbar icon (Ctrl+Shift+M / Cmd+Shift+M)
3. Select "Responsive" from the device dropdown
4. Set dimensions to **430px width** × **932px height** (iPhone 14 Pro Max)
5. Set DPR (Device Pixel Ratio) to 3

**Firefox DevTools:**
1. Press F12 to open DevTools
2. Click the Responsive Design Mode icon (Ctrl+Shift+M / Cmd+Option+M)
3. Set width to **430px**
4. Set height to **932px**

### Visual Checks

- [ ] **Maximum width constraint**: Verify the app never exceeds 430px width
- [ ] **Content centering**: On wider screens, content should be centered
- [ ] **No horizontal scrolling**: Scroll horizontally - there should be no overflow
- [ ] **Bottom navigation**: Fixed at bottom, always visible, doesn't overlap content
- [ ] **Padding for bottom nav**: Content has bottom padding so nav doesn't cover it
- [ ] **Card border radius**: All cards have 14px rounded corners
- [ ] **Color palette**: Verify colors match design system:
  - Background: Cream (#F5F0E8)
  - Primary text: Space Cadet (#25344F)
  - Secondary text: Slate Gray (#617891)
  - Accent: Tan (#D5B893), Coffee (#6F4D38), Caput (#632024)
- [ ] **Font families**: 
  - Headings use Playfair Display
  - Body text uses Inter
  - Code/labels use JetBrains Mono
- [ ] **Icons**: All icons are Lucide React SVGs (no emoji)
- [ ] **Touch targets**: All buttons/links are at least 44px tall for easy tapping

### Responsive Behavior

Test at different mobile widths:
- [ ] **320px** (iPhone SE): Content should still be readable, no overflow
- [ ] **375px** (iPhone 12/13): Standard mobile experience
- [ ] **430px** (iPhone 14 Pro Max): Maximum mobile width
- [ ] **768px** (Tablet): Should still show mobile layout (max-width constraint)

## 60.2 Test All Navigation Flows

### Bottom Navigation

- [ ] **Home tab**: Tap Home icon → navigates to `/` → Home icon highlighted
- [ ] **Calendar tab**: Tap Calendar icon → navigates to `/calendar` → Calendar icon highlighted
- [ ] **Tasks tab**: Tap Tasks icon → navigates to `/tasks` → Tasks icon highlighted
- [ ] **Goals tab**: Tap Goals icon → navigates to `/goals` → Goals icon highlighted
- [ ] **More tab**: Tap More icon → navigates to `/more` → More icon highlighted

### Navigation State Persistence

- [ ] Active tab remains highlighted after page refresh
- [ ] Browser back button works correctly
- [ ] Browser forward button works correctly
- [ ] Direct URL navigation works (e.g., type `/calendar` in address bar)

### More Menu Navigation

From `/more` page:
- [ ] **Playlists link**: Tap → navigates to `/more/playlists`
- [ ] **Essentials link**: Tap → navigates to `/more/essentials`
- [ ] **Back navigation**: From playlists/essentials → tap More tab → returns to more menu

### Dashboard Quick Links

From home dashboard:
- [ ] **"View All" on Todos**: Navigates to `/tasks`
- [ ] **"View All" on Calendar**: Navigates to `/calendar`
- [ ] Tapping a todo preview item opens edit modal
- [ ] Tapping a calendar event preview opens event details

## 60.3 Test Empty States

### Initial Setup (New User)

If you have existing data, clear it first:
1. Open browser DevTools → Application/Storage tab
2. Find your Supabase database
3. Delete all records from your user's tables

### Empty State Checks

**Home Dashboard:**
- [ ] No todos → Shows "No tasks yet" empty state
- [ ] No calendar events → Shows "No events yet" empty state
- [ ] Stats cards show 0 for all counts

**Calendar Page (`/calendar`):**
- [ ] No events → Shows empty state with calendar icon
- [ ] Empty state message: "No events yet. Add your first academic event!"
- [ ] Calendar still displays (no events marked)

**Tasks Page (`/tasks`):**
- [ ] No todos → Shows empty state with checkbox icon
- [ ] Empty state message: "No tasks yet. Create your first todo!"
- [ ] "In Progress" section shows empty state
- [ ] "Done" section is hidden or shows empty

**Goals Page (`/goals`):**
- [ ] No goals → Shows empty state with target icon
- [ ] Empty state message: "No goals yet. Set your first goal!"

**Playlists Page (`/more/playlists`):**
- [ ] No playlists → Shows empty state with music icon
- [ ] Empty state message: "No playlists yet. Add your first study playlist!"

**Essentials Page (`/more/essentials`):**
- [ ] No essentials → Shows empty state with package icon
- [ ] Empty state message: "No essentials yet. Add your first school product!"

### Empty State Interactions

For each empty state:
- [ ] Icon displays correctly (Lucide React icon)
- [ ] Title is readable (Playfair Display font)
- [ ] Description is helpful
- [ ] "Add" button is present and styled correctly
- [ ] Clicking "Add" button opens the create form modal

## 60.4 Test Error Handling

### Form Validation Errors

**Calendar Event Form:**
- [ ] Submit with empty title → Shows "Title is required" error
- [ ] Submit with no date selected → Shows "Invalid date" error
- [ ] Submit with no color selected → Shows "Color is required" error
- [ ] Enter 101+ character title → Shows "Title too long" error
- [ ] Enter 501+ character notes → Shows "Notes too long" error
- [ ] Errors display inline below the field
- [ ] Errors are red/caput colored
- [ ] Form stays open after validation error

**Todo Form:**
- [ ] Submit with empty title → Shows "Title is required" error
- [ ] Submit with no tag selected → Shows "Tag is required" error
- [ ] Enter 201+ character title → Shows "Title too long" error

**Goal Form:**
- [ ] Submit with empty title → Shows "Title is required" error
- [ ] Enter 201+ character title → Shows "Title too long" error

**Goal Step Form:**
- [ ] Submit with empty step title → Shows "Title is required" error

**Playlist Form:**
- [ ] Submit with empty name → Shows "Name is required" error
- [ ] Submit with invalid URL → Shows "Invalid URL" error
- [ ] Submit with non-Spotify URL → Shows "Must be a Spotify URL" error
- [ ] Enter 101+ character name → Shows "Name too long" error
- [ ] Enter 501+ character description → Shows "Description too long" error

**Essential Form:**
- [ ] Submit with empty name → Shows "Name is required" error
- [ ] Submit with no icon selected → Shows "Icon is required" error
- [ ] Submit with no category selected → Shows "Category is required" error
- [ ] Enter 101+ character name → Shows "Name too long" error
- [ ] Enter 501+ character description → Shows "Description too long" error

### Server Action Errors

Test these by temporarily disconnecting from the internet or stopping Supabase:

- [ ] Create action fails → Shows error toast
- [ ] Update action fails → Shows error toast
- [ ] Delete action fails → Shows error toast
- [ ] Error toast is red/caput colored
- [ ] Error toast message is descriptive
- [ ] Error toast stays visible until dismissed
- [ ] Form stays open after server error (doesn't close)

### Authentication Errors

- [ ] Log out → Redirected to `/login`
- [ ] Try to access `/calendar` while logged out → Redirected to `/login`
- [ ] Try to access `/tasks` while logged out → Redirected to `/login`
- [ ] Try to access any protected route while logged out → Redirected to `/login`

### Network Errors

Simulate slow/offline network:
1. Open DevTools → Network tab
2. Set throttling to "Slow 3G" or "Offline"

- [ ] Form submissions show loading state
- [ ] Loading spinner appears on submit button
- [ ] Button is disabled during submission
- [ ] Timeout errors show appropriate error toast

## 60.5 Test Toast Notifications

### Success Toasts

**Calendar Events:**
- [ ] Create event → Green success toast: "Event created successfully"
- [ ] Update event → Green success toast: "Event updated successfully"
- [ ] Delete event → Green success toast: "Event deleted successfully"
- [ ] Toast auto-dismisses after ~3 seconds
- [ ] Toast appears at top of screen
- [ ] Toast doesn't block important UI

**Todos:**
- [ ] Create todo → Success toast: "Todo created successfully"
- [ ] Update todo → Success toast: "Todo updated successfully"
- [ ] Toggle todo checkbox → Success toast: "Todo updated"
- [ ] Delete todo → Success toast: "Todo deleted successfully"

**Goals:**
- [ ] Create goal → Success toast: "Goal created successfully"
- [ ] Update goal → Success toast: "Goal updated successfully"
- [ ] Delete goal → Success toast: "Goal deleted successfully"
- [ ] Create goal step → Success toast: "Step added successfully"
- [ ] Toggle step checkbox → Success toast: "Step updated"
- [ ] Delete step → Success toast: "Step deleted successfully"

**Playlists:**
- [ ] Create playlist → Success toast: "Playlist created successfully"
- [ ] Update playlist → Success toast: "Playlist updated successfully"
- [ ] Delete playlist → Success toast: "Playlist deleted successfully"

**Essentials:**
- [ ] Create essential → Success toast: "Essential created successfully"
- [ ] Update essential → Success toast: "Essential updated successfully"
- [ ] Delete essential → Success toast: "Essential deleted successfully"

### Error Toasts

- [ ] Validation error → Red error toast with specific message
- [ ] Server error → Red error toast: "Something went wrong"
- [ ] Network error → Red error toast: "Network error"
- [ ] Error toast stays visible until manually dismissed
- [ ] Error toast has close button (X icon)
- [ ] Clicking X dismisses error toast

### Toast Behavior

- [ ] Multiple toasts stack vertically
- [ ] Toasts don't overlap bottom navigation
- [ ] Toasts are readable on mobile (not cut off)
- [ ] Toast animations are smooth (slide in/out)
- [ ] Toasts work correctly in all pages

### Toast Accessibility

- [ ] Toasts are announced by screen readers (check with VoiceOver/NVDA)
- [ ] Toast close button is keyboard accessible (Tab to focus, Enter to close)
- [ ] Toast doesn't trap keyboard focus

## Additional Manual Tests

### Optimistic UI Updates

**Todo Checkbox:**
1. Create a todo
2. Toggle checkbox → UI updates immediately (before server response)
3. Verify checkmark appears instantly
4. Verify todo moves to "Done" section instantly
5. Toggle back → Moves to "In Progress" instantly

**Goal Step Checkbox:**
1. Create a goal with steps
2. Toggle step checkbox → UI updates immediately
3. Verify progress bar updates instantly
4. Toggle all steps → Progress shows 100% instantly

### Collapsible Sections

**Todo "Done" Section:**
- [ ] Initially collapsed by default
- [ ] Shows count: "Done (X items)"
- [ ] Click to expand → Shows all completed todos
- [ ] Click to collapse → Hides completed todos
- [ ] State persists during page session (not after refresh)

**Goal Cards:**
- [ ] Initially collapsed (shows title + progress bar only)
- [ ] Click to expand → Shows all goal steps
- [ ] Click to collapse → Hides goal steps
- [ ] Multiple goals can be expanded simultaneously
- [ ] State persists during page session

### Modal Behavior

**Bottom Sheet Modals:**
- [ ] Modal slides up from bottom smoothly
- [ ] Modal has rounded top corners (20px)
- [ ] Modal has semi-transparent backdrop
- [ ] Clicking backdrop closes modal
- [ ] Clicking X button closes modal
- [ ] Modal prevents body scroll when open
- [ ] Body scroll restored when modal closes
- [ ] Modal is centered horizontally
- [ ] Modal doesn't exceed 430px width

### External Links

**Spotify Playlists:**
- [ ] "Open Spotify" button has external link icon
- [ ] Clicking opens in new tab (target="_blank")
- [ ] Link has rel="noopener noreferrer" for security
- [ ] Link works correctly with valid Spotify URL

### Data Persistence

1. Create data in each module
2. Refresh the page
3. Verify all data persists:
   - [ ] Calendar events still visible
   - [ ] Todos still visible
   - [ ] Goals and steps still visible
   - [ ] Playlists still visible
   - [ ] Essentials still visible

### Progress Calculation

**Goal Progress:**
1. Create a goal with 4 steps
2. Verify progress shows 0%
3. Complete 1 step → Progress shows 25%
4. Complete 2 steps → Progress shows 50%
5. Complete 3 steps → Progress shows 75%
6. Complete 4 steps → Progress shows 100%
7. Uncomplete 1 step → Progress shows 75%

### Calendar Color Coding

1. Create events with different colors:
   - [ ] Exam (red) → Calendar marker is red
   - [ ] Deadline (brown/coffee) → Calendar marker is brown
   - [ ] Event (gray/slate) → Calendar marker is gray
   - [ ] Reminder (tan) → Calendar marker is tan
2. Verify multiple events on same date show all color markers
3. Verify event list shows correct color badge

### Tag Color Coding

Create todos with different tags:
- [ ] Math → Shows math-colored badge
- [ ] English → Shows english-colored badge
- [ ] Science → Shows science-colored badge
- [ ] IPA → Shows IPA-colored badge
- [ ] IPS → Shows IPS-colored badge
- [ ] General → Shows general-colored badge

### Icon Rendering

**Essentials Icons:**
Create essentials with each icon:
- [ ] Laptop icon renders correctly
- [ ] Headphones icon renders correctly
- [ ] BookOpen icon renders correctly
- [ ] Pen icon renders correctly
- [ ] Backpack icon renders correctly
- [ ] Watch icon renders correctly
- [ ] Glasses icon renders correctly
- [ ] Coffee icon renders correctly
- [ ] Package icon renders correctly
- [ ] Star icon renders correctly

### Category Badges

**Essentials Categories:**
- [ ] Gadget → Shows gadget badge
- [ ] Stationery → Shows stationery badge
- [ ] Fashion → Shows fashion badge
- [ ] Book → Shows book badge
- [ ] General → Shows general badge

## Testing Checklist Summary

Mark each section as complete:

- [ ] 60.1 Mobile viewport testing complete
- [ ] 60.2 Navigation flows testing complete
- [ ] 60.3 Empty states testing complete
- [ ] 60.4 Error handling testing complete
- [ ] 60.5 Toast notifications testing complete

## Reporting Issues

If you find any issues during testing, document them with:
1. **Issue description**: What went wrong?
2. **Steps to reproduce**: How to recreate the issue?
3. **Expected behavior**: What should happen?
4. **Actual behavior**: What actually happened?
5. **Screenshot**: If visual issue
6. **Browser/device**: Which browser and viewport size?

## Next Steps

After completing all manual tests:
1. Mark task 60 as complete in tasks.md
2. Proceed to task 61: Run diagnostics and fix issues
3. Address any issues found during manual testing
