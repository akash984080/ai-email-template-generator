'use client'
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useUserDetail } from '@/app/provider'
import { useConvex, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Trash2Icon, Calendar, ArrowUpDown } from 'lucide-react'
import { toast } from 'sonner'

export const EmailTemplate = ({ searchQuery = '', sortBy = 'recent' }) => {
    const [EmailList, setEmailList] = useState([])
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

    // Filter and sort templates
    const filteredAndSortedTemplates = useMemo(() => {
        let filtered = EmailList;

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(template => 
                template.description?.toLowerCase().includes(query) ||
                template.language?.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        return filtered.sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b._creationTime) - new Date(a._creationTime);
                case 'name':
                    return (a.description || '').localeCompare(b.description || '');
                case 'usage':
                    return (b.sentCount || 0) - (a.sentCount || 0);
                default:
                    return 0;
            }
        });
    }, [EmailList, searchQuery, sortBy]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
                            <div className="h-48 bg-gray-200 rounded"></div>
                            <div className="h-6 bg-gray-200 rounded mt-4"></div>
                            <div className="h-10 bg-gray-200 rounded mt-4"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (filteredAndSortedTemplates.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                    <img src="/empty-state.svg" alt="No templates" className="w-48 h-48 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No templates found</h3>
                    <p className="text-gray-600 mb-6">
                        {searchQuery 
                            ? "No templates match your search criteria"
                            : "Get started by creating your first email template"}
                    </p>
                    <Link href="/dashboard/create">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Create New Template
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Your Templates</h2>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {filteredAndSortedTemplates.length} templates
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedTemplates.map((item, index) => (
                    <div 
                        key={index} 
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                                <ArrowUpDown className="w-4 h-4" />
                                {item.sentCount || 0} sent
                            </div>
                            <button 
                                onClick={() => handleTemplateDelete({ email: item.email, tId: item.tId })}
                                className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2Icon className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="relative aspect-video mb-4 bg-gray-50 rounded-lg overflow-hidden">
                            <img 
                                src="/emailbox.png" 
                                alt="email template" 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex-1 flex flex-col">
                            <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">
                                {item.description || 'Untitled Template'}
                            </h3>
                            {item.language && (
                                <span className="text-xs text-gray-500 mb-3">
                                    {item.language.toUpperCase()}
                                </span>
                            )}
                            <div className="mt-auto pt-4">
                                <Link href={`/editor/${item.tId}`}>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                        View / Edit
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
