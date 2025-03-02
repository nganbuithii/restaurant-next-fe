import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_RESTAURANT_API:z.string(),
    NEXT_PUBLIC_URL:z.string(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:z.string(),
    NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI:z.string(),
})


// validate schema
const configProject = configSchema.safeParse({
    NEXT_PUBLIC_RESTAURANT_API: process.env.NEXT_PUBLIC_RESTAURANT_API,
    NEXT_PUBLIC_URL:process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI:process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
})

if(!configProject.success){
    throw new Error("Invalid environment variables")
}
export type Locale = (typeof locales)[number];

export const locales = ['en', 'vi'] as const;
export const defaultLocale: Locale = 'vi';

const envConfig = configProject.data

export default envConfig