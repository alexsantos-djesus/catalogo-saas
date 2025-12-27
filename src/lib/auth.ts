import { auth as nextAuth } from "next-auth";
import { authConfig } from "@/lib/auth-config";

export const auth = nextAuth(authConfig);
