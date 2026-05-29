# UI/UX Patterns - All-in Life Style Dashboard

## Overview
This document documents the UI/UX patterns, design system, and reusable components used throughout the system.

## Visual Design System

### Color Palette

#### Primary Colors
- **Primary**: #fdc838 (Golden Yellow) - Used for system color, highlights
- **Secondary**: Not explicitly defined (likely dark blue/black)
- **Accent**: Various status colors (to be documented)

#### Status Colors
- **Success**: Green (for active/paid status)
- **Warning**: Yellow/Orange (for pending status)
- **Error**: Red (for cancelled/error status)
- **Info**: Blue (for informational status)
- **Neutral**: Gray (for inactive/default status)

#### Background Colors
- **Main Background**: White (#ffffff)
- **Sidebar Background**: Dark (likely #2c3e50 or similar)
- **Card Background**: White (#ffffff)
- **Section Background**: Light gray (#f5f5f5 or similar)

### Typography

#### Font Family
- **Primary**: Sans-serif (likely Arial, Helvetica, or system fonts)
- **Headings**: Bold weight
- **Body**: Regular weight
- **Monospace**: For code/technical data (if used)

#### Font Sizes
- **H1 (Page Title)**: 24px - 32px
- **H2 (Section Title)**: 20px - 24px
- **H3 (Subsection Title)**: 16px - 18px
- **H4 (Card/Group Title)**: 14px - 16px
- **Body Text**: 14px
- **Small Text**: 12px

#### Font Weights
- **Bold**: 700
- **Semibold**: 600
- **Regular**: 400
- **Light**: 300

### Spacing

#### Margin/Padding Scale
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px
- **XXL**: 48px

#### Component Spacing
- **Card Padding**: 16px - 24px
- **Form Field Spacing**: 12px - 16px
- **Button Spacing**: 8px - 12px
- **Table Cell Padding**: 8px - 12px

### Borders and Shadows

#### Border Radius
- **Small**: 4px (buttons, inputs)
- **Medium**: 8px (cards)
- **Large**: 12px (modals)

#### Box Shadows
- **Card Shadow**: 0 2px 8px rgba(0,0,0,0.1)
- **Modal Shadow**: 0 4px 16px rgba(0,0,0,0.2)
- **Button Shadow**: 0 2px 4px rgba(0,0,0,0.1)
- **Hover Shadow**: 0 4px 8px rgba(0,0,0,0.15)

#### Borders
- **Default**: 1px solid #e0e0e0
- **Focus**: 2px solid #fdc838
- **Error**: 1px solid #ff0000

## Layout Patterns

### Main Layout Structure

```
┌─────────────────────────────────────────┐
│ Header (Navigation + User Profile)      │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │    Main Content Area        │
│          │                              │
│ (Fixed)  │    (Scrollable)              │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
│ Footer (Copyright + Developer)         │
└─────────────────────────────────────────┘
```

### Sidebar Layout
- **Width**: Fixed (approximately 250px - 300px)
- **Position**: Fixed left
- **Scrollable**: Yes (if content overflows)
- **Collapsible**: Yes (hamburger menu )
- **Background**: Dark color
- **Text Color**: White

### Main Content Layout
- **Margin**: Left margin for sidebar
- **Padding**: 16px - 24px
- **Max Width**: 100% (fluid)
- **Background**: Light gray

### Header Layout
- **Height**: Fixed (approximately 60px - 80px)
- **Position**: Fixed top
- **Background**: White
- **Shadow**: Small shadow
- **Elements**:
  - Logo (left)
  - Hamburger menu (mobile)
  - User profile (right)
  - Logout button (right)
  - System version (right)

## Component Patterns

### 1. Cards

#### Standard Card
- **Background**: White
- **Border Radius**: 8px
- **Padding**: 16px - 24px
- **Shadow**: Small shadow
- **Border**: 1px solid #e0e0e0

#### Card with Header
- **Header**: Bold title with separator
- **Body**: Content area
- **Footer**: Optional actions

#### Dashboard Card
- **Purpose**: Display KPIs or charts
- **Layout**: Vertical stack
- **Elements**:
  - Title (H4)
  - Separator
  - Content (chart, table, or summary)

#### Menu Card (Gerenciar Bônus, etc.)
- **Purpose**: Navigation to sub-modules
- **Layout**: Icon + Title
- **Click Action**: Navigate to sub-module
- **Hover Effect**: Slight lift or color change

### 2. Tables

#### Standard Table
- **Border Collapse**: Collapse
- **Width**: 100%
- **Background**: White
- **Border**: 1px solid #e0e0e0

#### Table Header
- **Background**: Light gray (#f5f5f5)
- **Text**: Bold
- **Padding**: 8px - 12px
- **Sortable**: Clickable (indicated by cursor)
- **Sort Indicator**: Arrow icon (to be verified)

#### Table Row
- **Background**: White
- **Hover**: Light gray (#f9f9f9)
- **Padding**: 8px - 12px
- **Border Bottom**: 1px solid #e0e0e0
- **Striped**: Alternating row colors (to be verified)

#### Table Cell
- **Padding**: 8px - 12px
- **Vertical Align**: Middle
- **Text Align**: Left (default), Right (numbers)

#### Table Footer
- **Background**: Light gray (#f5f5f5)
- **Text**: Bold
- **Content**: Totals or count

#### Pagination
- **Location**: Below table
- **Alignment**: Right or center
- **Elements**:
  - Previous button ()
  - Page numbers (1, 2, 3, etc.)
  - Next button ()
  - Records per page dropdown

### 3. Forms

#### Form Layout
- **Vertical Stack**: Default
- **Grid Layout**: For related fields (to be verified)
- **Field Spacing**: 12px - 16px vertical

#### Form Groups
- **Label**: Above field
- **Field**: Textbox, combobox, etc.
- **Help Text**: Below field (optional)
- **Error Message**: Below field (on error)

#### Labels
- **Font Weight**: Bold or Semibold
- **Color**: Dark gray
- **Spacing**: 4px - 8px below label
- **Required Indicator**: Asterisk * (to be verified)

#### Textbox
- **Height**: 36px - 40px
- **Border**: 1px solid #e0e0e0
- **Border Radius**: 4px
- **Padding**: 8px - 12px
- **Focus**: Border color change (#fdc838)
- **Placeholder**: Light gray (#999999)

#### Combobox (Dropdown)
- **Height**: 36px - 40px
- **Border**: 1px solid #e0e0e0
- **Border Radius**: 4px
- **Padding**: 8px - 12px
- **Arrow Icon**: Right side
- **Dropdown List**: Max height with scroll

#### Date Picker
- **Height**: 36px - 40px
- **Border**: 1px solid #e0e0e0
- **Border Radius**: 4px
- **Calendar Icon**: Right side ()
- **Format**: DD/MM/YYYY
- **Mask**: Automatic

#### Buttons

##### Primary Button
- **Background**: #fdc838 (primary color)
- **Text Color**: Dark (contrast)
- **Border Radius**: 4px
- **Padding**: 8px - 16px
- **Font Weight**: Bold
- **Hover**: Darker shade
- **Active**: Slightly darker
- **Disabled**: Grayed out

##### Secondary Button
- **Background**: White
- **Text Color**: Dark
- **Border**: 1px solid #e0e0e0
- **Border Radius**: 4px
- **Padding**: 8px - 16px
- **Hover**: Light gray background

##### Icon Button
- **Background**: Transparent
- **Border**: None
- **Padding**: 4px - 8px
- **Hover**: Light gray background
- **Icon**: Font Awesome or similar

##### Link Button
- **Background**: Transparent
- **Border**: None
- **Text Color**: Primary color or blue
- **Text Decoration**: Underline on hover
- **Padding**: 0

### 4. Navigation

#### Sidebar Menu
- **Item Height**: 40px - 48px
- **Padding**: 12px - 16px
- **Icon**: Left side (16px - 20px)
- **Text**: Next to icon
- **Active State**: Background highlight
- **Hover State**: Background color change
- **Border Bottom**: Separator (optional)

#### Breadcrumb
- **Location**: Below header (to be verified)
- **Separator**: / or >
- **Links**: Clickable
- **Current Page**: Not clickable

#### Tabs
- **Location**: Above content (to be verified)
- **Style**: Underline or box
- **Active State**: Highlighted
- **Hover**: Color change

### 5. Modals

#### Modal Overlay
- **Background**: Semi-transparent black (rgba(0,0,0,0.5))
- **Position**: Fixed
- **Z-Index**: High (overlay all content)
- **Animation**: Fade in/out (to be verified)

#### Modal Container
- **Background**: White
- **Border Radius**: 12px
- **Max Width**: 600px - 800px
- **Max Height**: 90vh
- **Overflow**: Auto
- **Shadow**: Large shadow
- **Centered**: Horizontally and vertically

#### Modal Header
- **Padding**: 16px - 24px
- **Border Bottom**: 1px solid #e0e0e0
- **Title**: Bold
- **Close Button**: Top right (×)

#### Modal Body
- **Padding**: 16px - 24px
- **Overflow**: Auto
- **Content**: Form, table, or other content

#### Modal Footer
- **Padding**: 16px - 24px
- **Border Top**: 1px solid #e0e0e0
- **Buttons**: Right aligned
- **Actions**: Cancel, Save, etc.

### 6. Notifications

#### Toast Notifications
- **Position**: Top right or top center
- **Background**: White with colored border
- **Shadow**: Medium shadow
- **Border Radius**: 4px
- **Padding**: 12px - 16px
- **Icon**: Left side (based on type)
- **Close Button**: Right side
- **Auto-Dismiss**: 3 - 5 seconds
- **Animation**: Slide in/out

#### Alert Messages
- **Position**: Inline (above form or table)
- **Background**: Light color based on type
- **Border**: Colored border
- **Border Radius**: 4px
- **Padding**: 12px - 16px
- **Icon**: Left side
- **Dismiss**: Close button

### 7. Loading States

#### Spinner
- **Type**: Circular or dots
- **Color**: Primary color
- **Size**: 16px - 32px
- **Position**: Center of container

#### Skeleton Loading
- **Background**: Light gray (#e0e0e0)
- **Animation**: Pulse or shimmer
- **Shape**: Matches content (rectangles, circles)
- **Duration**: Until content loads

#### Progress Bar
- **Background**: Light gray
- **Fill**: Primary color
- **Height**: 4px - 8px
- **Border Radius**: 2px
- **Animation**: Smooth transition

### 8. Empty States

#### No Data Message
- **Text**: "Nenhum registro encontrado" or similar
- **Icon**: Optional ( or similar)
- **Alignment**: Center
- **Color**: Gray
- **Size**: Large text

#### Placeholder Image
- **Image**: Illustration or icon
- **Text**: Descriptive message
- **Action**: Optional button (e.g., "Add item")
- **Alignment**: Center

### 9. Status Indicators

#### Badges
- **Shape**: Rounded rectangle (pill)
- **Padding**: 4px - 8px
- **Font Size**: Small (12px)
- **Font Weight**: Bold
- **Color**: Based on status
- **Border Radius**: 12px

#### Status Icons
- **Active**: Green checkmark ()
- **Inactive**: Gray or red ()
- **Pending**: Yellow ()
- **Error**: Red ()
- **Featured**: Star (, )

### 10. Icons

#### Icon Library
- **Library**: Font Awesome or similar
- **Size**: 14px - 20px (standard)
- **Color**: Inherit or themed
- **Spacing**: 4px - 8px from text

#### Common Icons
- **Search**: 
- **Edit**: 
- **Delete**: 
- **Add**: 
- **Close**: 
- **Check**: 
- **Star**: , 
- **Download**: 
- **Upload**: 
- **Print**: 
- **Refresh**: 
- **Menu**: 
- **User**: 
- **Settings**: 
- **Home**: 
- **Calendar**: 
- **Email**: 
- **Phone**: 
- **Location**: 
- **Info**: 
- **Warning**: 
- **Error**: 

## Interactive Patterns

### Hover Effects
- **Buttons**: Background color change, slight lift
- **Links**: Underline, color change
- **Cards**: Slight lift, shadow increase
- **Table Rows**: Background color change
- **Icons**: Color change, scale (subtle)

### Focus States
- **Inputs**: Border color change (#fdc838)
- **Buttons**: Outline or color change
- **Links**: Underline
- **Keyboard Navigation**: Visible focus ring

### Active States
- **Buttons**: Pressed effect (darker)
- **Links**: Visited color
- **Menu Items**: Background highlight
- **Tabs**: Underline or box highlight

### Disabled States
- **Buttons**: Grayed out, no hover effect
- **Inputs**: Gray background, not editable
- **Links**: Gray color, not clickable
- **Opacity**: Reduced (0.5 - 0.7)

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: > 1440px

### Mobile Adaptations
- **Sidebar**: Collapsed to hamburger menu
- **Tables**: Horizontal scroll or card view
- **Forms**: Stacked fields
- **Modals**: Full width or larger padding
- **Buttons**: Full width on mobile

### Tablet Adaptations
- **Sidebar**: Collapsible or icon-only
- **Tables**: Responsive columns
- **Forms**: Two-column layout
- **Grid**: Adjusted columns

### Desktop Optimizations
- **Sidebar**: Full width
- **Tables**: All columns visible
- **Forms**: Multi-column layout
- **Grid**: Maximum columns

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate through focusable elements
- **Shift+Tab**: Navigate backwards
- **Enter**: Activate buttons, links
- **Escape**: Close modals, dropdowns
- **Arrow Keys**: Navigate lists, menus

### Screen Reader Support
- **ARIA Labels**: On interactive elements
- **Role Attributes**: On components
- **Live Regions**: For dynamic content
- **Alt Text**: On images

### Color Contrast
- **Text**: Minimum 4.5:1 ratio
- **Large Text**: Minimum 3:1 ratio
- **Interactive Elements**: Minimum 3:1 ratio

### Focus Indicators
- **Visible**: Clear focus ring
- **Color**: High contrast
- **Width**: 2px - 3px

## Animation Patterns

### Transitions
- **Duration**: 200ms - 300ms (standard)
- **Easing**: Ease-in-out
- **Properties**: Color, transform, opacity

### Animations
- **Fade In**: Opacity 0 to 1
- **Slide In**: Transform translate
- **Scale**: Transform scale
- **Pulse**: Opacity oscillation

### Loading Animations
- **Spinner**: Rotate
- **Skeleton**: Shimmer
- **Progress**: Width transition

## Performance Patterns

### Lazy Loading
- **Images**: Load on scroll
- **Components**: Load on demand
- **Data**: Load as needed

### Code Splitting
- **Routes**: Separate bundles
- **Components**: Dynamic imports
- **Libraries**: Tree shaking

### Caching
- **Static Assets**: Browser cache
- **API Responses**: Service worker or memory
- **Components**: Memoization

## Security Patterns

### Input Sanitization
- **XSS Prevention**: Escape user input
- **HTML Encoding**: Convert special characters
- **URL Encoding**: Encode parameters

### CSRF Protection
- **Tokens**: Hidden form fields
- **Headers**: Custom header
- **Validation**: Server-side verification

### Content Security Policy
- **Scripts**: Whitelist domains
- **Styles**: Whitelist domains
- **Images**: Whitelist domains
- **Frames**: Whitelist domains

## Browser Compatibility

### Supported Browsers
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Fallbacks
- **Flexbox**: Grid fallback
- **CSS Variables**: Static values
- **ES6**: Transpiled to ES5
- **API**: Polyfills if needed

## Internationalization

### Date/Time Formats
- **Date**: DD/MM/YYYY
- **Time**: HH:MM
- **DateTime**: DD/MM/YYYY HH:MM
- **Month Names**: Portuguese (Janeiro, Fevereiro, etc.)

### Number Formats
- **Decimal**: Comma separator (1.234,56)
- **Thousands**: Dot separator (1.234)
- **Currency**: R$ X.XXX,XX

### Text Direction
- **LTR**: Left-to-right (default)
- **RTL**: Right-to-left (if supported)

## Customization

### Theming
- **Colors**: CSS variables
- **Fonts**: CSS variables
- **Spacing**: CSS variables
- **Border Radius**: CSS variables

### Branding
- **Logo**: Uploadable
- **Colors**: Configurable
- **Favicon**: Uploadable
- **Background**: Uploadable
