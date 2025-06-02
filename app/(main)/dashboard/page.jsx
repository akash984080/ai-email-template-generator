'use client'
import { Header } from '@/components/custom/Header'
import { EmailTemplate } from '@/components/custom/EmailTemplate'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useUserDetail } from '@/app/provider'
import Link from 'next/link'
import { Sparkles, PlusCircle } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useConvex } from 'convex/react'

const Dashboard = () => {
    const { userdetail } = useUserDetail()
    const [sectionLoading, setSectionLoading] = useState(true)
    const convex = useConvex()
    
    // Fetch all templates for the user
    const templates = useQuery(api.emailTemplate.GetalluserTemplate, { 
        email: userdetail?.email 
    })

    useEffect(() => {
        if (userdetail) {
            const timer = setTimeout(() => setSectionLoading(false), 1000)
            document.title = `Dashboard | ${userdetail.name} | MailCraft AI`
            return () => clearTimeout(timer)
        }
    }, [userdetail])

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="p-6 sm:px-10 md:px-28 lg:px-40 xl:px-56 mt-20 transition-all duration-300">
                {sectionLoading ? (
                    <div className="space-y-6">
                        <div className="h-8 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-10 w-60 bg-gray-200 animate-pulse rounded"></div>
                        <div className="h-40 bg-gray-200 animate-pulse rounded mt-8"></div>
                    </div>
                ) : (
                    <>
                        {/* Welcome Banner */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-2xl shadow-sm">
                            <div>
                                <h2 className="font-bold text-3xl text-gray-800 flex items-center gap-2">
                                    <Sparkles className="w-7 h-7 text-blue-500" />
                                    Welcome, {userdetail?.name || 'User'}!
                                </h2>
                                <p className="text-muted-foreground text-base mt-2 max-w-lg">
                                    Effortlessly create, manage, and send beautiful email templates. Get started with a new template or explore your recent activity below.
                                </p>
                            </div>
                            <div className="flex gap-4 mt-4 md:mt-0">
                                <Link href="/dashboard/create">
                                    <Button className="bg-blue-600 hover:bg-blue-700 flex gap-2 items-center">
                                        <PlusCircle className="w-5 h-5" /> New Email Template
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Template Gallery */}
                        <div className="mb-8">
                            <EmailTemplate />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Dashboard
