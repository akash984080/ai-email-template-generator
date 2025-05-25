'use client'
import { Header } from '@/components/custom/Header'
import { EmailTemplate } from '@/components/custom/EmailTemplate'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState, useMemo } from 'react'
import { useUserDetail } from '@/app/provider'
import Link from 'next/link'
import { Sparkles, PlusCircle, Mail, LayoutGrid, BarChart2, Tag, Clock, TrendingUp, Users } from 'lucide-react'
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
        const avgOpenRate = templates.reduce((acc, t) => acc + (t.analytics?.openRate || 0), 0) / totalTemplates || 0
        const avgClickRate = templates.reduce((acc, t) => acc + (t.analytics?.clickRate || 0), 0) / totalTemplates || 0

        return [
            { 
                label: 'Templates', 
                value: totalTemplates,
                subtext: `${activeTemplates} active`,
                icon: LayoutGrid,
                trend: '+2 this week'
            },
            { 
                label: 'Emails Sent', 
                value: totalSent,
                subtext: `${totalOpens} opens, ${totalClicks} clicks`,
                icon: Mail,
                trend: `${((totalOpens / totalSent) * 100).toFixed(1)}% open rate`
            },
            { 
                label: 'Active Campaigns', 
                value: activeTemplates,
                subtext: `${avgOpenRate.toFixed(1)}% avg open rate`,
                icon: BarChart2,
                trend: `${avgClickRate.toFixed(1)}% avg click rate`
            },
            {
                label: 'Categories',
                value: new Set(templates.map(t => t.category).filter(Boolean)).size,
                subtext: 'Unique categories',
                icon: Tag,
                trend: 'Most used: Promotional'
            }
        ]
    }, [templates])

    // Generate detailed recent activity
    const recentActivity = useMemo(() => {
        if (!templates) return []
        
        const activities = []
        templates.forEach(template => {
            // Add version history activities
            if (template.versionHistory) {
                template.versionHistory.forEach(version => {
                    activities.push({
                        type: 'Updated',
                        desc: `Version ${version.version} of ${template.description || 'Template'}`,
                        date: new Date(version.timestamp).toISOString().split('T')[0],
                        details: version.changes,
                        category: template.category
                    })
                })
            }

            // Add recipient activities
            if (template.recipients) {
                template.recipients.forEach(recipient => {
                    activities.push({
                        type: recipient.status.charAt(0).toUpperCase() + recipient.status.slice(1),
                        desc: `${template.description || 'Template'} ${recipient.status} by ${recipient.email}`,
                        date: new Date(recipient.timestamp).toISOString().split('T')[0],
                        category: template.category
                    })
                })
            }

            // Add template lifecycle activities
            if (template.lastSent) {
                activities.push({
                    type: 'Sent',
                    desc: `${template.description || 'Template'} sent to ${template.recipients?.length || 0} recipients`,
                    date: new Date(template.lastSent).toISOString().split('T')[0],
                    category: template.category,
                    analytics: template.analytics
                })
            }
            if (template.lastEdited) {
                activities.push({
                    type: 'Edited',
                    desc: `Updated ${template.description || 'Template'}`,
                    date: new Date(template.lastEdited).toISOString().split('T')[0],
                    category: template.category
                })
            }
            if (template._creationTime) {
                activities.push({
                    type: 'Created',
                    desc: `New ${template.description || 'Template'}`,
                    date: new Date(template._creationTime).toISOString().split('T')[0],
                    category: template.category
                })
            }
        })
        
        return activities
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10)
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

                        {/* Category Distribution */}
                    

                        {/* Recent Activity */}
                        <div className="mb-8">
                            <h3 className="font-semibold text-lg mb-3">Recent Activity</h3>
                            <div className="bg-white rounded-xl shadow divide-y">
                                {recentActivity.map((item, idx) => (
                                    <div key={idx} className="px-6 py-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-blue-600">{item.type}</span>
                                                    {item.category && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {item.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-gray-700 mt-1">{item.desc}</p>
                                                {item.details && (
                                                    <p className="text-sm text-gray-500 mt-1">{item.details}</p>
                                                )}
                                                {item.analytics && (
                                                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <TrendingUp className="w-4 h-4" />
                                                            {item.analytics.openRate.toFixed(1)}% open rate
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Users className="w-4 h-4" />
                                                            {item.analytics.clickRate.toFixed(1)}% click rate
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                {item.date}
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
