'use client'
import React from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { SigninButton } from './SigninButton'
import { useUserDetail } from '@/app/provider'
import Link from 'next/link'

export const Hero = () => {
    const { userdetail } = useUserDetail()

    return (
        <section className="px-6 md:px-16 lg:px-24 xl:px-56 flex flex-col items-center text-center mt-24 max-w-7xl mx-auto">
            <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight">
                Unleash Creativity With <span className="text-primary">AI-Driven Email Templates</span>
            </h1>

            <p className="text-muted-foreground mt-6 max-w-2xl text-lg md:text-xl">
                Effortlessly craft personalized, high-converting emails using our AI-powered builder.
            </p>

            <div className="flex gap-6 mt-8">
                {
                    !userdetail?.email ? (
                        <SigninButton />
                    ) : (
                        <Link href="/dashboard">
                            <Button size="lg">Go to Dashboard</Button>
                        </Link>
                    )
                }
            </div>

            <div className="mt-12 w-full relative max-w-4xl rounded-xl overflow-hidden shadow-lg">
                <Image
                    src="/screenshot.png"
                    alt="AI email template preview"
                    width={1200}
                    height={700}
                    layout="responsive"
                    className="rounded-lg"
                    priority
                />
            </div>
        </section>
    )
}
