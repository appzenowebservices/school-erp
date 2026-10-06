import { cookies } from "next/headers";
import { memStatus } from "../../../../lib/memory";

// GET /api/memory/status → core memory layer health (for Lab badges).
export async function GET() {
  const cookieStore = await cookies();
  if (!cookieStore.get("guid")?.value || !cookieStore.get("id")?.value) {
    return Response.json({ status: "disabled", reason: "not_authenticated" }, { status: 401 });
  }
  return Response.json(await memStatus());
}
