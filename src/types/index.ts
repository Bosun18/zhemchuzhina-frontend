export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city: string;
  roles: string[];
  created_at: string;
}

export interface RoomType {
  id: number;
  name: string;
  description?: string;
  max_guests: number;
}

export interface Room {
  id: number;
  room_type_id: number;
  number: string;
  floor: number;
  description?: string;
  is_active: boolean;
  room_type: RoomType;
  current_price?: number;
}

export interface Booking {
  id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  guests_count: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  total_price?: number;
  comment?: string;
  admin_comment?: string;
  room: Room;
  created_at: string;
}

export interface Review {
  id: number;
  user_id: number;
  rating: number;
  text: string;
  user: Pick<User, 'id' | 'name'>;
  created_at: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image?: string;
  published_at: string;
}

export interface Service {
  id: number;
  title: string;
  description?: string;
  price?: number;
  is_active: boolean;
}

export interface GalleryItem {
  id: number;
  title?: string;
  image: string;
  sort_order: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
