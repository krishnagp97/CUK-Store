import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

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
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,

    async sendVerificationEmail({ user, url }) {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        html: `
          <h2>Welcome to Campus Marketplace</h2>
          <p>Click the button below to verify your email.</p>

          <a href="${url}"
             style="
               display:inline-block;
               padding:12px 24px;
               background:#2563eb;
               color:white;
               text-decoration:none;
               border-radius:8px;">
             Verify Email
          </a>

          <p>If you didn't create this account, you can safely ignore this email.</p>
        `,
      });
    },
  },
});
