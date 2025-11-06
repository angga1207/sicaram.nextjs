# SICARAM Next.js Development Guide

## Project Overview
SICARAM (Sistem Informasi Caram) is a government information system for Ogan Ilir region built with Next.js 14. It's a role-based dashboard application for managing regional performance data, budget realization, and administrative workflows.

## Architecture & Key Patterns

### Application Structure
- **Framework**: Next.js 14 with TypeScript, using Pages Router (not App Router)
- **State Management**: Redux Toolkit with theme configuration slice in `store/`
- **Authentication**: NextAuth.js with custom credentials provider
- **UI Framework**: Tailwind CSS with custom components in `components/`
- **Icons**: FontAwesome Pro icons throughout the application

### Role-Based Access Control
The application uses role-based navigation and features controlled by `CurrentUser?.role_id`. Key roles:
- Role 1: Super Admin (access to all features)
- Role 9: PD (Regional Device) - limited dashboard access
- Roles 2-8: Various administrative levels with specific permissions

Check `components/Layouts/Sidebar.tsx` for complete role mapping patterns.

### API Integration Patterns
- **Base Configuration**: All APIs configured in `apis/serverConfig.tsx` with `BaseUri()` function
- **Authentication Headers**: APIs use Bearer tokens from NextAuth session via `getSession()`
- **Error Handling**: Standard error response format with status/message structure
- **Example Pattern**:
```tsx
const session = await getSession();
const CurrentToken = session?.user?.name;
const res = await axios.get(baseUri + '/endpoint', {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CurrentToken}`,
    },
});
```

### Component Patterns

#### Custom Input Components
- `InputRupiah`: Currency input with formatting and validation
- `InputRupiahRealisasi`: Specialized for budget realization data
- `DisplayMoney`: Consistent money display formatting

#### Layout System
- `DefaultLayout`: Main application wrapper with sidebar, header, footer
- Responsive sidebar with role-based menu items
- Theme switching (light/dark) via Redux state

#### Icon Usage
Use FontAwesome icons consistently:
```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpecificIcon } from '@fortawesome/free-solid-svg-icons';
<FontAwesomeIcon icon={faSpecificIcon} className='group-hover:!text-primary shrink-0' />
```

### Development Workflow

#### Running the Application
```bash
npm run dev          # Development server
npm run prod         # Production build and start
npm run customprod   # Custom production on port 3003
```

#### Important Configuration Files
- `theme.config.tsx`: Global theme settings (locale: 'id', theme: 'light', etc.)
- `ni18n.config.ts.js`: Internationalization config supporting Indonesian/English
- `next.config.js`: Next.js config with custom environment variables

### State Management
- Global theme state in `store/themeConfigSlice.tsx`
- Local component state for user data, loading states, and form data
- Session management via NextAuth with cookie-based user data

### Styling Conventions
- Tailwind CSS with custom utility classes
- Dark mode support via theme switching
- Consistent spacing and component sizing
- Custom CSS in `styles/` directory for specific component styling

### Data Flow Patterns
1. **Page loads** → Check authentication status → Set page title via Redux
2. **API calls** → Extract token from session → Make authenticated request → Handle response
3. **Role checking** → Access `CurrentUser` from cookies → Conditional rendering based on `role_id`

### Firebase Integration
- Firebase messaging for push notifications
- Configuration in `utils/firebase/firebase.ts`
- Used for real-time updates and notifications

### Common Gotchas
- Always check `role_id` before rendering sensitive components
- Use `BaseUri()` function for all API endpoints (configured for different environments)
- Session token is stored in `session?.user?.name` (not standard placement)
- User data is duplicated in both NextAuth session and browser cookies
- Version displayed in sidebar footer: check `APP_VERSION` constant

### File Naming Conventions
- Pages: `index.tsx` for default routes, `[slug].tsx` for dynamic routes
- Components: PascalCase, organized by feature in subdirectories
- APIs: Descriptive names like `fetchdashboard.tsx`, `realisasi_apis.tsx`
- Use `.tsx` extension for all React components and pages

When adding new features, follow the established patterns for role-based access, API integration, and component structure. Always test with different user roles to ensure proper access control.
