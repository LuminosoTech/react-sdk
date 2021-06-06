import { User } from '@luminoso/luminoso-sdk';
import React from 'react';

interface InitializeProps {
}
declare const initialize: (sdkKey: string, user: User) => (props: React.PropsWithChildren<InitializeProps>) => JSX.Element;

export { initialize };
