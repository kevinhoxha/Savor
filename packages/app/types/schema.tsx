import { Timestamp } from '@firebase/firestore'

export type Promotion = {
  startTime: Timestamp
  endTime: Timestamp
  quantityAvailable: number
  title: string
  restaurantId: string
  discountPercentage?: string
}

export type Restaurant = {
  address: string
  cuisine: string
  name: string
  ownerId: string
  promotions?: Record<string, Promotion>
}

export type Reservation = {
    createdBy: string;
    discount: number;
    partySize: number;
    promotionId: string;
    reservationTime: Timestamp;
    restaurantId: string;
    cancelled?: boolean;
  };