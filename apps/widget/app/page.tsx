"use client"

import {useQuery} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";

export default function Page() {
  const users = useQuery(api.users.getMany)

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World apps/web</h1>
        {JSON.stringify(users, null, 2)}
      </div>
    </div>
  )
}
