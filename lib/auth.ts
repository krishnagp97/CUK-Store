
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { render } from "@react-email/render";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";
import EmailTemplate from "@/components/email-template";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,

    async sendVerificationEmail({ user, url }) {
      const html = await render(
        EmailTemplate({
          verificationUrl: url,
          userName: user.name,
        }),
      );

      await sendEmail({
        to: user.email,
        subject: "Verify your CUK Store account",
        html,
      });
    },
  },
});

