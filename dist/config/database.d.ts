import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<{
    log: ("query" | "warn" | "error")[];
}, "query" | "warn" | "error", import("@prisma/client/runtime/library").DefaultArgs>;
export declare const connectDatabase: () => Promise<void>;
export declare const disconnectDatabase: () => Promise<void>;
export declare const checkDatabaseHealth: () => Promise<{
    status: string;
    connected: boolean;
    error?: never;
} | {
    status: string;
    connected: boolean;
    error: unknown;
}>;
//# sourceMappingURL=database.d.ts.map