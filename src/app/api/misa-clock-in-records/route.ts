import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const sessionId = req.headers.get("X-Misa-Session-ID");
  if (!sessionId) {
    return NextResponse.json(
      { message: "Mission session ID" },
      { status: 400 },
    );
  }

  try {
    const { startDate, endDate } = await req.json();
    const res = await fetch(
      "https://amisapp.misa.vn/APIS/g1/EmployeeCnBAPI/api/TimekeepingRemote/paging-v2",
      {
        method: "POST",
        credentials: "include",
        headers: {
          Cookie: `x-sessionid=${sessionId};`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PageIndex: 1,
          PageSize: 100,
          Sort: "W3sic2VsZWN0b3IiOiJDaGVja1RpbWUiLCJkZXNjIjp0cnVlfV0=",
          CustomParam: {
            startDate,
            endDate,
          },
        }),
      },
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
