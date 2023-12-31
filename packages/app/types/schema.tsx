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
  address: Address
  cuisine: string
  name: string
  ownerId: string
  promotions?: Record<string, Promotion>
  id?: string // if restaurant id is needed
}

export type Reservation = {
    createdBy: string;
    discount: number;
    partySize: number;
    promotionId: string;
    reservationTime: Timestamp;
    restaurantId: string;
    cancelled?: boolean;
    restaurantData: Restaurant;
  };

export type Address = {
  address: string
  city: string
  state: string
  zip: string
}