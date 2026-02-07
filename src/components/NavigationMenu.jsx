import React, { useState } from 'react';
import { Navigation, Zap, Fuel, X, Loader2, MapPin, ArrowLeft, ExternalLink } from 'lucide-react';

const NavigationMenu = ({
  isOpen,
  onClose,
  onNavigateToStation,
  isLocating,
  userLocation,
  nearestStation,
  stationType,
  onStartNavigation,
  onBack,
}) => {
  const [selectedType, setSelectedType] = useState(null);

  if (!isOpen) return null;

  const handleStationSelect = (type) => {
    setSelectedType(type);
    onNavigateToStation(type);
  };

  const handleBack = () => {
    setSelectedType(null);
    if (nearestStation) {
      onBack();
    }
  };

  const openInGoogleMaps = () => {
    if (userLocation && nearestStation) {
      const url = `https://www.google.com/maps/dir/${userLocation[0]},${userLocation[1]}/${nearestStation.lat},${nearestStation.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div 
        className="glass rounded-3xl p-6 w-[400px] max-w-[90vw] shadow-2xl border border-white/10"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {selectedType && (
              <button
                onClick={handleBack}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Navigation size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Find Nearest Station</h2>
              <p className="text-xs text-gray-500">Navigate to EV or Petrol station</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {!selectedType && !isLocating && !nearestStation && (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-4">
              Select the type of station you want to find:
            </p>
            
            <button
              onClick={() => handleStationSelect('ev')}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                <Zap size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">EV Charging Station</h3>
                <p className="text-xs text-gray-500">Find nearest electric vehicle charger</p>
              </div>
            </button>

            <button
              onClick={() => handleStationSelect('petrol')}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 hover:border-red-500/40 hover:from-red-500/20 hover:to-rose-500/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
                <Fuel size={24} className="text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold">Petrol Station</h3>
                <p className="text-xs text-gray-500">Find nearest fuel station</p>
              </div>
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLocating && (
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center animate-pulse">
              <Loader2 size={32} className="text-white animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white font-medium">Locating you...</p>
              <p className="text-xs text-gray-500 mt-1">Finding nearest {stationType === 'ev' ? 'EV charging' : 'petrol'} station</p>
            </div>
          </div>
        )}

        {/* Result State */}
        {nearestStation && !isLocating && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  stationType === 'ev' 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-500' 
                    : 'bg-gradient-to-br from-red-500 to-rose-500'
                }`}>
                  {stationType === 'ev' ? <Zap size={20} className="text-white" /> : <Fuel size={20} className="text-white" />}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{nearestStation.name || (stationType === 'ev' ? 'EV Station' : 'Petrol Station')}</h3>
                  {nearestStation.operator && (
                    <p className="text-xs text-gray-400">{nearestStation.operator}</p>
                  )}
                  {nearestStation.brand && (
                    <p className="text-xs text-gray-400">{nearestStation.brand}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                <MapPin size={14} className="text-gray-500" />
                <span className="text-sm text-gray-400">
                  {nearestStation.distance.toFixed(2)} km away
                </span>
              </div>
            </div>

            <button
              onClick={openInGoogleMaps}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              <ExternalLink size={18} />
              Open in Google Maps
            </button>

            <button
              onClick={handleBack}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
            >
              <ArrowLeft size={16} />
              Find Another Station
            </button>
          </div>
        )}

        {/* Footer - Close and go to drawing */}
        {!isLocating && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all text-sm"
            >
              Close and Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationMenu;
