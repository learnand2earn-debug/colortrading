import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { adminKey, targetUserId, amount, reason } = body;

    // Check optional admin bearer or secret
    const cronSecret = process.env.CRON_SECRET || "lumina-secure-cron-token-2026";
    if (adminKey && adminKey !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!targetUserId || amount === undefined) {
      return NextResponse.json(
        { error: "Missing target user or amount" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Adjusted points by ${amount} for user ${targetUserId}`,
      adjustment: {
        targetUserId,
        amount,
        reason: reason || "Administrative adjustment",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json(
      { error: error.message || "Internal error" },
      { status: 500 }
    );
  }
}

