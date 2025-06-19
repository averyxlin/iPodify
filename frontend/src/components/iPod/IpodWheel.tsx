import React from 'react';
import { useIpodContext } from '../../contexts/IpodContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

export function IpodWheel() {
  const { onMenu, onPlayPause, onUp, onDown, onCenter, isPlaying } = useIpodContext();
  return (
    <div className="w-56 h-56 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full flex flex-col items-center justify-center relative shadow-inner">
      <button className="absolute top-6 left-1/2 -translate-x-1/2 text-gray-700 font-bold" onClick={onMenu}>MENU</button>
      <button className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" aria-label="Previous" onClick={onUp}>
        <FontAwesomeIcon icon={faCaretLeft} size="lg" />
      </button>
      <button className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600" aria-label="Next" onClick={onDown}>
        <FontAwesomeIcon icon={faCaretRight} size="lg" />
      </button>
      <button 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-600" 
        aria-label="Play/Pause"
        onClick={onPlayPause}
      >
        <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="sm" className="inline" />
      </button>
      <button className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" onClick={onCenter} aria-label="Select Song" />
    </div>
  );
} 