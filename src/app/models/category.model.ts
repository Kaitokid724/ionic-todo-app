export interface Category {
  id: string;
  name: string;
  color: CategoryColor;
  icon: string;
  taskCount?: number;
  createdAt: number;
}

export type CategoryColor =
  | 'indigo'
  | 'violet'
  | 'cyan'
  | 'emerald'
  | 'amber'
  | 'rose'
  | 'pink'
  | 'sky';

export const CATEGORY_COLORS: { value: CategoryColor; hex: string; label: string }[] = [
  { value: 'indigo', hex: '#5c49e0', label: 'Índigo' },
  { value: 'violet', hex: '#9b59f7', label: 'Violeta' },
  { value: 'cyan', hex: '#00d2d3', label: 'Cian' },
  { value: 'emerald', hex: '#2ed573', label: 'Esmeralda' },
  { value: 'amber', hex: '#ffa502', label: 'Ámbar' },
  { value: 'rose', hex: '#ff4757', label: 'Rosa rojo' },
  { value: 'pink', hex: '#ff6b9d', label: 'Rosa' },
  { value: 'sky', hex: '#70a1ff', label: 'Cielo' },
];

export const CATEGORY_ICONS: string[] = [
  'briefcase-outline',
  'home-outline',
  'school-outline',
  'fitness-outline',
  'cart-outline',
  'book-outline',
  'code-slash-outline',
  'heart-outline',
  'planet-outline',
  'musical-notes-outline',
  'camera-outline',
  'restaurant-outline',
  'car-outline',
  'airplane-outline',
  'paw-outline',
];
