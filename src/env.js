import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        CLERK_SECRET_KEY: z.string(),
        PUSHER_APP_SECRET: z.string(),
        PUSHER_APP_ID: z.string(),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),

        DATABASE_HOST: z.string(),
        DATABASE_PORT: z.string(),
        DATABASE_USER: z.string(),
        DATABASE_PASSWORD: z.string(),
        DATABASE_NAME: z.string(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
        NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string(),
        NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string(),
        NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
        NEXT_PUBLIC_PUSHER_CLUSTER: z.string(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,

        // Clerk
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
        NEXT_PUBLIC_CLERK_SIGN_IN_URL:
            process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
        NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL:
            process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
        NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL:
            process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,

        // Pusher
        NEXT_PUBLIC_PUSHER_APP_KEY: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
        NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
        PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
        PUSHER_APP_ID: process.env.PUSHER_APP_ID,

        // Database connection details
        DATABASE_HOST: process.env.DATABASE_HOST,
        DATABASE_PORT: process.env.DATABASE_PORT,
        DATABASE_USER: process.env.DATABASE_USER,
        DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
        DATABASE_NAME: process.env.DATABASE_NAME,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
     * `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});
