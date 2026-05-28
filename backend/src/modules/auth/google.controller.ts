import { Request, Response } from 'express'
import { IUser } from '../user/user.model'
import { generateAccessToken, generateRefreshToken } from '../../config/jwt'

export const googleCallback = (req: Request, res: Response): void => {
  try {
    const user = req.user as IUser

    if (!user) {
      res.redirect(
        `${process.env.FRONTEND_URL}/login?error=Google authentication failed`
      )
      return
    }

    const userId = user._id.toString()
    const accessToken  = generateAccessToken(userId)
    const refreshToken = generateRefreshToken(userId)

    // redirect to frontend with tokens
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&userId=${userId}`
    )
  } catch (err) {
    res.redirect(
      `${process.env.FRONTEND_URL}/login?error=Authentication failed`
    )
  }
}