declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_NAME: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      JWT_SECRET: string;
      JWT_EXP: string;
      NODE_ENV: string;
    }
  }
}

export interface JwtPayload {
  email: string;
  sub: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload;
  }
}
