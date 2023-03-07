import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/Google';
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },

  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.username = session.user?.name
          ?.split(' ')
          .join('')
          .toLowerCase();
        session.user.uid = token.sub;
        return session;
      }
      return session;
    }
  }
});
