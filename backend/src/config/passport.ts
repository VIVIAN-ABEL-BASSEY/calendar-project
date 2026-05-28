import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../modules/user/user.model'

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value

        if (!email) {
          return done(new Error('No email found in Google profile'))
        }

        // check if user already exists with this email
        let user = await User.findOne({ email })

        if (user) {
          // user exists — just return them
          return done(null, user)
        }

        // new user — create account from Google profile
        user = await User.create({
          firstName:    profile.name?.givenName  ?? 'Google',
          lastName:     profile.name?.familyName ?? 'User',
          email,
          passwordHash: 'GOOGLE_OAUTH', // placeholder — they can't log in with password
          accountStatus: 'active',
        })

        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)

export default passport