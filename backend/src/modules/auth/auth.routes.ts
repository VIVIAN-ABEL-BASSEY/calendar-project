import { Router } from "express"
import { register, login, refreshToken, getMe  } from "./auth.controller"
import { authenticate } from "../../middleware/auth.middleware"
import { googleCallback } from "./google.controller"
import passport from "../../config/passport"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", refreshToken)
router.get("/me", authenticate, getMe)

// Google OAuth routes
// Step 1 — redirect user to Google's login page
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
)

// Step 2 — Google redirects back here after user approves
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  googleCallback
)

export default router
