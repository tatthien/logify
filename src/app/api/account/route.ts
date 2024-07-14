import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function DELETE(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SST_SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value }) => {
            req.cookies.set(name, value);
          });
        },
      },
    },
  );

  const { data: user, error: getUserError } = await supabase.auth.getUser();
  if (getUserError) {
    return NextResponse.json({ error: getUserError }, { status: 400 });
  }

  const { error } = await supabase.auth.admin.deleteUser(user.user.id);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({}, { status: 201 });
}
