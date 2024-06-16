import AuthService from '@web/shared/services/AuthService';
import { NextAuthOptions } from 'next-auth';
import NextAuth, { getServerSession } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoggleProvider from 'next-auth/providers/google';
import { getTextFromError } from '@web/shared/lib/getTextFromError';
import { EAuthErrorType } from '@web/shared/types/enums/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthRole } from '@web/features/Auth/lib/getAuthRole';

const statusToErrorCode: Record<number, EAuthErrorType> = {
  401: EAuthErrorType.WRONG_CREDENTIALS,
  409: EAuthErrorType.ALREADY_EXIST,
};

const credProvider = CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'email', type: 'text' },
    password: { label: 'Password', type: 'password' },
    role: { label: 'role', type: 'text' },
    isNew: { label: 'isNew' },
  },
  // @ts-ignore
  async authorize({ email, password, role, isNew } = {}, req) {
    if (!email || !password) return null;
    const isSignUp = Boolean(role && isNew === 'true');
    try {
      const data = await AuthService[isSignUp ? 'signup' : 'login'](
        email,
        password,
        role,
      );
      return AuthService.toNextAuth(data);
    } catch (e: any) {
      const errorString =
        (e?.response?.status &&
          statusToErrorCode[e.response.status as number]) ||
        (await getTextFromError(e));

      throw new Error(errorString);
    }
  },
});
export const authOptions: NextAuthOptions = {
  pages: { signIn: '/signin' },
  secret: process.env.AUTH_SECRET,
  providers: [],
  callbacks: {
    async signIn({ user }) {
      if (user.error) {
        return `/auth/signin?error=${user.error}`;
      }
      return true;
    },

    async jwt({ token, user }) {
      return { ...user?.apiAuth, ...token, ...user };
    },

    async session({ token, session }) {
      session.apiUser = token.apiUser;
      session.apiTokens = token.apiTokens;

      return session;
    },
  },
};

export const getAuth = async () => getServerSession(authOptions);

type CombineRequest = Request & NextApiRequest;
type CombineResponse = Response & NextApiResponse;

async function auth(req: CombineRequest, res: CombineResponse) {
  return await NextAuth(req, res, {
    ...authOptions,
    providers: [
      GoggleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        async profile(profile, tokens) {
          const { sub: id, name, email, picture: image } = profile;
          const baseData = { id, name, email, image };
          const role = getAuthRole(req);
          try {
            const data = await AuthService.googleByToken(
              tokens.id_token!,
              role,
            );
            return { ...baseData, apiAuth: AuthService.toNextAuth(data) };
          } catch (e: any) {
            return { ...baseData, error: await getTextFromError(e) };
          }
        },
        authorization: {
          params: {
            userType: 'user',
          },
        },
      }),
      credProvider,
    ],
  });
}

export { auth as GET, auth as POST };
