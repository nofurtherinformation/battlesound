import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default function auth(...args) {
	console.log('STARTING AUTH')
	// console.log(prisma)
	return NextAuth({
		adapter: PrismaAdapter(prisma),
		providers: [
			EmailProvider({
				server: {
					host: process.env.EMAIL_SERVER_HOST,
					port: process.env.EMAIL_SERVER_PORT,
					auth: {
						user: process.env.EMAIL_SERVER_USER,
						pass: process.env.EMAIL_SERVER_PASSWORD
					}
				},
				from: process.env.EMAIL_FROM
			})
		],
		session: {
			jwt: true,
			maxAge: 7 * 24 * 60 * 60
		},
		jwt: {
			secret: process.env.SECRET,
			encryption: true
		},
		secret: process.env.SECRET,
		debug: true,
		callbacks: {
			async signIn({ user, account, profile, email, credentials }) {
				console.log('SIGNED IN')
				return true
			},
			async redirect({ url, baseUrl }) {
				console.log('REDIRECTED')
				return baseUrl
			},
			async session({ session, user, token }) {
				console.log('SESSION CREATED')
				return session
			},
			async jwt({ token, user, account, profile, isNewUser }) {
				console.log('TOKEN GENERATED')
				return token
			}
		}
	})(...args)
}
