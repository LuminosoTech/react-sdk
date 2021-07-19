import { createInstance, User } from "@luminoso/feature-flags-sdk";
import React from "react";
import { LuminosoProvider } from "../store";

interface InitializeProps {}

export const initialize = (sdkKey: string, user: User) => (props: React.PropsWithChildren<InitializeProps>) => {
  const instance = createInstance({ sdkKey }, user);

  return <LuminosoProvider instance={instance}>{props.children}</LuminosoProvider>;
};
