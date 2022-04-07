import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
const providerMapping = {
	"https://accounts.google.com": "google"
}
const AuthOptions = {
	providers: [
		GoogleProvider({
		  clientId: process.env.GOOGLE_ID,
		  clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	theme: {
	  colorScheme: "light",
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async redirect({ url, baseUrl }) {
			return baseUrl
		},
		async session({ session, user, token }) {
			return session
		},
		async jwt({ token, user, account, profile, isNewUser }) {
			return token
		},
		async signIn({ user, account, profile, email, credentials }) {
			if (process.env.ALLOWLIST_USERS.split(';').includes(`${providerMapping[profile.iss]}:${profile.email}`)){
				return true
			} else {
				return false
			}
		}
	}
}

export default NextAuth(AuthOptions)