import React, { useEffect, useRef, useState } from 'react';

interface VideoSourceSelectorProps {
  translations?: {
    sourceVideo?: string;
    selectResolution?: string;
    selectDevice?: string;
  },
  availableDevices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  onDeviceSelect: (device: MediaDeviceInfo, stream: MediaStream | null) => void;
  constraints?: MediaTrackConstraints;
}

export function VideoSourceSelector({
  translations,
  availableDevices,
  selectedDeviceId,
  onDeviceSelect,
  constraints
}: VideoSourceSelectorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    
    return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-1">{translations?.sourceVideo || 'Source'}</h3>
        
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain mb-3 mt-3 bg-black rounded-lg"  />

        <select
          className="w-full bg-neutral-700 text-white rounded px-3 py-2"
          value={selectedDeviceId || ''}
          onChange={async (e) => {
            const device = availableDevices.find(device => device.deviceId === e.target.value) || null;
            if (device) {
                  const videoConstraints : MediaStreamConstraints = {
                    video: {
                        deviceId: e.target.value || undefined,
                        ...constraints
                    },
                    audio: false
                };
                try { 
                    const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
                    setStream(stream);
                    onDeviceSelect(device, stream);
                } catch (error) {
                    console.error('Error selecting video device:', error);
                }
            }}}

        >
          <option value="" disabled>{translations?.selectDevice || 'Select a source...'}</option>
          {availableDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || device.deviceId}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
} 