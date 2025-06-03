"use client";

import { ReactNode, useEffect } from 'react';
import { PublicClientApplication, EventType, EventMessage } from '@azure/msal-browser';
import { MsalProvider as DefaultMsalProvider } from '@azure/msal-react';

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_B2C_CLIENT_ID || '11111111-1111-1111-1111-111111111111',
    authority: `https://${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT_NAME || 'motorcycleclubhub'}.b2clogin.com/${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT_NAME || 'motorcycleclubhub'}.onmicrosoft.com/${process.env.NEXT_PUBLIC_AZURE_B2C_POLICY_NAME || 'B2C_1_susi'}`,
    knownAuthorities: [`${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT_NAME || 'motorcycleclubhub'}.b2clogin.com`],
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '/',
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : '/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Create MSAL instance
const msalInstance = typeof window !== 'undefined' 
  ? new PublicClientApplication(msalConfig) 
  : null;

// Default to using email/password with fallback to social providers
const loginRequest = {
  scopes: ['openid', 'profile', 'email'],
};

if (msalInstance) {
  // Set up event handling for login failures
  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_FAILURE) {
      console.error('Login failure:', event.error);
    }
  });

  // Handle redirect promises
  msalInstance.handleRedirectPromise().catch(error => {
    console.error('Error handling redirect:', error);
  });
}

interface MsalProviderProps {
  children: ReactNode;
}

export function MsalProvider({ children }: MsalProviderProps) {
  useEffect(() => {
    if (msalInstance) {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
    }
  }, []);

  if (!msalInstance) {
    return <>{children}</>;
  }

  return (
    <DefaultMsalProvider instance={msalInstance}>
      {children}
    </DefaultMsalProvider>
  );
}