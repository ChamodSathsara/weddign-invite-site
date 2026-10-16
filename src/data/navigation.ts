import { CalendarHeartIcon, HeartIcon, HomeIcon, MailIcon, MapPinIcon, type LucideIcon } from 'lucide-react';

export type NavId = 'home' | 'story' | 'event' | 'location' | 'rsvp';

export interface NavItem {
  id: NavId;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
{ id: 'home', icon: HomeIcon },
{ id: 'story', icon: HeartIcon },
{ id: 'event', icon: CalendarHeartIcon },
{ id: 'location', icon: MapPinIcon },
{ id: 'rsvp', icon: MailIcon }];


export const navIds: string[] = navItems.map((item) => item.id);