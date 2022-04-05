import NextAuth from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const AuthOptions = {
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
		secret: process.env.JWT_SECRET,
		encryption: true
	},
	secret: process.env.SECRET,
	debug: true
}

export default NextAuth(AuthOptions)