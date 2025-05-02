# Expo Boilerplate

A modern, feature-rich monorepo boilerplate for building mobile and web applications, leveraging Turborepo, Expo, and Next.js.

## Features

- **Monorepo:** [Turborepo](https://turborepo.org) for optimized build and development workflows.
- **Mobile:** React Native with [Expo](https://expo.dev/) SDK.
- **Web:** [Next.js](https://nextjs.org/) 14+ App Router.
- **Styling:** [NativeWind](https://www.nativewind.dev/) (TailwindCSS for React Native) & [Tailwind CSS](https://tailwindcss.com/) for web.
- **API:** [tRPC](https://trpc.io/) for end-to-end typesafe APIs.
- **Database:** [Prisma](https://www.prisma.io/) with Supabase/Postgres.
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (setup required for full Expo integration).
- **Navigation:**
  - Mobile: [React Navigation](https://reactnavigation.org/)
  - Web: Next.js App Router
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) and [React Query](https://tanstack.com/query/latest).
- **Internationalization:** [i18next](https://www.i18next.com/).
- **Additional Features:** RevenueCat, Toast notifications, PostHog analytics.
- **Tooling:** Shared ESLint, Prettier, TypeScript configurations.

## Prerequisites

- Node.js (v22.14.0 or newer)
- Xcode (for iOS development)
- Android Studio (for Android development)
- EAS CLI (`pnpm install -g eas-cli`)

## Project Structure

```text
.
├── .github/
│   └─ workflows/ (CI examples)
├── apps/
│   ├── native/  # Expo SDK App (React Native)
│   └── web/     # Next.js App
├── packages/
│   ├── api/     # tRPC router definition
│   ├── db/      # Prisma schema and client
├── tooling/
│   ├── eslint/
│   ├── github/
│   ├── prettier/
│   ├── tailwind/ (Shared config for NativeWind & Tailwind CSS)
│   └── typescript/ (Shared tsconfig.json)
├── .env          # Local environment variables (gitignored)
├── .env.example  # Example environment variables
├── .gitignore
├── .nvmrc
├── .npmrc        # Specifies strict-peer-dependencies=false
├── LICENSE
├── package.json  # Root workspace config
├── pnpm-lock.yaml
├── pnpm-workspace.yaml # Defines workspace packages
└── turbo.json    # Turborepo pipeline configuration
```

> Package names might use a placeholder like `@acme/`. You can find-and-replace `@acme/` with your own organization or project name (e.g., `@your-company/` or `@project-name/`).

## Getting Started

1.  **Install Dependencies:**

    ```bash
    pnpm install
    ```

2.  **Setup Firebase Project**

    a. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

    b. Set up iOS app:

    - Click "Add app" and select iOS
    - Enter your iOS bundle ID (e.g., `com.yourcompany.yourapp`)
    - Download the `GoogleService-Info.plist` file
    - Place it in `apps/native` directory

    c. Set up Android app:

    - Click "Add app" and select Android
    - Enter your Android package name (e.g., `com.yourcompany.yourapp`)
    - Download the `google-services.json` file
    - Place it in `apps/native` directory

    d. Set up service account for backend:

    - Go to Project Settings > Service accounts
    - Click "Generate new private key" for your Firebase project
    - Save the generated JSON file (e.g., `google-service-account-file.json`) securely
    - Place it in `packages/api` directory

3.  **Configure Environment Variables:**

    ```bash
    # Copy the example environment file
    cp .env.example .env

    # Update .env with your specific keys and secrets
    ```

    Important Firebase-related environment variables:

    ```bash
    # Local development
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/google-service-account-file.json

    # Production (based on `google-service-account-file.json`)
    GOOGLE_CLOUD_PROJECT=
    GOOGLE_CLOUD_PRIVATE_KEY=
    GOOGLE_CLOUD_CLIENT_EMAIL=
    ```

4.  **Configure App Settings:**

    - Update your app configuration in `apps/native/app.json` (like name, bundle identifier)
    - Set up EAS build configuration in `apps/native/eas.json` (like apple app id, apple team id)
    - Update Firebase config (`GoogleService-Info.plist`) in `apps/native/ios/` and potentially Android equivalents.
    - Review and update API URLs or other settings in `apps/native/src/config/` files if necessary (though prefer environment variables).

5.  **Database Setup:**

    ```bash
    # Push the Prisma schema to your database
    # Ensure your DATABASE_URL is correctly set in .env
    pnpm --filter @acme/db db:migrate
    ```

## Development

Run the development servers for all apps simultaneously:

```bash
pnpm dev
```

This command uses Turborepo to start the development processes defined in the `package.json` of each app (`apps/native`, `apps/web`).

- **Expo (`apps/native`):** By default, this starts the Expo development server. You can press `i` for the iOS simulator or `a` for the Android emulator in the terminal.
- **Next.js (`apps/web`):** This will start the web server with Turbopack on `http://localhost:3000`.

To run the development server for a specific app:

```bash
# Run only the native app
pnpm --filter @acme/native dev

# Run only the web app
pnpm --filter @acme/web dev
```

For native Android development with ADB reverse port forwarding:

```bash
pnpm --filter @acme/native adb
```

### Database Operations

For database management, the following commands are available:

```bash
# Start Prisma Studio - a visual database explorer
pnpm --filter @acme/db db:studio

# Run database migrations in development
pnpm --filter @acme/db db:migrate

# Deploy migrations in production
pnpm --filter @acme/db db:migrate:prod

# Generate Prisma client and format schema
pnpm --filter @acme/db generate-schemas
```

## Building for Production

Build all apps for production:

```bash
pnpm build
```

To build a specific app:

```bash
# Build only the web app
pnpm --filter @acme/web build

# Build iOS native app (uses EAS build)
pnpm --filter @acme/native build:ios

# Build Android native app (uses EAS build)
pnpm --filter @acme/native build:android
```

## Deployment

### Web (`apps/web`)

Deploy the Next.js application to a hosting provider like [Vercel](https://vercel.com), [Netlify](https://www.netlify.com/), or others supporting Node.js.

**Deploying to Vercel (Recommended):**

1.  Connect your Git repository to Vercel.
2.  When importing the project, set the **Root Directory** to `apps/web`. Vercel should automatically detect Next.js and configure the build settings.
3.  Add your production environment variables in the Vercel project settings.
4.  Deploy! Vercel handles the build process using Turborepo's remote caching if configured.

> **Note:** The deployed web application often serves as the backend API (tRPC) for the native app in production. Ensure the native app's configuration points to the correct production URL.

### Native (`apps/native`)

Deploying the Expo app involves building standalone binaries and submitting them to the Apple App Store and Google Play Store using Expo Application Services (EAS).

1.  **Configure Production API URL:** Ensure your native app points to your deployed web app's URL for API calls in production. This might involve modifying a configuration file or using environment variables via EAS Secrets. Check `apps/native/src/utils/api.ts` or similar for base URL logic.

2.  **EAS Setup (if not already done):**

    ```bash
    # Install EAS CLI globally if you haven't already
    pnpm install -g eas-cli

    # Log in to your Expo account
    eas login
    ```

3.  **Create a Production Build:**

    ```bash
    # Build for iOS locally (creates an .ipa file)
    pnpm --filter @acme/native build:ios

    # Build for Android locally (creates an .apk or .aab file)
    pnpm --filter @acme/native build:android
    ```

    > These commands use the `production` profile defined in `apps/native/eas.json`.

4.  **Submit to Stores:** Use EAS Submit to upload your builds.

    ```bash
    # Submit the latest iOS build (provide the path to the .ipa file)
    pnpm --filter @acme/native submit:ios /path/to/your/app.ipa

    # Submit the latest Android build (provide the path to the .aab file)
    pnpm --filter @acme/native submit:android /path/to/your/app.aab
    ```

    > Complete the submission process in App Store Connect and Google Play Console.

## Tooling

This monorepo includes shared configurations for essential development tools:

- **TypeScript:** Base and shared configurations in `tooling/typescript`.
- **ESLint:** Shared linting rules in `tooling/eslint`. Run `pnpm lint`.
- **Prettier:** Shared code formatting rules in `tooling/prettier`. Run `pnpm format`.
- **Tailwind CSS:** Shared configuration potentially used by both NativeWind (`apps/native`) and Tailwind CSS (`apps/web`) in `tooling/tailwind`.

```bash
# Run linting on all packages
pnpm lint

# Format all files
pnpm format

# Type check all packages
pnpm typecheck
```

### Clean

Often times you'll need to clean the cache and start fresh. This will remove all `node_modules` and other cache files.

```bash
pnpm clean
```

## Attributions

This project is inspired by Create T3 App.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
