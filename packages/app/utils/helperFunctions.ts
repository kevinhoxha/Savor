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

export const images = {
  '1mUlG9w2FKGVJnQ8zMju': require('./assets/restaurants/1mUlG9w2FKGVJnQ8zMju.jpg'),
  '3EzfnnQLrRhi0pO8SIBF': require('./assets/restaurants/3EzfnnQLrRhi0pO8SIBF.jpg'),
  '03FzB4XP0t3aPdnmkHIb': require('./assets/restaurants/03FzB4XP0t3aPdnmkHIb.jpg'),
  '5SAg3jbZ9JFsmynYBK2P': require('./assets/restaurants/5SAg3jbZ9JFsmynYBK2P.jpg'),
  '15q0nfA8NeSyVJUZwrJm': require('./assets/restaurants/15q0nfA8NeSyVJUZwrJm.jpg'),
  '53l6BRzVvy8EZuvSGKjv': require('./assets/restaurants/53l6BRzVvy8EZuvSGKjv.jpg'),
  bo6BmLisKTXq8IpgtnvK: require('./assets/restaurants/bo6BmLisKTXq8IpgtnvK.jpg'),
  Cfz0kzk1N2U8Xkn0aaXA: require('./assets/restaurants/Cfz0kzk1N2U8Xkn0aaXA.jpg'),
  dAij9xmtOaCnMVl475Kt: require('./assets/restaurants/dAij9xmtOaCnMVl475Kt.jpg'),
  DrQPme8RAEwJkmEY5R4B: require('./assets/restaurants/DrQPme8RAEwJkmEY5R4B.jpg'),
  e36AMVlIQkqZ2D25ij2t: require('./assets/restaurants/e36AMVlIQkqZ2D25ij2t.jpg'),
  Iq5b4PvAojI0BlP3lnFh: require('./assets/restaurants/Iq5b4PvAojI0BlP3lnFh.jpg'),
  KHKXEfGAYoHvbPYmtIJQ: require('./assets/restaurants/KHKXEfGAYoHvbPYmtIJQ.jpg'),
  lthVOj2wt3Uos65mGfmy: require('./assets/restaurants/lthVOj2wt3Uos65mGfmy.jpg'),
  NxBtWbicFMIvSqF9pqVQ: require('./assets/restaurants/NxBtWbicFMIvSqF9pqVQ.jpg'),
  oiQWTMl8kVBFBxh6yWbH: require('./assets/restaurants/oiQWTMl8kVBFBxh6yWbH.jpg'),
  OjdE504wlvoQeDa9yUzg: require('./assets/restaurants/OjdE504wlvoQeDa9yUzg.jpg'),
  PK3XE9HzZw2sEEK7Tam6: require('./assets/restaurants/PK3XE9HzZw2sEEK7Tam6.jpg'),
  PTU4DiJHhHoDhQe3GWxF: require('./assets/restaurants/PTU4DiJHhHoDhQe3GWxF.jpg'),
  QZNvNUIKT4HzMBcHC31C: require('./assets/restaurants/QZNvNUIKT4HzMBcHC31C.jpg'),
  rAEqSc41pb9RVlcRFIrY: require('./assets/restaurants/rAEqSc41pb9RVlcRFIrY.jpg'),
  RbezQg2pKXTb5mhjmMEp: require('./assets/restaurants/RbezQg2pKXTb5mhjmMEp.jpg'),
  vMqrHI4ejNltsfOd7dNI: require('./assets/restaurants/vMqrHI4ejNltsfOd7dNI.jpg'),
  x9jSKe6lxjmf75SDHvRd: require('./assets/restaurants/x9jSKe6lxjmf75SDHvRd.jpg'),
}
