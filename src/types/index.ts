// Пользователь — ProfileController.formatUser()
// возвращает: id, name, email, phone, city, role
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  city: string;
  role: string;
}

export interface RoomType {
  id: number;
  name: string;
  description?: string;
  max_guests: number;
  photos?: string[];
}

// Номер — RoomController.formatRoom()
// возвращает: id, number, floor, type: {id, name, max_guests, description}
export interface Room {
  id: number;
  number: number;
  floor: number;
  type: RoomType;
}

// Календарь занятости — RoomController.calendar()
// возвращает активные номера, у каждого массив броней на запрошенный период.
export interface CalendarBooking {
  check_in: string;
  check_out: string;
  status: 'pending' | 'confirmed';
}

export interface CalendarRoom extends Room {
  bookings: CalendarBooking[];
}

// Упрощённый номер внутри бронирования — BookingController.formatBooking()
// возвращает: id, number, type (строка — название типа, не объект)
export interface BookingRoom {
  id: number;
  number: number;
  type: string;
}

// Отзыв на бронь внутри бронирования — formatBooking() кладёт null,
// пока отзыв не оставлен. Оставить отзыв можно только на confirmed-бронь
// без отзыва; свой отзыв можно отредактировать (статус снова pending).
// Ту же форму возвращают POST/PATCH /reviews.
export interface BookingReview {
  id: number;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  text: string;
}

// Бронирование — BookingController.formatBooking()
// возвращает: id, check_in, check_out, guests_count, status, comment, review, room
export interface Booking {
  id: number;
  check_in: string;
  check_out: string;
  guests_count: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  comment?: string;
  admin_comment?: string;
  review: BookingReview | null;
  room: BookingRoom;
}

// Отзыв — ReviewController.index()
// возвращает: id, rating, text, user (строка — имя пользователя), created_at, admin_comment
export interface Review {
  id: number;
  rating: number;
  text: string;
  user: string;
  created_at: string;
  admin_comment?: string;
}

// Новость — NewsController
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image?: string;
  published_at: string;
}

// Услуга — price приходит как строка "2500.00" из-за decimal:2 в Laravel
export interface Service {
  id: number;
  title: string;
  description?: string;
  price?: string;
  image?: string;
}

// Галерея — GalleryController возвращает поле caption, не title
export interface GalleryItem {
  id: number;
  caption?: string;
  image: string;
  sort_order: number;
}

// Уведомление — NotificationController.formatNotification()
// возвращает: id, title, body, icon, color, url, read_at, created_at
export interface Notification {
  id: string;
  title: string | null;
  body: string | null;
  icon?: string | null;
  color?: string | null;
  url?: string | null;
  read_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
