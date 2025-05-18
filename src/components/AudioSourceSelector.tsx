import React, { useEffect, useState } from 'react';
import { AudioLevelContainer } from '../containers/AudioLevelContainer';


interface AudioSourceSelectorProps {
  translations?: {
    sourceAudio?: string;
    selectDevice?: string;
    audioLevel?: string;
  },
  onDeviceSelect: (device: MediaDeviceInfo, stream: MediaStream) => void;
  className?: string;
}

export function AudioSourceSelector({
  translations,
  onDeviceSelect,
  className = ''
}: AudioSourceSelectorProps) {
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const initDevices = async () => {
      try {
        // Request permission
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Get devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices
          .filter(device => device.kind === 'audioinput')

        
        setAvailableDevices(audioDevices);
      } catch (error) {
        console.error('Error initializing audio devices:', error);
      }
    };

    initDevices();
  }, []);

  const handleDeviceSelect = async (deviceId: string) => {
    try {
      // Stop previous stream if exists
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } }
      });
      const device = availableDevices.find(device => device.deviceId === deviceId) || null;

      if (device) {
        setSelectedDevice(device);
        setStream(newStream);
        onDeviceSelect(device, newStream);
      }
    } catch (error) {
      console.error('Error selecting audio device:', error);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Device Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-1">{translations?.sourceAudio || 'Source'}</h3>
        <select
          className="w-full bg-neutral-700 text-white rounded px-3 py-2"
          value={selectedDevice?.deviceId || ''}
          onChange={(e) => handleDeviceSelect(e.target.value)}
        >
          <option value="" disabled>{translations?.selectDevice || 'Select a source...'}</option>
          {availableDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      </div>

      {selectedDevice && (
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-300 mb-1">{translations?.audioLevel || 'Audio level'}</h3>
          <AudioLevelContainer stream={stream} />
        </div>
      )}
    </div>
  );
} 