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

  if (!(now.getHours() >= 9 && now.getHours() < 18)) {
    return NextResponse.json(
      { message: "Not in working hours. Working hours: 09:00 - 18:00" },
      { status: 400 },
    );
  }

  const payload: Record<string, any> = {
    state: 1,
    IsManagerConfirmTimekeeping: false,
  };

  if (now.getDay() !== 0 && now.getDay() !== 6) {
    payload.WorkingShiftID = 14408;
    payload.WorkingShiftName = "Ca hành chính";
    payload.WorkingShiftCode = "HC";
    payload.StartTime = "09:00:00";
    payload.EndTime = "18:00:00";
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
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
