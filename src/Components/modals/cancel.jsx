'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaSpinner } from 'react-icons/fa'

export default function PayCancel() {
    const [isOpen, setIsOpen] = useState(true)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleClose = () => {
        setIsOpen(false) // Close the dialog
    }
    const handleRedirect = () => {
        router.push('/home')
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-blue-600 h-6 w-6" />
            </div>
        )
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            />
            <div className="fixed inset-0 z-10 flex items-center justify-center p-4 text-center sm:p-0">
                <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                >
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <XMarkIcon aria-hidden="true" className="h-10 w-10 text-red-600" />
                        </div>
                        <div className="mt-3 text-center">
                            <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                Payment Canceled
                            </DialogTitle>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Your payment was not successful.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3">
                        <button
                            onClick={handleRedirect}
                            className="inline-flex w-full justify-center rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                        >
                            Go Back to Home
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}
