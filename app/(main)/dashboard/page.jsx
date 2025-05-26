'use client'
import { Header } from '@/components/custom/Header'
import { EmailTemplate } from '@/components/custom/EmailTemplate'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState, useMemo } from 'react'
import { useUserDetail } from '@/app/provider'
import Link from 'next/link'
import { Sparkles, PlusCircle, Mail, LayoutGrid, BarChart2, Tag, Clock, TrendingUp, Users, Edit, Send, Plus, History, CheckCircle, AlertCircle } from 'lucide-react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useConvex } from 'convex/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const Dashboard = () => {
    const { userdetail } = useUserDetail()
    const [sectionLoading, setSectionLoading] = useState(true)
    const convex = useConvex()
    
    // Fetch all templates for the user
    const templates = useQuery(api.emailTemplate.GetalluserTemplate, { 
        email: userdetail?.email 
    })

    // Calculate detailed stats
    const stats = useMemo(() => {
        if (!templates) return []
        
        const totalTemplates = templates.length
        const totalSent = templates.reduce((acc, t) => acc + (t.sentCount || 0), 0)
        const activeTemplates = templates.filter(t => t.isActive).length
        const totalOpens = templates.reduce((acc, t) => acc + (t.analytics?.totalOpens || 0), 0)
        const totalClicks = templates.reduce((acc, t) => acc + (t.analytics?.totalClicks || 0), 0)
        
        // Calculate average rates only for templates that have been sent
        const sentTemplates = templates.filter(t => t.sentCount > 0)
        const avgOpenRate = sentTemplates.length > 0 
            ? sentTemplates.reduce((acc, t) => acc + (t.analytics?.openRate || 0), 0) / sentTemplates.length 
            : 0
        const avgClickRate = sentTemplates.length > 0
            ? sentTemplates.reduce((acc, t) => acc + (t.analytics?.clickRate || 0), 0) / sentTemplates.length
            : 0

        // Calculate week-over-week changes
        const now = new Date()
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const templatesThisWeek = templates.filter(t => new Date(t._creationTime) >= lastWeek).length
        const sentThisWeek = templates.reduce((acc, t) => {
            const sentThisWeek = t.recipients?.filter(r => new Date(r.timestamp) >= lastWeek).length || 0
            return acc + sentThisWeek
        }, 0)

        // Calculate most used category
        const categoryCounts = templates.reduce((acc, t) => {
            const category = t.category || 'Uncategorized'
            acc[category] = (acc[category] || 0) + 1
            return acc
        }, {})
        const mostUsedCategory = Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'

        // Calculate week-over-week engagement changes
        const opensThisWeek = templates.reduce((acc, t) => {
            const opensThisWeek = t.analytics?.opens?.filter(o => new Date(o.timestamp) >= lastWeek).length || 0
            return acc + opensThisWeek
        }, 0)
        const clicksThisWeek = templates.reduce((acc, t) => {
            const clicksThisWeek = t.analytics?.clicks?.filter(c => new Date(c.timestamp) >= lastWeek).length || 0
            return acc + clicksThisWeek
        }, 0)

        const openRateChange = totalSent > 0 
            ? ((opensThisWeek / sentThisWeek) - (totalOpens / totalSent)) * 100 
            : 0
        const clickRateChange = totalSent > 0
            ? ((clicksThisWeek / sentThisWeek) - (totalClicks / totalSent)) * 100
            : 0

        return [
            { 
                label: 'Templates', 
                value: totalTemplates,
                subtext: `${activeTemplates} active`,
                icon: LayoutGrid,
                trend: templatesThisWeek > 0 ? `+${templatesThisWeek} this week` : 'No new templates'
            },
            { 
                label: 'Emails Sent', 
                value: totalSent,
                subtext: `${totalOpens} opens, ${totalClicks} clicks`,
                icon: Mail,
                trend: totalSent > 0 
                    ? `${((totalOpens / totalSent) * 100).toFixed(1)}% open rate ${openRateChange > 0 ? '↑' : openRateChange < 0 ? '↓' : ''}`
                    : 'No emails sent yet'
            },
            { 
                label: 'Active Campaigns', 
                value: activeTemplates,
                subtext: `${avgOpenRate.toFixed(1)}% avg open rate`,
                icon: BarChart2,
                trend: totalSent > 0 
                    ? `${avgClickRate.toFixed(1)}% avg click rate ${clickRateChange > 0 ? '↑' : clickRateChange < 0 ? '↓' : ''}`
                    : 'No active campaigns'
            },
            {
                label: 'Categories',
                value: Object.keys(categoryCounts).length,
                subtext: 'Unique categories',
                icon: Tag,
                trend: `Most used: ${mostUsedCategory}`
            }
        ]
    }, [templates])

    // Calculate category distribution
    const categoryStats = useMemo(() => {
        if (!templates) return []
        
        const categories = templates.reduce((acc, t) => {
            const category = t.category || 'Uncategorized'
            acc[category] = (acc[category] || 0) + 1
            return acc
        }, {})

        return Object.entries(categories).map(([category, count]) => ({
            category,
            count,
            percentage: (count / templates.length) * 100
        }))
    }, [templates])

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

                        {/* Stats Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, idx) => (
                                <Card key={idx} className="bg-white">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">
                                            {stat.label}
                                        </CardTitle>
                                        <stat.icon className="w-4 h-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                                        <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                                    </CardContent>
                                </Card>
                            ))}
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
