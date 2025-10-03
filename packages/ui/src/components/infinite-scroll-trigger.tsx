import {Ref} from "react";
import {cn} from "@workspace/ui/lib/utils";
import {Button} from "@workspace/ui/components/button";

type Props = {
  canLoadMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  loadMoreText?: string;
  noMoreText?: string;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export default function InfiniteScrollTrigger({
  canLoadMore,
  isLoadingMore,
  onLoadMore,
  loadMoreText = "Load more",
  noMoreText = "No more items",
  className,
  ref
                                              }: Props) {
  let text = loadMoreText;

  if(isLoadingMore) {
    text = "Loading..."
  } else if(!canLoadMore) { {
    text = noMoreText;
  }}


  return (
    <div className={cn("flex w-full justify-center py-2", className)} ref={ref}>
      <Button
        disabled={!canLoadMore || isLoadingMore}
        onClick={onLoadMore}
        size={"sm"}
        variant={"ghost"}
      >
        {text}
      </Button>
    </div>
  )
}
