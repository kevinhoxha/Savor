import { Restaurant } from 'app/types/schema'
import moment from 'moment'

export const formatDate = (date: Date) => {
  return moment(date).format('MMMM Do YYYY, h:mm a')
}

export function groupRestaurantsByCuisine(restaurants) {
  const grouped = {}

  restaurants.forEach((restaurantEntry: Restaurant) => {
    const id = restaurantEntry[0]
    const restaurant: Restaurant = restaurantEntry[1]

    const cuisine = restaurant.cuisine || 'Other'
    if (!grouped[cuisine]) {
      grouped[cuisine] = []
    }
    grouped[cuisine].push({ id, ...restaurant })
  })

  return grouped
}
