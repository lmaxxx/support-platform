"use client"

import {ReactNode} from "react";
import {Authenticated, AuthLoading, Unauthenticated} from "convex/react";
import {AuthLayout} from "@/modules/auth/ui/layouts/auth-layout";
import {SignInView} from "@/modules/auth/ui/views/sign-in-view";

export function AuthGuard({children}: {children: ReactNode }) {
  return (
    <>
      <AuthLoading>
        <AuthLayout>
          <p>Loading...</p>
        </AuthLayout>
      </AuthLoading>
      <Authenticated>
        <AuthLayout>
          {children}
        </AuthLayout>
      </Authenticated>
      <Unauthenticated>
        <AuthLayout>
          <SignInView/>
        </AuthLayout>
      </Unauthenticated>
    </>
  )
}
