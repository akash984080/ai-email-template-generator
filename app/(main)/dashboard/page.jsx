'use client'
import { Header } from '@/components/custom/Header'
import { EmailTemplate } from '@/components/custom/EmailTemplate'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useUserDetail } from '@/app/provider'
import Link from 'next/link'
import { Sparkles, PlusCircle, Mail, LayoutGrid, BarChart2 } from 'lucide-react'

const Dashboard = () => {
    const { userdetail } = useUserDetail()
    const [sectionLoading, setSectionLoading] = useState(true)

    useEffect(() => {
        if (userdetail) {
            const timer = setTimeout(() => setSectionLoading(false), 1000)
            return () => clearTimeout(timer)
        }
    }, [userdetail])

    // Example stats (replace with real data if available)
    const stats = [
        { label: 'Templates', value: 12, icon: LayoutGrid },
        { label: 'Emails Sent', value: 34, icon: Mail },
        { label: 'Active Campaigns', value: 2, icon: BarChart2 },
    ]

    // Example recent activity (replace with real data if available)
    const recentActivity = [
        { type: 'Sent', desc: 'Cultural Day Invite sent to 120 recipients', date: '2024-05-01' },
        { type: 'Edited', desc: 'Updated Welcome Template', date: '2024-04-28' },
        { type: 'Created', desc: 'New Promo Template', date: '2024-04-25' },
    ]

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
                                <Link href="/dashboard">
                                    <Button variant="outline" className="flex gap-2 items-center">
                                        <LayoutGrid className="w-5 h-5" /> View All Templates
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
                                    <stat.icon className="w-8 h-8 text-blue-500" />
                                    <div>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-gray-500 text-sm">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-lg mb-3">Recent Activity</h3>
                            <div className="bg-white rounded-xl shadow divide-y">
                                {recentActivity.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center px-6 py-4">
                                        <div>
                                            <span className="font-medium text-blue-600 mr-2">{item.type}</span>
                                            <span className="text-gray-700">{item.desc}</span>
                                        </div>
                                        <span className="text-gray-400 text-sm">{item.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Template Gallery */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-lg mb-3">Your Templates</h3>
                            <EmailTemplate />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Dashboard
