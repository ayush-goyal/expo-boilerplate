import { db } from "@acme/db";

import { protectedProcedure } from "../trpc";

const getCurrentUser = protectedProcedure.query(async ({ ctx }) => {
  const user = await db.user.findUnique({
    where: {
      id: ctx.user.uid,
    },
  });

  return user;
});

export default getCurrentUser;
