'use client';
import React from 'react';
import { IpodProvider } from '../contexts/IpodContext';
import { IpodShell, TopBar } from '../components';

export default function Home() {
  return (
    <IpodProvider>
      <div className="min-h-screen flex flex-col bg-black">
        <TopBar />
        <div className="flex flex-1 items-center justify-center">
          <IpodShell />
        </div>
      </div>
    </IpodProvider>
  );
}
