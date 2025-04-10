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

2.  **Configure Environment Variables:**

    ```bash
    # Copy the example environment file
    cp .env.example .env

    # Update .env with your specific keys and secrets
    ```

3.  **Configure App Settings:**
    - Update app name, slug, identifiers in `apps/native/app.json`.
    - Update Firebase config (`GoogleService-Info.plist`) in `apps/native/ios/` and potentially Android equivalents.
    - Review and update API URLs or other settings in `apps/native/src/config/` files if necessary (though prefer environment variables).

4.  **Database Setup:**

    ```bash
    # Push the Prisma schema to your database
    # Ensure your DATABASE_URL is correctly set in .env
    pnpm db:push --filter @acme/db
    ```

## Development

Run the development servers for all apps simultaneously:

```bash
pnpm dev
```

This command uses Turborepo to start the development processes defined in the `package.json` of each app (`apps/native`, `apps/web`).

- **Expo (`apps/native`):** By default, this might start the Metro bundler. You might need to press `i` for the iOS simulator or `a` for the Android emulator in the Metro terminal window.
- **Next.js (`apps/web`):** This will typically start the web server on `http://localhost:3000`.

To run the development server for a specific app:

```bash
# Run only the native app
pnpm dev --filter native

# Run only the web app
pnpm dev --filter web
```

## Building for Production

Build all apps for production:

```bash
pnpm build
```

To build a specific app:

```bash
# Build only the native app (triggers EAS build setup if configured)
pnpm build --filter native

# Build only the web app
pnpm build --filter web
```

For native builds, you'll likely use EAS Build (see Deployment section).

## Deployment

### Web (`apps/web`)

Deploy the Next.js application to a hosting provider like [Vercel](https://vercel.com), [Netlify](https://www.netlify.com/), or others supporting Node.js.

**Deploying to Vercel (Recommended):**

1.  Connect your Git repository to Vercel.
2.  When importing the project, set the **Root Directory** to `apps/web`. Vercel should automatically detect Next.js and configure the build settings.
3.  Add your production environment variables (like `DATABASE_URL`, `AUTH_SECRET`, etc.) in the Vercel project settings.
4.  Deploy! Vercel handles the build process using Turborepo's remote caching if configured.

> **Note:** The deployed web application often serves as the backend API (tRPC) for the native app in production. Ensure the native app's configuration points to the correct production URL.

### Native (`apps/native`)

Deploying the Expo app involves building standalone binaries and submitting them to the Apple App Store and Google Play Store using Expo Application Services (EAS).

1.  **Configure Production API URL:** Ensure your native app points to your deployed web app's URL for API calls in production. This might involve modifying a configuration file or using environment variables via EAS Secrets. Check `apps/native/src/utils/api.ts` or similar for base URL logic.

2.  **EAS Setup (if not already done):**

    ```bash
    # Install EAS CLI globally if you haven't already
    pnpm add -g eas-cli

    # Log in to your Expo account
    eas login

    # Configure EAS Build within the native app directory
    cd apps/native
    eas build:configure
    cd ../.. # Return to root
    ```

3.  **Create a Production Build:**

    ```bash
    # Build for iOS (creates an .ipa file)
    pnpm build --filter native -- --platform ios --profile production
    # or run from the native dir: eas build --platform ios --profile production

    # Build for Android (creates an .apk or .aab file)
    pnpm build --filter native -- --platform android --profile production
    # or run from the native dir: eas build --platform android --profile production
    ```

    > EAS Build uses build profiles defined in `apps/native/eas.json`. The `production` profile is used by default if `--profile` is omitted.

4.  **Submit to Stores:** Use EAS Submit to upload your builds.

    ```bash
    # Submit the latest iOS build
    cd apps/native
    eas submit --platform ios --latest
    cd ../..

    # Submit the latest Android build
    cd apps/native
    eas submit --platform android --latest
    cd ../..
    ```

    > You can also use `--auto-submit` with `eas build`. Complete the submission process in App Store Connect and Google Play Console.

5.  **Over-the-Air (OTA) Updates (Optional but Recommended):** Use EAS Update to push JavaScript and asset changes directly to users without needing a new store submission.

    ```bash
    # Configure EAS Update (run once)
    cd apps/native
    pnpm expo install expo-updates
    eas update:configure
    cd ../..

    # Publish an update (after making JS/asset changes)
    cd apps/native
    eas update --auto # Uses current git branch/commit message
    cd ../..
    ```

    > Remember to create and submit a new native build via `eas build` whenever you add new native modules or change native configurations.

## Tooling

This monorepo includes shared configurations for essential development tools:

- **TypeScript:** Base and shared configurations in `tooling/typescript`.
- **ESLint:** Shared linting rules in `tooling/eslint`. Run `pnpm lint`.
- **Prettier:** Shared code formatting rules in `tooling/prettier`. Run `pnpm format`.
- **Tailwind CSS:** Shared configuration potentially used by both NativeWind (`apps/native`) and Tailwind CSS (`apps/web`) in `tooling/tailwind`.

## Attributions

This project is inspired by Create T3 App.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
