# Create-JS-Stack

A modern web application built with Next.js, featuring analytics, features showcase, and real-time analytics from NPM and GitHub APIs. Styled with shadcn/ui components and Tailwind CSS.

## Features

- 🏠 **Home Page** - Project overview and installation instructions
- 📊 **Analytics** - Project statistics and overview widgets
- ⚡ **Features Page** - Comprehensive feature showcase
- 📈 **Analytics Page** - Real-time data from NPM and GitHub APIs
- 🎨 **Modern UI** - Built with shadcn/ui components
- 📱 **Responsive Design** - Works on all screen sizes
- 🌙 **Dark Mode** - Built-in theme support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── github/         # GitHub API integration
│   │   └── npm/            # NPM API integration
│   ├── analytics/          # Analytics page with real data
│   ├── features/           # Features showcase page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── navigation.tsx      # Main navigation component
└── lib/
    └── utils.ts            # Utility functions
```

## Pages

### Home Page (`/`)

- Project introduction and hero section
- Installation instructions for NPM and Yarn
- Project integration guides
- Essential command examples

### Analytics (`/analytics`)

- Project statistics overview
- Recent project activities
- Progress tracking
- Quick action buttons
- Health metrics (issues, PRs)

### Features (`/features`)

- Core capability highlights
- Framework support matrix
- Integrated tools showcase
- Development experience features

### Analytics (`/analytics`)

- Real NPM package download data
- GitHub repository statistics
- Interactive charts and visualizations
- Contributor information
- Release history

## API Routes

### `/api/npm`

Fetches NPM package information including:

- Download statistics (last 7 days)
- Package metadata
- Version information

**Usage**: `/api/npm?package=package-name`

### `/api/github`

Fetches GitHub repository data including:

- Repository statistics (stars, forks, etc.)
- Recent releases
- Top contributors
- Repository metadata

**Usage**: `/api/github?repo=owner/repo-name`

## Customization

### Changing Analytics Targets

Edit the package names in `/src/app/analytics/page.tsx`:

```typescript
const npmPackage = "your-package-name";
const githubRepo = "owner/repo-name";
```

### Adding New Components

Use shadcn/ui CLI to add new components:

```bash
npx shadcn@latest add component-name
```

### Styling

The project uses Tailwind CSS with shadcn/ui theme system. Customize colors and themes in:

- `tailwind.config.js`
- `src/app/globals.css`

## Environment Variables

For higher GitHub API rate limits, add a GitHub token:

```bash
# .env.local
GITHUB_TOKEN=your_github_token_here
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
