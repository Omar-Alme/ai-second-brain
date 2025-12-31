"use client";

import useCurrentTheme from "@/hooks/use-current-theme";
import { UserButton } from "@clerk/nextjs";
import { dark, shadcn } from "@clerk/themes";

export function UserControl(props: { showName?: boolean }) {
  const currentTheme = useCurrentTheme();

  return (
    <UserButton
      showName={props.showName}
      appearance={{
        baseTheme: currentTheme === "dark" ? [shadcn, dark] : shadcn,
        elements: {
          userButton: "rounded-md!",
          userButtonAvatarBox: "rounded-md! size-7!",
          userButtonTrigger: "rounded-md!",
        },
      }}
    />
  );
}


