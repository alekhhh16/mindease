// Development-only authentication fallback
// This is used when Supabase is not available (e.g., paused project)
// NEVER USE IN PRODUCTION

import { cookies } from "next/headers";

interface DevUser {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

const DEV_USERS_KEY = "_mindease_dev_users";
const SESSION_KEY = "_mindease_session";

// In-memory store (resets on server restart)
let devUsers: Record<string, DevUser & { password: string }> = {};

export async function devSignUp(
  email: string,
  password: string,
  displayName: string
): Promise<{ user: DevUser | null; error: { message: string } | null }> {
  // Check if user already exists
  if (devUsers[email]) {
    return {
      user: null,
      error: { message: "User already exists" },
    };
  }

  const user: DevUser & { password: string } = {
    id: `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email,
    password, // NEVER STORE PLAINTEXT PASSWORDS IN PRODUCTION!
    display_name: displayName,
    created_at: new Date().toISOString(),
  };

  devUsers[email] = user;

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEY, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      created_at: user.created_at,
    },
    error: null,
  };
}

export async function devSignIn(
  email: string,
  password: string
): Promise<{ user: DevUser | null; error: { message: string } | null }> {
  const user = devUsers[email];

  if (!user || user.password !== password) {
    return {
      user: null,
      error: { message: "Invalid email or password" },
    };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_KEY, user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
      created_at: user.created_at,
    },
    error: null,
  };
}

export async function devGetUser(userId: string): Promise<DevUser | null> {
  for (const user of Object.values(devUsers)) {
    if (user.id === userId) {
      return {
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        created_at: user.created_at,
      };
    }
  }
  return null;
}

export async function devLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);
}
