import { createInstance, User } from "@luminoso/luminoso-sdk";
import React from "react";
import { LuminosoProvider } from "../store";

interface InitializeProps {}

export const initialize = (sdkKey: string, user: User) => (props: React.PropsWithChildren<InitializeProps>) => {
  console.log("sdkKey", sdkKey);

  const instance = createInstance({ sdkKey }, user);

  return <LuminosoProvider instance={instance}>{props.children}</LuminosoProvider>;
};
