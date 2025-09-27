"use client"

import {Button} from "@workspace/ui/components/button";
import {useVapi} from "@/modules/hooks/use-vapi";

export default function Page() {
  const {startCall, endCall, transcript} = useVapi()

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hello World apps/web</h1>
        <Button onClick={() => startCall()}>Start call</Button>
        <Button variant={"ghost"} onClick={() => endCall()}>End call</Button>
        {/*{JSON.stringify(users, null, 2)}*/}

        <p>{JSON.stringify(transcript, null, 2)}</p>
      </div>
    </div>
  )
}
