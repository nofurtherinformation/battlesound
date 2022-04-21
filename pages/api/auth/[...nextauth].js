import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import Auth0Provider from "next-auth/providers/auth0";
const providerMapping = {
	"https://accounts.google.com": "google"
}
const AuthOptions = {
	providers: [
		Auth0Provider({
		  clientId: process.env.AUTH0_CLIENT_ID,
		  clientSecret: process.env.AUTH0_CLIENT_SECRET,
		  issuer: process.env.AUTH0_ISSUER
		}),
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
			console.log(url, baseUrl)
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
	},
	debug: true
}

export default NextAuth(AuthOptions)