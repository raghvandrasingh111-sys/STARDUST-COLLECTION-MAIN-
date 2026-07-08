import { supabase } from "@/lib/supabase";

export async function verifyAdmin(request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { isAdmin: false, error: "Missing authorization token" };
    }

    const token = authHeader.split(" ")[1];
    // verify standard JWT token with supabase auth service
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { isAdmin: false, error: "Invalid user token" };
    }

    const adminEmailsEnv = process.env.ADMIN_EMAILS || "";
    const adminEmails = adminEmailsEnv
      .split(",")
      .map((email) => email.trim().toLowerCase());

    if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
      return { isAdmin: false, error: "Access denied: user is not an admin" };
    }

    return { isAdmin: true, user };
  } catch (err) {
    return { isAdmin: false, error: err.message };
  }
}
