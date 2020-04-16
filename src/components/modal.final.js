/** @jsx jsx */
/** @jsxFrag React.Fragment */
import {jsx} from '@emotion/core'

import React from 'react'
import {Dialog} from './lib'

const ModalContext = React.createContext()

function Modal({button, ...props}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <ModalContext.Provider value={setIsOpen}>
      {React.cloneElement(button, {
        onClick: () => setIsOpen(true),
      })}
      <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
    </ModalContext.Provider>
  )
}

function ModalDismissButton({children: child}) {
  const setIsOpen = React.useContext(ModalContext)
  return React.cloneElement(child, {
    onClick: setIsOpen(false),
  })
}

export {Modal, ModalDismissButton}
