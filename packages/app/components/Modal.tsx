import { Modal, Platform } from 'react-native'

export const MyModal = ({ children, ...props }) => (
  <Modal
    visible
    // onRequestClose={close}
    presentationStyle='formSheet'
    animationType="slide"
    transparent={Platform.OS != 'ios'}
    {...props}
  >
    {children}
  </Modal>
)

export default MyModal