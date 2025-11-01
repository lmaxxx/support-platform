import {PublicFile} from "@workspace/backend/convex/private/files";
import {useMutation} from "convex/react";
import {api} from "@workspace/backend/convex/_generated/api";
import {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@workspace/ui/components/dialog";
import {Button} from "@workspace/ui/components/button";
import {toast} from "sonner";
import * as Sentry from "@sentry/nextjs";

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: PublicFile | null;
  onDelete?: () => void;
}

export default function DeleteFileDialog({
  open,
  onOpenChange,
  file,
  onDelete,
}: Props) {
  const deleteFile = useMutation(api.private.files.deleteFile)
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if(!file) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteFile({entryId: file.id})
      onDelete?.()
      onOpenChange(false)
    } catch (error) {
      Sentry.captureException(error);
      toast.error("Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={"sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this file? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {
          file && (
            <div className={"py-4"}>
              <div className={"rounded-lg border bg-muted/50 p-4"}>
                <p>{file.name}</p>
                <p className={"text-muted-foreground text-sm"}>Type: {file.type.toLowerCase()} | Size: {file.size}</p>
              </div>
            </div>
          )
        }

        <DialogFooter>
          <Button
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button
            disabled={isDeleting}
            onClick={handleDelete}
            variant={"destructive"}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
