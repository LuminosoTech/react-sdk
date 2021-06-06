import React, { createContext, Provider } from "react";
import { LuminosoInstance } from "@luminoso/luminoso-sdk";

interface Store {
  instance?: LuminosoInstance;
}

const initialState: Store = {
  instance: undefined,
};

const store = createContext<Store>(initialState);

export const Consumer = store.Consumer;
const { Provider } = store;

export interface LuminosoProviderProps {
  instance: LuminosoInstance;
}

interface LuminosoProviderState {}

export class LuminosoProvider extends React.Component<LuminosoProviderProps, LuminosoProviderState> {
  constructor(props: LuminosoProviderProps) {
    super(props);
  }

  render() {
    const { instance, children } = this.props;
    const value = {
      instance,
    };

    return <Provider value={value}>{children}</Provider>;
  }
}
