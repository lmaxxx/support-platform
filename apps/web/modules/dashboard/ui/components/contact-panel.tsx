"use client"

import DicebearAvatar from "@workspace/ui/components/dicebear-avatar";
import {useParams} from "next/navigation";
import {useQuery} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import {Id} from "@workspace/backend/convex/_generated/dataModel";
import {ComponentType, ReactNode, useMemo} from "react";
import {getCountryFlagUrl, getCountryFromTimezone} from "@/lib/country-utils";
import Link from "next/link";
import {Button} from "@workspace/ui/components/button";
import {ClockIcon, GlobeIcon, MailIcon, MonitorIcon} from "lucide-react";
import Bowser from "bowser";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@workspace/ui/components/accordion";

type InfoItem = {
  label: string;
  value: string | ReactNode;
  className?: string
}

type InfoSection = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  items: InfoItem[];
}

export default function ContactPanel() {
  const params = useParams();
  const conversationId = params.conversationId as Id<"conversations">;
  const contactSession = useQuery(api.private.contactSessions.getOneByConversationId,
    {conversationId}
  )

  const parseUserAgent = useMemo(() => {
    return (userAgent?: string) => {
      if(!userAgent) {
        return { browser: "Unknown", os: "Unknown", device: "Unknown" };
      }

      const browser = Bowser.getParser(userAgent);
      const result = browser.getResult();

      return {
        browser: result.browser.name || "Unknown",
        browserVersion: result.browser.version || "",
        os: result.os.name || "",
        osVersion: result.os.version || "",
        device: result.platform.type || "desktop",
        deviceVendor: result.platform.vendor || "",
        deviceModel: result.platform.model || ""
      }
    }
  }, [])

  const userAgentInfo = useMemo(() =>
      parseUserAgent(contactSession?.metadata?.userAgent)
    , [contactSession?.metadata?.userAgent, parseUserAgent])

  const countryInfo = useMemo(() => {
    return getCountryFromTimezone(contactSession?.metadata?.timezone)
  }, [contactSession?.metadata?.timezone])

  const accordionSections = useMemo<InfoSection[]>(() => {
    if(!contactSession?.metadata) {
      return []
    }

    return [
      {
        id: "device-info",
        icon: MonitorIcon,
        title: "Device Information",
        items: [
          {
            label: "Browser",
            value: `${userAgentInfo.browser} ${userAgentInfo.browserVersion || ""}`
          },
          {
            label: "OS",
            value: `${userAgentInfo.os} ${userAgentInfo.osVersion || ""}`
          },
          {
            label: "Device",
            value: `${userAgentInfo.device} ${userAgentInfo?.deviceModel || ""}`,
            className: "capitalize"
          },
          {
            label: "Screen",
            value: contactSession.metadata.screenResolution
          },
          {
            label: "Viewport",
            value: contactSession.metadata.viewportSize
          },
          {
            label: "Cookies",
            value: contactSession.metadata.cookieEnabled ? "Enable" : "Disabled"
          }
        ]
      },
      {
        id: "location-info",
        icon: GlobeIcon,
        title: "Location & Language",
        items: [
          ...(countryInfo)
            ? [
              {
                label: "Country",
                value: countryInfo.name
              }
            ] : [],
          {
            label: "Language",
            value: contactSession.metadata.language
          },
          {
            label: "Timezone",
            value: contactSession.metadata.timezone
          },
          {
            label: "UTC Offset",
            value: contactSession.metadata.timezoneOffset
              ? `${-contactSession.metadata.timezoneOffset / 60} hours`
              : "Unknown"
          }
        ]
      },
      {
        id: "session-details",
        icon: ClockIcon,
        title: "Session details",
        items: [
          {
            label: "Session Started",
            value: new Date(contactSession._creationTime).toLocaleString()
          },
          {
            label: contactSession.expiresAt >= Date.now() ? "Expires at" : "Expired at",
            value: new Date(contactSession.expiresAt).toLocaleString()
          }
        ]
      },
    ]
  }, [userAgentInfo, contactSession, countryInfo])

  if(contactSession === undefined || contactSession === null) {
    return null;
  }

  return (
    <div className={"flex h-full w-full flex-col bg-background text-foreground"}>
      <div className={"flex flex-col gap-y-4 p-4"}>
        <div className={"flex items-center gap-x-2"}>
          <DicebearAvatar
            size={42}
            badgeImageUrl={
              countryInfo?.code ? getCountryFlagUrl(countryInfo.code) : undefined
            }
            seed={contactSession._id}
          />
          <div className={"flex-1 overflow-hidden"}>
            <div className={"flex items-center gap-x-2"}>
              <h4>
                {contactSession.name}
              </h4>
            </div>
            <p className={"line-clamp-1 text-muted-foreground text-sm"}>{contactSession.email}</p>
          </div>
        </div>
        <Button asChild className={"w-full"} size={"lg"}>
          <Link href={`mailto:${contactSession.email}`}>
            <MailIcon/>
            <span>Send Email</span>
          </Link>
        </Button>
      </div>
      <div>
        {contactSession.metadata && (
          <Accordion
            className={"w-full rounded-none border-y"}
            type={"multiple"}
          >
            {
              accordionSections.map(section => (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className={"rounded-none outline-none has-focus-visible:z-10 has-focus-visible::border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"}
                >
                  <AccordionTrigger
                    className={"flex w-full flex-1 items-start justify-between gap-4 rounded-none bg-accent px-5 py-4 text-left font-medium text-sm outline-none transition-all hover:no-underline disabled:pointer-events-none disabled:opacity-50"}
                  >
                    <div className={"flex items-center gap-4"}>
                      <section.icon className={"size-4 shrink-0"}/>
                      <span>{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className={"px-5 py-4"}>
                    <div className={"space-y-2 text-sm"}>
                      {section.items.map(item => (
                        <div key={`${section.id}-${item.label}`} className={"flex justify-between"}>
                          <span className={"text-muted-foreground"}>{item.label}</span>
                          <span className={item.className}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            }
          </Accordion>
        )}
      </div>
    </div>
  )
}
