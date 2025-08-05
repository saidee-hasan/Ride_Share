import bcrypt from "bcryptjs";
import passport from "passport";
import {
  Strategy as googleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { Strategy as localStrategy } from "passport-local";
import { IsActive, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { envVars } from "./env.config";

passport.use(
  new localStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
      const isUserExist = await User.findOne({ email });

      if (!isUserExist) {
        return done("User does not exist. Please register.");
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        return done(`Filed to login. User is ${isUserExist.isActive}`);
      }

      if (isUserExist.isDeleted) {
        return done("User is deleted. Please contact with our team.");
      }

      if (!isUserExist.isVerified) {
        return done("Please verify your email address.");
      }

      const userAuthenticated = isUserExist.auth.some(
        (provider) => provider.provider === "google"
      );

      if (userAuthenticated && !isUserExist.password) {
        return done(
          "You are already authenticaed with Google. Please login with google and set a password from your profile if email password login needed."
        );
      }

      const isPasswordMatched = await bcrypt.compare(
        password,
        isUserExist.password as string
      );

      if (!isPasswordMatched) {
        return done("Incorrect Password.");
      }

      return done(null, isUserExist);
    }
  )
);

passport.use(
  new googleStrategy(
    {
      clientID: envVars.GOOGLE.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE.GOOGLE_CALLBACK_URL,
    },
    async (
      assessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      const email = profile.emails?.[0].value;

      if (!email) {
        return done("Email not found.");
      }

      let user = await User.findOne({ email });

      if (
        user &&
        (user.isActive === IsActive.BLOCKED ||
          user.isActive === IsActive.INACTIVE)
      ) {
        return done(null, false, {
          message: `User is ${user.isActive}.`,
        });
      }

      if (user && user.isDeleted) {
        return done(null, false, { message: "User is deleted." });
      }

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email,
          auth: [{ provider: "google", providerId: email }],
          role: Role.USER,
          picture: profile.photos?.[0].value,
          isVerified: true,
        });
      }

      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (
    id: unknown,
    done: (err: any, user?: Express.User | false | null) => void
  ) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
);
