import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
import fetch from "node-fetch";

export const handler = async () => {
  const supabase = createClient(
    process.env.SST_SUPABASE_URL!,
    process.env.SST_SUPABASE_KEY!,
  );

  const { data, error } = await supabase.from("clock_in_schedules").select("*");
  if (error) {
    console.log({
      msg: "[auto-clock-in]: cannot fetch schedules",
      data: { error },
    });
    return;
  }

  const now = new Date();

  data.forEach(async (item) => {
    const { session_id, schedule, active, user_id } = item;

    if (!active) {
      console.log({
        msg: "[auto-clock-in]: not active",
        data: { user_id },
      });
      return;
    }

    if (!session_id) {
      console.log({
        msg: "[auto-clock-in]: missing session id",
        data: { user_id },
      });
      return;
    }

    if (!schedule || schedule.length === 0) {
      return;
    }

    // Make sure we only clock in on the configured days
    const d = schedule.find((item: string) => dayjs(item).isSame(now, "day"));
    if (!d) {
      console.log({
        msg: "[auto-clock-in]: today is not configured",
        data: { user_id },
      });
      return;
    }

    try {
      const res = await fetch(
        "https://amisapp.misa.vn/APIS/TimekeeperAPI/api/TimekeepingRemote/timekeeping-now",
        {
          method: "POST",
          headers: {
            Cookie: `x-sessionid=${session_id};`,
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
      console.log({
        msg: "[auto-clock-in]: clocked in successfully",
        data: { user_id, data },
      });
    } catch (error) {
      console.log({
        msg: "[auto-clock-in]: failed to clock in",
        data: { user_id, error },
      });
    }
  });
};
