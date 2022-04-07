import NextAuth from 'next-auth'
import GoogleProvider from "next-auth/providers/google"

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
	debug: true
}

export default NextAuth(AuthOptions)