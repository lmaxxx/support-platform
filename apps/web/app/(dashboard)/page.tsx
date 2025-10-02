"use client"

// import {Unauthenticated, useMutation, useQuery} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import {Button} from "@workspace/ui/components/button";
// import {Authenticated} from "convex/react";
import {OrganizationSwitcher, SignInButton, UserButton} from "@clerk/nextjs";

export default function Page() {
  return (
    <>
        <div className="flex items-center justify-center min-h-svh">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Hello World apps/web</h1>
          </div>
          <UserButton/>
          <OrganizationSwitcher hidePersonal></OrganizationSwitcher>
        </div>
    </>
  )
}
