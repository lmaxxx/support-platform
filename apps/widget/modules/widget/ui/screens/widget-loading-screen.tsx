"use client"

import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom
} from "@/modules/widget/atoms/widget-atoms";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {LoaderIcon} from "lucide-react";
import {useEffect, useState} from "react";
import {useAction, useMutation} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";

type Props = {
  organizationId: string | null;
}

type InitStep = "storage" | "org" | "session" | "settings" | "vapi" | "done"

export default function WidgetLoadingScreen({organizationId}: Props) {
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState<boolean>(false);

  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);
  const setScreen = useSetAtom(screenAtom);

  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))

  const validateOrganization = useAction(api.public.organizations.valiadte)

  // Step 1: validate organization
  useEffect(() => {
    if(step !== "org") {
      return;
    }

    setLoadingMessage("Finding organization ID...");

    if(!organizationId) {
      setErrorMessage("Organization id must be provided");
      setScreen("error");
      return;
    }

    setLoadingMessage("Verifying organization...");

    validateOrganization({organizationId}).then((result) => {
      if(result.valid) {
        setOrganizationId(organizationId)
        setStep("session")
      } else {
        setErrorMessage(result.reason || "Invalid configuration");
        setScreen("error");
      }
    })
      .catch(() => {
        setErrorMessage("Unable to verify organization");
        setScreen("error");
      })
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
    validateOrganization,
    setLoadingMessage
  ])


  const validateContactSession = useMutation(api.public.contactSessions.validate)
  // Step 2: Validate session
  useEffect(() => {
    if(step !== "session") {
      return;
    }

    setLoadingMessage("Finding session ID...");

    if(!contactSessionId) {
      setSessionValid(false);
      setStep("done")
      return;
    }

    setLoadingMessage("Validating session...");

    validateContactSession({contactSessionId}).then((result) => {
      setSessionValid(result.valid);
      setStep("done")
    })
      .catch(() => {
        setSessionValid(false);
        setStep("done")
      })

  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionId && sessionValid;

    setScreen(hasValidSession ? "selection" : "auth")
  }, [step, contactSessionId, sessionValid, setScreen]);

  return (
    <>
      <WidgetHeader>
        <div className={"flex flex-col justify-between gap-y-2 px-2 py-6"}>
          <p className={"text-3xl"}>
            Hi there! 👋
          </p>
          <p className={"text-lg"}>
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>
      <div className={"flex flex-1 items-center justify-center flex-col gap-y-4 p-4 text-muted-foreground"}>
        <LoaderIcon className={"animate-spin"}/>
        <p className={"text-sm"}>
          {loadingMessage || "Loading..."}
        </p>
      </div>
    </>
  )
}
