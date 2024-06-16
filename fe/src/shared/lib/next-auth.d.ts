import NextAuth from 'next-auth';

type ApiTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

type ApiUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

interface ApiAuth {
  apiUser: ApiUser;
  apiTokens: ApiTokens;
}

declare module 'next-auth' {
  interface User extends NextAuth.User {
    apiAuth?: ApiAuth;
    error?: string;
  }

  interface Session {
    apiUser: ApiAuth['apiUser'];
    apiTokens: ApiAuth['apiTokens'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    apiUser: ApiUser;
    apiTokens: ApiTokens;
  }
}
