import {atomWithStorage} from "jotai/utils";
import {STATUS_FILTER_KEY} from "@/modules/dashboard/constants";
import {Doc} from "@workspace/backend/convex/_generated/dataModel";

export const statusFilterAtom = atomWithStorage<
  Doc<"conversations">["status"] | "all"
>(STATUS_FILTER_KEY, "all")