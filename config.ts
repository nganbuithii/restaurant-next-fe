import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_RESTAURANT_API:z.string(),
    NEXT_PUBLIC_URL:z.string(),
})


// validate schema
const configProject = configSchema.safeParse({
    NEXT_PUBLIC_RESTAURANT_API: process.env.NEXT_PUBLIC_RESTAURANT_API,
    NEXT_PUBLIC_URL:process.env.NEXT_PUBLIC_URL,
})

if(!configProject.success){
    throw new Error("Invalid environment variables")
}

const envConfig = configProject.data

export default envConfig