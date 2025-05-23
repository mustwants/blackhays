# Project Structure

## Overview
Modern React application built with Vite, TypeScript, and Tailwind CSS for a defense consulting platform.

## Tech Stack
- React 18.3.1
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Supabase
- Lucide React (icons)
- MapBox GL

## Directory Structure

```
/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── admin/            # Admin-specific components 
│   │   │   ├── AdminUserManagement.tsx # Admin user management
│   │   │   ├── CompanySubmissions.tsx  # Company submissions management
│   │   │   ├── ConsortiumSubmissions.tsx # Consortium submissions management 
│   │   │   └── InnovationSubmissions.tsx # Innovation submissions management
│   │   │
│   │   ├── AdminPanel.tsx   # Admin dashboard
│   │   ├── CallToAction.tsx # CTA sections
│   │   ├── Conferences.tsx  # Events/conferences display
│   │   ├── ConsultantApplication.tsx # Advisor application form
│   │   ├── ConsultantMap.tsx # MapBox integration for advisor locations
│   │   ├── FloatingActionMenu.tsx    # Floating action button
│   │   ├── Footer.tsx       # Site footer with admin access
│   │   ├── Hero.tsx        # Hero section
│   │   ├── Mission.tsx     # Mission statement section
│   │   ├── NavBar.tsx      # Navigation bar
│   │   ├── NewsCard.tsx    # News article display component
│   │   ├── NewsFilter.tsx  # News filtering component
│   │   ├── NewsletterSignup.tsx # Newsletter subscription modal
│   │   ├── NewsletterSubscribers.tsx # Newsletter subscriber management
│   │   ├── Services.tsx    # Services section
│   │   └── Team.tsx        # Team section
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAdvisors.ts  # Advisor data management
│   │   ├── useAuth.ts      # Authentication
│   │   └── useEvents.ts    # Events data management
│   │
│   ├── lib/               # Core utilities
│   │   ├── auth.ts        # Authentication utilities
│   │   └── supabaseClient.ts # Supabase client configuration
│   │
│   ├── pages/             # Route components
│   │   ├── AccessibilityPage.tsx # Accessibility statement page
│   │   ├── AddCompanyPage.tsx # Add company form page
│   │   ├── AddConsortiumPage.tsx # Add consortium form page
│   │   ├── AddInnovationPage.tsx # Add innovation org form page
│   │   ├── AdminPage.tsx    # Admin dashboard page wrapper
│   │   ├── AdminPanel.tsx   # Admin panel route component
│   │   ├── ConsortiumsPage.tsx # Consortiums info
│   │   ├── ConsultantApplication.tsx # Advisor application
│   │   ├── DmcaPage.tsx    # DMCA policy page
│   │   ├── DoDSmallBusinessPage.tsx # DoD small business info
│   │   ├── EventsPage.tsx   # Events listing
│   │   ├── HomePage.tsx     # Main landing page
│   │   ├── InnovationPage.tsx # Innovation info
│   │   ├── NewsPage.tsx     # News updates
│   │   ├── PrivacyPage.tsx  # Privacy policy page
│   │   ├── SubmitEventPage.tsx # Event submission form
│   │   └── TermsPage.tsx    # Terms and conditions page
│   │
│   ├── services/          # API and data services
│   │   ├── advisors/      # Advisor-related API calls
│   │   ├── api/           # Base API configuration
│   │   ├── auth/          # Authentication service
│   │   ├── events/        # Event-related API calls
│   │   └── news/          # News feed service
│   │
│   ├── App.tsx           # Root component
│   ├── index.css         # Global styles
│   ├── main.tsx          # Application entry point
│   └── vite-env.d.ts     # Vite type declarations
│
├── supabase/
│   └── migrations/       # Database migrations
│
├── public/              # Static assets
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Key Features

### Authentication
- Email/password authentication via Supabase
- Admin panel access control
- Protected routes

### Database Schema
- Events table
- Event submissions
- Advisor applications
- Newsletter subscribers
- Company submissions
- Consortium submissions
- Innovation submissions

### Components
1. **Navigation**
   - Responsive navbar
   - Floating action menu
   - Footer with admin access

2. **Landing Page**
   - Hero section
   - Services overview
   - Mission statement
   - Upcoming events
   - Team section
   - Call to action

3. **Admin Panel**
   - Event submission management
   - Advisor application review
   - Newsletter subscriber management
   - Company submission management
   - Consortium submission management
   - Innovation submission management
   - Admin user management

4. **Forms**
   - Advisor application
   - Event submission
   - Newsletter signup
   - Company submission
   - Consortium submission
   - Innovation submission

### Styling
- Tailwind CSS for styling
- Custom color scheme:
  - Primary: bhred (#dc2626)
  - Grays: bhgray-100 through bhgray-900

### Third-party Integrations
- MapBox for advisor location mapping
- Calendly for consultation scheduling
- Supabase for database and authentication
- PDF export for DoD checklist

## Development

### Environment Variables
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### Admin Access
The default admin credentials are:
- Email: admin@example.com
- Password: Admin1967

### Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint