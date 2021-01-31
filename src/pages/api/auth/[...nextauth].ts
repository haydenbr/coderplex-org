import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import { NextApiHandler } from 'next'
import Fauna from '@/adapters'

import faunadb from 'faunadb'
const isProduction = process.env.NODE_ENV === 'production'
const faunaClient = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET,
  scheme: isProduction ? 'https' : 'http',
  domain: isProduction ? 'db.fauna.com' : 'localhost',
  ...(isProduction ? {} : { port: 8443 }),
})

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'user:email',
    }),
    Providers.LinkedIn({
      clientId: process.env.LINKEDIN_ID,
      clientSecret: process.env.LINKEDIN_SECRET,
    }),
  ],
  adapter: Fauna.Adapter({ faunaClient }),

  secret: process.env.SECRET,
}
