import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// HMR-safe global singleton
const globalForPing = globalThis as unknown as {
  pingIntervalId?: NodeJS.Timeout;
  pingTargetUrl?: string;
};

export async function GET(request: NextRequest) {
  const host = request.headers.get("host") || "localhost:3000";
  const proto = request.headers.get("x-forwarded-proto") || "http";
  const selfUrl = `${proto}://${host}/api/ping`;

  globalForPing.pingTargetUrl = selfUrl;

  // Clear any existing interval to prevent duplicate background daemon leaks
  if (globalForPing.pingIntervalId) {
    clearInterval(globalForPing.pingIntervalId);
  }

  console.log(`[Keep-Alive] Resetting Render Keep-Alive Daemon. Target: ${selfUrl}`);

  globalForPing.pingIntervalId = setInterval(() => {
    const target = globalForPing.pingTargetUrl || selfUrl;
    console.log(`[Keep-Alive] Triggering self-ping to ${target}`);

    fetch(target)
      .then(async (res) => {
        // Fully consume response stream to prevent Undici heap buffer leaks
        const body = await res.text();
        console.log(`[Keep-Alive] Self-ping returned status: ${res.status} (body length: ${body.length})`);
      })
      .catch((err) => {
        console.error(`[Keep-Alive] Self-ping error:`, err);
      });
  }, 840000); // 14 minutes

  return Response.json({
    status: "alive",
    timestamp: new Date().toISOString(),
    daemonActive: true,
    targetUrl: selfUrl,
  });
}
