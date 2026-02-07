import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Trash2, Minimize2, Eye } from "lucide-react";

/**
 * RegionSelector - Compact floating UI panel for selecting and navigating optimal regions
 * Works with costRanks structure from backend (already grouped by cost)
 */
const RegionSelector = ({ 
  costRanks, 
  onSelectRegion, 
  onShowAll,    // Show all markers
  onClose,      // Hide selector (keeps locations on map)
  onClear       // Clear all locations
}) => {
  const [currentRank, setCurrentRank] = useState(0);
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const [isShowingAll, setIsShowingAll] = useState(true); // Start showing all

  // Color palette matching optimalLocationFinder.js
  const COLORS = [
    { primary: '#10b981', secondary: '#059669', light: '#d1fae5' },
    { primary: '#3b82f6', secondary: '#2563eb', light: '#dbeafe' },
    { primary: '#8b5cf6', secondary: '#7c3aed', light: '#ede9fe' },
    { primary: '#f59e0b', secondary: '#d97706', light: '#fef3c7' },
    { primary: '#ef4444', secondary: '#dc2626', light: '#fee2e2' },
  ];

  const rankEmojis = ['🥇', '🥈', '🥉'];

  useEffect(() => {
    // Don't auto-select on mount - show all markers initially
    // User can click to select a specific region
  }, []);

  if (!costRanks || costRanks.length === 0) {
    return null;
  }

  const currentRankData = costRanks[currentRank];
  const currentSubLocations = currentRankData?.subLocations || [];
  const hasMultipleSubLocations = currentSubLocations.length > 1;

  const handleRankSelect = (rankIndex) => {
    setCurrentRank(rankIndex);
    setCurrentSubIndex(0);
    setIsShowingAll(false); // Now showing specific region
    const rank = costRanks[rankIndex];
    if (rank && rank.subLocations[0]) {
      onSelectRegion(rank.subLocations[0], rankIndex, 0, rank.cost);
    }
  };

  const handleShowAll = () => {
    setIsShowingAll(true);
    if (onShowAll) {
      onShowAll();
    }
  };

  const handlePrevSubRegion = () => {
    if (currentSubIndex > 0) {
      const newIndex = currentSubIndex - 1;
      setCurrentSubIndex(newIndex);
      setIsShowingAll(false);
      onSelectRegion(currentSubLocations[newIndex], currentRank, newIndex, currentRankData.cost);
    }
  };

  const handleNextSubRegion = () => {
    if (currentSubIndex < currentSubLocations.length - 1) {
      const newIndex = currentSubIndex + 1;
      setCurrentSubIndex(newIndex);
      setIsShowingAll(false);
      onSelectRegion(currentSubLocations[newIndex], currentRank, newIndex, currentRankData.cost);
    }
  };

  return (
    <div 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
      style={{ zIndex: 9999, maxWidth: "95vw" }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Compact Header with Controls */}
        <div 
          className="px-3 py-2 flex items-center justify-between"
          style={{ background: isShowingAll 
            ? 'linear-gradient(135deg, #6366f1, #4f46e5)' 
            : `linear-gradient(135deg, ${COLORS[currentRank % COLORS.length].primary}, ${COLORS[currentRank % COLORS.length].secondary})` }}
        >
          <span className="text-white font-medium text-sm">
            {isShowingAll ? '📍 All Locations' : `${rankEmojis[currentRank] || `#${currentRank + 1}`} Optimal Location`}
          </span>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleShowAll}
              className={`p-1 rounded transition-colors ${isShowingAll 
                ? 'text-white bg-white/30' 
                : 'text-white/80 hover:text-white hover:bg-white/20'}`}
              title="Show all locations"
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
              title="Minimize"
            >
              <Minimize2 size={16} />
            </button>
            <button 
              onClick={onClear}
              className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded transition-colors"
              title="Clear all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-3 py-2">
          {/* Rank Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
            {costRanks.map((rank, idx) => {
              const colors = COLORS[idx % COLORS.length];
              const isSelected = currentRank === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleRankSelect(idx)}
                  className={`
                    flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                    transition-all duration-150 shrink-0 border
                    ${isSelected 
                      ? 'text-white border-transparent shadow-sm' 
                      : 'text-gray-600 bg-gray-50 border-gray-200 hover:border-gray-300'
                    }
                  `}
                  style={isSelected ? { 
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` 
                  } : {}}
                >
                  <span>{idx < 3 ? rankEmojis[idx] : `#${idx + 1}`}</span>
                  <span className="hidden sm:inline">{rank.cost.toFixed(2)}</span>
                  {rank.subLocationCount > 1 && (
                    <span className={`
                      text-[10px] px-1 rounded
                      ${isSelected ? 'bg-white/30' : 'bg-gray-200'}
                    `}>
                      ×{rank.subLocationCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-location Navigator (only if multiple) */}
          {hasMultipleSubLocations && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-2 mt-1">
              <button
                onClick={handlePrevSubRegion}
                disabled={currentSubIndex === 0}
                className={`p-1.5 rounded ${
                  currentSubIndex === 0 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-xs text-gray-600">
                  Location <strong>{currentSubIndex + 1}</strong> of {currentSubLocations.length}
                </span>
                {/* Dots */}
                <div className="flex gap-1">
                  {currentSubLocations.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentSubIndex(idx);
                        onSelectRegion(currentSubLocations[idx], currentRank, idx, currentRankData.cost);
                      }}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{ 
                        backgroundColor: COLORS[currentRank % COLORS.length].primary,
                        opacity: idx === currentSubIndex ? 1 : 0.3
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleNextSubRegion}
                disabled={currentSubIndex >= currentSubLocations.length - 1}
                className={`p-1.5 rounded ${
                  currentSubIndex >= currentSubLocations.length - 1 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionSelector;
