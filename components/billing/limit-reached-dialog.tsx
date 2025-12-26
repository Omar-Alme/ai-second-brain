"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpgradeToProButton } from "@/components/billing/upgrade-to-pro-button";

export function LimitReachedDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}) {
  const title = props.title ?? "Plan limit reached";
  const description =
    props.description ??
    "You’ve reached the Free plan limit. Upgrade to Pro to unlock higher limits and Pro features.";

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => props.onOpenChange(false)}
          >
            Close
          </Button>
          <UpgradeToProButton className="rounded-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}


