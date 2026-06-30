const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    baseURL: API_HOST
})