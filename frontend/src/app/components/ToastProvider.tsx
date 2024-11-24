'use client'

import type React from 'react'
import { Flip, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <ToastContainer
        toastClassName="rounded-lg min-w-96 text-center"
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Flip}
      />
    </>
  )
}
