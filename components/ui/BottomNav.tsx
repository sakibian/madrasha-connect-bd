/**
 * BottomNav — mobile-only tab bar.
 *
 * 95% of our target users are on phones, so the primary navigation lives at
 * the bottom of the screen (thumb-reachable) instead of behind a hamburger.
 *
 * Tabs:
 *   Home     → /dashboard  (logged-in) or /            (logged-out)
 *   Explore  → /institutions
 *   Ask      → /fatwa
 *   Learn    → /knowledge
 *   Profile  → /profile-builder (logged-in) or /login  (logged-out)
 *
 * Hidden ≥ md — desktop keeps the sidebar. Uses `safe-area-inset-bottom`
 * so iPhone home-indicator doesn't overlap the tabs.
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Compass, MessageCircleQuestion, GraduationCap, User } from 'lucide-react';
import { useAuthStore } from '../../stores';

interface Tab {
  key: string;
  labelKey: string;
  fallback: string;
  icon: React.ReactNode;
  to: (isLoggedIn: boolean) => string;
}

const TABS: Tab[] = [
  { key: 'home',    labelKey: 'bottomNav.home',    fallback: 'Home',    icon: <Home size={22} />,                  to: loggedIn => loggedIn ? '/dashboard' : '/' },
  { key: 'explore', labelKey: 'bottomNav.explore', fallback: 'Explore', icon: <Compass size={22} />,               to: () => '/institutions' },
  { key: 'ask',     labelKey: 'bottomNav.ask',     fallback: 'Ask',     icon: <MessageCircleQuestion size={22} />, to: () => '/fatwa' },
  { key: 'learn',   labelKey: 'bottomNav.learn',   fallback: 'Learn',   icon: <GraduationCap size={22} />,         to: () => '/knowledge' },
  { key: 'profile', labelKey: 'bottomNav.profile', fallback: 'Profile', icon: <User size={22} />,                  to: loggedIn => loggedIn ? '/profile-builder' : '/login' },
];

const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

  return (
    <nav
      className="
        md:hidden fixed inset-x-0 bottom-0 z-40
        bg-white border-t border-gray-200
        pb-[env(safe-area-inset-bottom)]
      "
      aria-label="Primary mobile navigation"
      data-testid="bottom-nav"
    >
      <ul className="grid grid-cols-5">
        {TABS.map(tab => {
          const to = tab.to(isLoggedIn);
          return (
            <li key={tab.key}>
              <NavLink
                to={to}
                end={to === '/' || to === '/dashboard'}
                className={({ isActive }) =>
                  [
                    'flex flex-col items-center justify-center gap-1',
                    'min-h-[56px] py-2',
                    'text-[10px] font-bold uppercase tracking-widest',
                    'transition-colors',
                    isActive ? 'text-black' : 'text-gray-500 hover:text-black',
                  ].join(' ')
                }
                aria-label={t(tab.labelKey, tab.fallback)}
              >
                {({ isActive }) => (
                  <>
                    <span aria-hidden className={isActive ? '' : 'opacity-80'}>
                      {tab.icon}
                    </span>
                    <span>{t(tab.labelKey, tab.fallback)}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
