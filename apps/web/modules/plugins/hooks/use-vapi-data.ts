import {useEffect, useState} from "react";
import {api} from "@workspace/backend/convex/_generated/api";
import {useAction} from "convex/react";
import {toast} from "sonner";

type PhoneNumbers = typeof api.private.vapi.getPhoneNumbers._returnType;
type Assistants = typeof api.private.vapi.getAssistants._returnType;

export function useVapiPhoneNumbers(): {
  data: PhoneNumbers;
  isLoading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<PhoneNumbers>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getPhoneNumbers = useAction(api.private.vapi.getPhoneNumbers)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getPhoneNumbers();
        setData(result);
        setError(null);
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to fetch phone numbers");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [])

  return {data, isLoading, error};
}

export function useVapiAssistants(): {
  data: Assistants;
  isLoading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<Assistants>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getAssistants = useAction(api.private.vapi.getAssistants)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getAssistants();
        setData(result);
        setError(null);
      } catch (error) {
        setError(error as Error);
        toast.error("Failed to fetch phone numbers");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [])

  return {data, isLoading, error};
}