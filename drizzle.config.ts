import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
    schema: "./src/server/db/schema.ts",
    dialect: "singlestore",
    tablesFilter: ["my-music_*"],
    dbCredentials: {
        host: env.DATABASE_HOST as string,
        port: parseInt(env.DATABASE_PORT as string),
        user: env.DATABASE_USER as string,
        password: env.DATABASE_PASSWORD as string,
        database: env.DATABASE_NAME as string,
        ssl: {},
    },
} satisfies Config;
