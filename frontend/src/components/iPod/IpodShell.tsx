'use client';
import React from 'react';
import { IpodScreen } from './IpodScreen';
import { IpodWheel } from './IpodWheel';

export function IpodShell() {
  return (
    <div className="w-[400px] h-[700px] bg-gradient-to-b from-gray-300 to-gray-400 rounded-[40px] shadow-2xl flex flex-col items-center relative">
      <IpodScreen />
      <div className="flex-1 flex items-center justify-center w-full py-8">
        <IpodWheel />
      </div>
    </div>
  );
} 