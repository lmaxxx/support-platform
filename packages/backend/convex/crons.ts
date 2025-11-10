import {cronJobs} from "convex/server";
import {internal} from "./_generated/api";

const crons = cronJobs();

// Clean up expired contact sessions every hour
crons.interval(
  "cleanup expired sessions",
  {hours: 1},
  internal.system.contactSessions.cleanupExpiredSessions
);

export default crons;
