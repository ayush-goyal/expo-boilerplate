import { db } from "@acme/db";

import { publicProcedure } from "../trpc";

const getUserCount = publicProcedure.query(async () => {
  const count = await db.user.count();
  return count;
});

export default getUserCount;
