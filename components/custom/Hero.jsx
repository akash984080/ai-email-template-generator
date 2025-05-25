'use client'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { SigninButton } from './SigninButton'
import { useUserDetail } from '@/app/provider'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, Zap, Sparkles, Clock, Target, Mail } from 'lucide-react'

export const Hero = () => {
    const { userdetail } = useUserDetail()

    return (
        <section className="px-6 md:px-16 lg:px-24 xl:px-56 flex flex-col items-center text-center mt-24 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative mb-8"
            >
                <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-sm font-medium text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span>Transform Your Email Marketing with AI</span>
                </div>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight"
            >
                Create <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">High-Converting</span> Emails in Minutes, Not Hours
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl"
            >
                Our AI-powered platform helps you craft personalized, engaging emails that drive results. 
                Save 80% of your time while increasing your conversion rates.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl"
            >
                <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border/50">
                    <Clock className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Save Time</h3>
                    <p className="text-sm text-muted-foreground">Generate professional emails in seconds, not hours</p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border/50">
                    <Target className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Boost Conversions</h3>
                    <p className="text-sm text-muted-foreground">AI-optimized templates proven to increase engagement</p>
                </div>
                <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border/50">
                    <Mail className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Personalize at Scale</h3>
                    <p className="text-sm text-muted-foreground">Create unique emails for every recipient automatically</p>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 mt-12"
            >
                {
                    !userdetail?.email ? (
                        <>
                            <SigninButton />
                            
                        </>
                    ) : (
                        <Link href="/dashboard">
                            <Button size="lg" className="group">
                                Go to Dashboard
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    )
                }
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="flex flex-wrap justify-center gap-8 mt-12 text-sm text-muted-foreground"
            >
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span>10,000+ Marketing Teams Trust Us</span>
                </div>
                <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    <span>4.9/5 Customer Satisfaction</span>
                </div>
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>2.5x Average Conversion Increase</span>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-16 w-full relative max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-border/50"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                <Image
                    src="/screenshot.png"
                    alt="AI email template preview showing our powerful editor interface"
                    width={1200}
                    height={700}
                    layout="responsive"
                    className="rounded-lg hover:scale-[1.02] transition-transform duration-300"
                    priority
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-muted-foreground">
                    Try it free - No credit card required
                </div>
            </motion.div>
        </section>
    )
}
