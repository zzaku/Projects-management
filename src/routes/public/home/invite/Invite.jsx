import React, { useState } from 'react'
import { ModalInvite } from '../../../../components/modal/modalInvite/ModalInvite'

export const Invite = () => {

    const [open, setOpen] = useState(true)

  return (
    <ModalInvite open={open} setOpen={setOpen}/>
  )
}
