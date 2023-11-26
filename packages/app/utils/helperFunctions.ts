import moment from 'moment'

export const formatDate = (date: Date) => {
  return moment(date).format('MMMM Do YYYY, h:mm a')
}
