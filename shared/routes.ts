import { z } from 'zod';
import { 
  insertUserSchema, 
  insertSubscriptionSchema, 
  insertGroupSchema,
  insertTransactionSchema,
  subscriptions,
  wallets,
  transactions,
  groups
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.object({ id: z.number(), username: z.string() }),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.object({ id: z.number(), username: z.string() }),
        401: z.object({ message: z.string() }),
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.object({ id: z.number(), username: z.string() }).nullable(),
      },
    },
  },
  wallet: {
    get: {
      method: 'GET' as const,
      path: '/api/wallet',
      responses: {
        200: z.custom<typeof wallets.$inferSelect>(),
      },
    },
    deposit: {
      method: 'POST' as const,
      path: '/api/wallet/deposit',
      input: z.object({ amount: z.coerce.number().positive() }),
      responses: {
        200: z.custom<typeof wallets.$inferSelect>(),
      },
    },
    transactions: {
      method: 'GET' as const,
      path: '/api/wallet/transactions',
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
      },
    },
  },
  subscriptions: {
    list: {
      method: 'GET' as const,
      path: '/api/subscriptions',
      responses: {
        200: z.array(z.custom<typeof subscriptions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/subscriptions',
      input: insertSubscriptionSchema,
      responses: {
        201: z.custom<typeof subscriptions.$inferSelect>(),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/subscriptions/:id',
      input: insertSubscriptionSchema.partial(),
      responses: {
        200: z.custom<typeof subscriptions.$inferSelect>(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/subscriptions/:id',
      responses: {
        200: z.void(),
      },
    },
  },
  agent: {
    run: {
      method: 'POST' as const,
      path: '/api/agent/run',
      responses: {
        200: z.object({ 
          processed: z.number(), 
          cancelled: z.number(),
          logs: z.array(z.string())
        }),
      },
    },
  },
  groups: {
    list: {
      method: 'GET' as const,
      path: '/api/groups',
      responses: {
        200: z.array(z.custom<typeof groups.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/groups',
      input: z.object({
        name: z.string().min(1, "Group name is required"),
        members: z.array(z.string()).default([]),
      }),
      responses: {
        201: z.custom<typeof groups.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
