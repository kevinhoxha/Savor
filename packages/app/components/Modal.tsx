import React from 'react'
import { Modal as RNModal, Platform } from 'react-native'

const Modal = ({ children, ...props }) => (
  <RNModal
    visible
    // onRequestClose={close}
    presentationStyle="formSheet"
    animationType="slide"
    transparent={Platform.OS != 'ios'}
    {...props}
  >
    {children}
  </RNModal>
)

export default Modal
