import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getPayloadClient } from "@/lib/payload";

async function verifyAdminToken(request: Request): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/payload-token=([^;]+)/);
  if (!match) return false;
  const token = decodeURIComponent(match[1]);
  try {
    const secret = new TextEncoder().encode(process.env.PAYLOAD_SECRET ?? "");
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function toCSV(rows: Record<string, unknown>[], columns: string[]): string {
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v).replace(/"/g, '""');
    return `"${s}"`;
  };
  const header = columns.map(escape).join(",");
  const body = rows.map((r) => columns.map((c) => escape(r[c])).join(",")).join("\n");
  return `${header}\n${body}`;
}

export async function GET(request: Request) {
  if (!(await verifyAdminToken(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: "job-applications",
    limit: 10000,
    sort: "-createdAt",
    overrideAccess: true,
  });

  const columns = ["id", "roleSlug", "name", "email", "phone", "message", "status", "createdAt"];
  const csv = toCSV(docs as unknown as Record<string, unknown>[], columns);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
