'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useUserDetail } from '@/app/provider'
import { useConvex, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'

export const EmailTemplate = () => {
    const [EmailList, setEmailList] = useState([])
    console.log(EmailList);
    
    const [loading, setLoading] = useState(true)
    const { userdetail } = useUserDetail()
    const convex = useConvex()
    const deleteTemplate = useMutation(api.emailTemplate.DeleteTemplate)

    useEffect(() => {
        if (userdetail) {
            getTemplateList()
        }
    }, [userdetail])

    const getTemplateList = async () => {
        setLoading(true)
        try {
            const result = await convex.query(api.emailTemplate.GetalluserTemplate, {
                email: userdetail?.email,
            })
            setEmailList(result)
            
        } catch (err) {
            toast('Failed to load templates')
        } finally {
            setLoading(false)
        }
    }

    const handleTemplateDelete = useCallback(async ({ email, tId }) => {
        try {
            await deleteTemplate({ email, tId })
            toast.success('Template deleted successfully!')
            getTemplateList()
        } catch (error) {
            console.error('Failed to delete template:', error)
            toast.error('Error deleting template.')
        }
    }, [deleteTemplate])

    const renderSkeletons = () => (
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5'>
            {[...Array(8)].map((_, idx) => (
                <div key={idx} className='bg-white p-4 rounded shadow-md border animate-pulse space-y-4'>
                    <div className='h-6 w-6 bg-gray-200 rounded-full ml-auto' />
                    <div className='h-40 bg-gray-200 w-full rounded' />
                    <div className='h-4 bg-gray-200 w-3/4 rounded' />
                    <div className='h-10 bg-gray-200 rounded' />
                </div>
            ))}
        </div>
    )

    return (
        <div>
            <h2 className='font-bold text-xl text-primary mb-3'>Your Email Templates</h2>

            {loading ? (
                renderSkeletons()
            ) : EmailList.length === 0 ? (
                <div className='flex flex-col items-center justify-center mt-10 text-center'>
                    <Image src='/email.png' alt='No templates' height={250} width={250} />
                    <p className='text-gray-600 mt-4'>No templates found. Start creating your first email template!</p>
                    <Link href='/dashboard/create'>
                        <Button className='mt-6'>+ Create New</Button>
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5'>
                    {EmailList.map((item, index) => (
                        <div key={index} className='bg-white p-4 rounded shadow-md border hover:shadow-lg transition-all flex flex-col'>
                            <div className='flex justify-end text-red-500 hover:text-red-700 cursor-pointer'>
                                <Trash2Icon onClick={() => handleTemplateDelete({ email: item.email, tId: item.tId })} />
                            </div>
                            <img src='/emailbox.png' alt='email template' height={250} width={250} className='w-full object-contain rounded' />
                            <div className='flex-1 flex flex-col mt-2'>
                                <h2 className='mb-3 text-gray-800 font-medium truncate'>{item?.description}</h2>
                                <div className='mt-auto'>
                                    <Link href={`/editor/${item.tId}`}>
                                        <Button className='w-full bg-blue-600 hover:bg-blue-700'>View / Edit</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
