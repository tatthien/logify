import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get("X-Misa-Session-ID");
  if (!sessionId) {
    return NextResponse.json(
      { message: "Mission session ID" },
      { status: 400 },
    );
  }

  const now = new Date();
  if (now.getHours() < 9 || now.getHours() > 18) {
    return NextResponse.json(
      { message: "Not in working hours. Working hours: 09:00 - 18:00" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      "https://amisapp.misa.vn/APIS/TimekeeperAPI/api/TimekeepingRemote/timekeeping-now",
      {
        method: "POST",
        credentials: "include",
        headers: {
          Cookie: `x-sessionid=${sessionId};`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: 1,
          IsManagerConfirmTimekeeping: false,
          WorkingShiftID: 14408,
          WorkingShiftName: "Ca hành chính",
          WorkingShiftCode: "HC",
          StartTime: "09:00:00",
          EndTime: "18:00:00",
        }),
      },
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
