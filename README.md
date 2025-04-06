# Expo Boilerplate

A modern, feature-rich boilerplate for building mobile applications with React Native and Expo.

## Features

- React Native with Expo
- TypeScript support
- NativeWind (TailwindCSS for React Native)
- React Navigation 7
- Firebase integration
- Internationalization with i18next
- State management with Zustand and React Query
- tRPC for type-safe APIs
- Supabase integration
- RevenueCat for in-app purchases
- Toast notifications
- PostHog analytics with session replay
- Development tools:
  - ESLint & Prettier
  - Reactotron for debugging

## Prerequisites

- Node.js (v18.18.0 or >=20.0.0)
- Yarn (1.22.x or newer)
- Xcode (for iOS development)
- Android Studio (for Android development)
- EAS CLI (`npm install -g eas-cli`)

## Setup

1. Install dependencies

   ```bash
   yarn install
   ```

2. Configure Firebase:

   - Replace the placeholder `GoogleService-Info.plist` with your actual Firebase configuration file

3. Configure environment variables:

   - Update the variables in `.env` with your specific configuration

4. Update app name and identifiers:

   - Update the app name, slug, and bundle identifiers in `app.json`:

   ```json
   {
     "expo": {
       "name": "YourAppName",
       "slug": "your-app-name",
       "ios": {
         "bundleIdentifier": "com.yourcompany.yourappname"
       },
       "android": {
         "package": "com.yourcompany.yourappname"
       }
     }
   }
   ```

## Running the App

### Development

Start the development server:

```bash
yarn start
```

Run on iOS simulator:

```bash
yarn ios
```

Run on Android emulator:

```bash
yarn android
```

### Debugging

To debug with Reactotron, make sure to have it installed on your development machine. The boilerplate comes pre-configured for Reactotron debugging.

## Building for Production

```bash
# iOS
yarn build:ios:prod

# Android
yarn build:android:prod
```

## Submitting to App Stores

### iOS App Store

1. Build your app for production:

   ```bash
   yarn build:ios:prod
   ```

2. After the build completes, submit to the App Store:
   ```bash
   yarn submit:ios --path /path/to/your/build.ipa
   ```
3. Complete the submission process in App Store Connect.

### Google Play Store

1. Build your app for production:

   ```bash
   yarn build:android:prod
   ```

2. After the build completes, submit to the Play Store:
   ```bash
   yarn submit:android --path /path/to/your/build.apk
   ```
3. Complete the submission process in the Google Play Console.

## Project Structure

```
expoboilerplate/
├── app/                 # Main application code
│   ├── components/      # Reusable components
│   ├── config/          # App configuration
│   ├── contexts/        # React contexts
│   ├── devtools/        # Development tools setup
│   ├── i18n/            # Internationalization
│   ├── libs/            # External libraries setup
│   ├── navigators/      # Navigation setup
│   ├── screens/         # Screen components
│   ├── theme/           # UI theming
│   └── utils/           # Utility functions
├── assets/              # Static assets
├── ios/                 # iOS-specific code
├── android/             # Android-specific code
├── plugins/             # Expo plugins
└── .env                 # Environment variables
```

## Customization

### Theme and Styling

The app uses NativeWind (TailwindCSS) for styling. You can customize the theme in the `tailwind.config.js` file.

## License

This project is licensed under the MIT License.
