'use client'
import { Header } from '@/components/custom/Header'
import { EmailTemplate } from '@/components/custom/EmailTemplate'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useUserDetail } from '@/app/provider'
import Link from 'next/link'
import { Sparkles, PlusCircle, Search, BarChart2, Clock, Mail, Filter } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useConvex } from 'convex/react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const Dashboard = () => {
    const { userdetail } = useUserDetail()
    const [sectionLoading, setSectionLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('recent')
    const convex = useConvex()
    
    // Fetch all templates for the user
    const templates = useQuery(api.emailTemplate.GetalluserTemplate, { 
        email: userdetail?.email 
    })

    // Calculate statistics
    const stats = {
        totalTemplates: templates?.length || 0,
        recentTemplates: templates?.filter(t => {
            const createdDate = new Date(t._creationTime)
            const now = new Date()
            return (now - createdDate) < (7 * 24 * 60 * 60 * 1000) // Last 7 days
        }).length || 0,
        sentEmails: templates?.reduce((acc, t) => acc + (t.sentCount || 0), 0) || 0
    }

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

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <Mail className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Total Templates</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats.totalTemplates}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-50 rounded-lg">
                                        <Clock className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Recent Templates</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats.recentTemplates}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-50 rounded-lg">
                                        <BarChart2 className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Emails Sent</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats.sentEmails}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">Most Recent</SelectItem>
                                    <SelectItem value="name">Name</SelectItem>
                                    <SelectItem value="usage">Most Used</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Template Gallery */}
                        <div className="mb-8">
                            <EmailTemplate searchQuery={searchQuery} sortBy={sortBy} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Dashboard
