# Environment Variable Management

This directory contains the configuration for typed environment variables using react-native-config.

## Setup

1. Create environment files in the root directory:

   - `.env` - Default environment variables
   - `.env.development` - Development-specific variables
   - `.env.staging` - Staging-specific variables
   - `.env.production` - Production-specific variables

2. Add your environment variables to these files with this format:

   ```
   API_URL=https://api.example.com
   API_KEY=your_api_key
   APP_ENV=development
   DEBUG=true
   TIMEOUT=5000
   ```

3. When adding new environment variables:
   - Add the type definition in `env.types.ts`
   - Add the parsing logic in `env.config.ts`

## Usage

Import the typed environment variables in your components:

```typescript
import { env, isProduction } from 'src/shared/config';

// Use the typed environment variables
const apiUrl = env.API_URL;
const timeout = env.TIMEOUT;

// Use helper functions
if (!isProduction()) {
  console.log('Debug info:', env);
}
```

## Environment Switching

For iOS, specify the environment when building:

```
ENVFILE=.env.production react-native run-ios
```

For Android, specify in gradle:

```
android {
  defaultConfig {
    ...
    resValue "string", "build_config_package", "com.yourapp"
  }

  productFlavors {
    dev {
      ...
      buildConfigField "String", "ENVFILE", '"' + project.rootProject.file(".env.development").toString() + '"'
    }
    staging {
      ...
      buildConfigField "String", "ENVFILE", '"' + project.rootProject.file(".env.staging").toString() + '"'
    }
    prod {
      ...
      buildConfigField "String", "ENVFILE", '"' + project.rootProject.file(".env.production").toString() + '"'
    }
  }
}
```

## Security Note

Never commit sensitive environment variables (API keys, secrets) to version control. Use `.env.local` files for local development (add these to .gitignore).
