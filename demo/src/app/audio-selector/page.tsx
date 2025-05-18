'use client'

import React, { useState } from 'react';
import { AudioSourceSelector } from '@stream-studio/web-media-components'
export default function TestAudioSelector() {
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);

  const handleDeviceSelect = (device: MediaDeviceInfo) => {
    setSelectedDevice(device);
    
  };
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Audio Selector</h1>
        
        <div className="bg-neutral-800 rounded-lg p-6 shadow-lg">
          <AudioSourceSelector
            onDeviceSelect={handleDeviceSelect}
          />
        </div>

        {selectedDevice && (
          <div className="mt-8 bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Informations</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-400">Source :</span>{' '}
                {selectedDevice?.label}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 