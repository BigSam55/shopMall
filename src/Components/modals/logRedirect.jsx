'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

export default function LogRedirect() {
    const [isOpen, setIsOpen] = useState(true)
    const router = useRouter()

  const handleClose = () => {
    setIsOpen(true)
  }
  
  const handleRegister = () => {
    router.push('/registration')
  }
  const handlelogin = () => {
    router.push('/login')
  }
  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-10">
      <DialogBackdrop
        transition
        className=" fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in "
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto ">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="block  bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
              <div className="block items-center justify-center content-center">
                <div className="  mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 ">
                  <LockClosedIcon aria-hidden="true" className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center ">
                  <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                   Please Login
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Thanks for choosing ShopMall. 
                      <p>Please login your account or create an account for new customers.</p> 
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex gap-2 content-center items-center bg-gray-50 px-4 py-3 ">
               
              <button
              onClick={handlelogin}
                className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 "
              >
                Login account
              </button>
              <button
              onClick={handleRegister}
                className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 "
              >
                Create account
              </button>
               
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
