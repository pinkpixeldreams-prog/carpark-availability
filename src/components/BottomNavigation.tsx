import React from 'react';
import { Map, ListFilter, Bookmark, Info } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  savedCount: number;
  nearbyCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  nearbyCount,
}) => {
  const navItems = [
    {
      id: 'map' as ActiveTab,
      label: 'Map View',
      icon: Map,
      badge: null,
    },
    {
      id: 'list' as ActiveTab,
      label: 'Nearby Lots',
      icon: ListFilter,
      badge: nearbyCount > 0 ? nearbyCount : null,
    },
    {
      id: 'saved' as ActiveTab,
      label: 'Saved',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : null,
    },
    {
      id: 'info' as ActiveTab,
      label: 'Rates & Guide',
      icon: Info,
      badge: null,
    },
  ];

  return (
    <nav
      id="app-bottom-navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 pb-safe transition-all shadow-lg"
      aria-label="Main Navigation"
    >
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? 'text-blue-600 scale-105'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />

                {/* Badge if available */}
                {item.badge !== null && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] mt-1 font-medium leading-none ${
                  isActive ? 'font-semibold text-blue-600' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-blue-600 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
