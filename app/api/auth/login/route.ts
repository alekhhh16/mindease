import { createClient } from "@/lib/supabase/server";
import { devSignIn } from "@/lib/supabase/dev-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Attempt login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[v0] Login error:", error);
      
      // Check if it's a network error - use fallback dev auth
      if (error.message?.includes("fetch failed") || error.message?.includes("ENOTFOUND")) {
        console.warn("[v0] Supabase unreachable. Using development fallback authentication.");
        
        try {
          const { user: devUser, error: devError } = await devSignIn(email, password);
          
          if (devError) {
            return NextResponse.json(
              { error: devError.message, isDevMode: true },
              { status: 401 }
            );
          }
          
          return NextResponse.json(
            { 
              message: "Login successful (development mode)",
              user: devUser,
              isDevMode: true,
              warning: "Running in development mode. Supabase project is not accessible."
            },
            { status: 200 }
          );
        } catch (devErr) {
          console.error("[v0] Dev auth fallback error:", devErr);
          return NextResponse.json(
            { 
              error: "Cannot connect to authentication server. Please check that your Supabase project is active and not paused.",
              details: (devErr as Error).message 
            }, 
            { status: 503 }
          );
        }
      }
      
      return NextResponse.json(
        { error: error.message || "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!data.session) {
      console.error("[v0] No session returned");
      return NextResponse.json(
        { error: "Login failed. Please try again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Login successful", user: data.user },
      { status: 200 }
    );
  } catch (error) {
    console.error("[v0] Login exception:", error);
    
    // If it's a Supabase connection error, try dev auth
    if ((error as Error).message?.includes("ENOTFOUND") || (error as Error).message?.includes("fetch failed")) {
      console.warn("[v0] Supabase unreachable. Using development fallback authentication.");
      
      try {
        const { user: devUser, error: devError } = await devSignIn(email, password);
        
        if (devError) {
          return NextResponse.json(
            { error: devError.message, isDevMode: true },
            { status: 401 }
          );
        }
        
        return NextResponse.json(
          { 
            message: "Login successful (development mode)",
            user: devUser,
            isDevMode: true
          },
          { status: 200 }
        );
      } catch (devErr) {
        console.error("[v0] Dev auth fallback error:", devErr);
      }
    }
    
    return NextResponse.json(
      { error: "Failed to login. Please try again." },
      { status: 500 }
    );
  }
}
