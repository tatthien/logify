import { Cron, StackContext } from "sst/constructs";

export function MainStack({ stack, app }: StackContext) {
  new Cron(stack, "scheduled-clock-in", {
    job: {
      function: {
        handler: "sst/functions/clock-in.handler",
        environment: {
          SST_SUPABASE_URL: process.env.SST_SUPABASE_URL!,
          SST_SUPABASE_KEY: process.env.SST_SUPABASE_SERVICE_ROLE_KEY!,
        },
      },
    },
    // DEV: every minute, PROD: every day at 09:00
    schedule: app.local ? "rate(1 minute)" : "cron(0 2 * * ? *)",
    enabled: !app.local,
  });
}
