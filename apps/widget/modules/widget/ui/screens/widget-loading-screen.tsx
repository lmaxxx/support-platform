"use client"

import WidgetHeader from "@/modules/widget/ui/components/widget-header";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom, vapiSecretsAtom, widgetSettingsAtom
} from "@/modules/widget/atoms/widget-atoms";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {Loader2Icon} from "lucide-react";
import {useEffect, useState} from "react";
import {useAction, useMutation, useQuery} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";

type Props = {
  organizationId: string | null;
}

type InitStep = "storage" | "org" | "session" | "settings" | "vapi" | "done"

export default function WidgetLoadingScreen({organizationId}: Props) {
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState<boolean>(false);
  const setWidgetSettings = useSetAtom(widgetSettingsAtom);

  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const setVapiSecrets = useSetAtom(vapiSecretsAtom)

  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))

  const validateOrganization = useAction(api.public.organizations.validate)

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


  // Step 2: Validate session (using query for read-only operation)
  const sessionValidation = useQuery(
    api.public.contactSessions.validate,
    contactSessionId && step === "session" ? { contactSessionId } : "skip"
  );

  useEffect(() => {
    if(step !== "session") {
      return;
    }

    setLoadingMessage("Finding session ID...");

    if(!contactSessionId) {
      setSessionValid(false);
      setStep("settings")
      return;
    }

    setLoadingMessage("Validating session...");

    if(sessionValidation !== undefined) {
      setSessionValid(sessionValidation.valid);
      setStep("settings")
    }

  }, [step, contactSessionId, sessionValidation, setLoadingMessage, setStep]);

  //Step 3: Load widget settings

  const widgetSettings = useQuery(api.public.widgetSettings.getByOrganizationId,
    organizationId ? { organizationId } : "skip"
  )

  useEffect(() => {
    if(step !== "settings") {
      return;
    }

    setLoadingMessage("Loading widget settings...");

    if(widgetSettings !== undefined && organizationId) {
      setWidgetSettings(widgetSettings);
      setStep("vapi")
    }
  }, [step, widgetSettings, setStep, setWidgetSettings, setLoadingMessage]);

  // Step 4: Load Vapi secrets (Optional)
  const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets)

  useEffect(() => {
    if(step !== "vapi" || !organizationId) {
      return;
    }

    setLoadingMessage("Loading voice features...");
    getVapiSecrets({organizationId})
      .then(secrets => {
        setVapiSecrets(secrets)
      })
      .catch(() => {
        setVapiSecrets(null)
      })
      .finally(() => {
        setStep("done")
      })
  }, [step, organizationId, getVapiSecrets, setVapiSecrets, setLoadingMessage, setStep]);

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
        <Loader2Icon className={"animate-spin"}/>
        <p className={"text-sm"}>
          {loadingMessage || "Loading..."}
        </p>
      </div>
    </>
  )
}
