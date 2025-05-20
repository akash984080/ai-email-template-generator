"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { SigninButton } from './SigninButton'
import Link from 'next/link'
import { useUserDetail } from '@/app/provider'
import { Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const Header = () => {
    const { userdetail, setuserdetail } = useUserDetail()
    const [menuOpen, setMenuOpen] = useState(false)
    const router = useRouter()
    useEffect(() => {
        const storedUser = localStorage.getItem("userdetails");
        if (storedUser) {
            setuserdetail(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userdetails");
        setuserdetail(null);
        setMenuOpen(false)
        router.push('/')
    }

    const toggleMenu = () => setMenuOpen(prev => !prev)

    return (
        <>
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/next.svg" height={40} width={40} alt="logo" />
                        <span className="text-xl font-semibold text-gray-800">MyApp</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-4">
                        {userdetail?.email ? (
                            <>
                                <Link href="/dashboard">
                                    <Button className="transition hover:scale-105">Dashboard</Button>
                                </Link>
                                <Image
                                    src={userdetail?.picture || '/default-avatar.png'}
                                    alt="User"
                                    height={40}
                                    width={40}
                                    className="rounded-full border hover:scale-105 transition"
                                />
                                <Button
                                    variant="outline"
                                    onClick={handleLogout}
                                    className="hover:bg-red-50 hover:text-red-600 transition"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <SigninButton />
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Backdrop Overlay */}
            {menuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Slide-in Drawer */}
            <div className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b">
                    <span className="text-lg font-semibold text-gray-800">Menu</span>
                    <button onClick={toggleMenu} aria-label="Close menu">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    {userdetail?.email ? (
                        <>
                            <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                                <Button className="w-full">Dashboard</Button>
                            </Link>
                            <div className="flex items-center space-x-3 mt-2">
                                <Image
                                    src={userdetail?.picture || '/default-avatar.png'}
                                    alt="User"
                                    height={40}
                                    width={40}
                                    className="rounded-full border"
                                />
                                <span className="text-sm text-gray-600">{userdetail?.email}</span>
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="w-full mt-4"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <SigninButton />
                    )}
                </div>
            </div>
        </>
    )
}
