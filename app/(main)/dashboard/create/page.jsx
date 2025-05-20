


"use client";
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Pencil } from 'lucide-react';
import AIInputbox from '@/components/custom/AIInputbox';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';

const Create = () => {
    const router = useRouter();
    const tId = uuidv4();

    const handleEditorRouter = () => {
        router.push('/editor/' + tId);
    };

    return (
        <div className="px-6 md:px-20 lg:px-56 xl:px-72 mt-20">
            <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="font-bold text-3xl md:text-4xl text-primary mb-3">
                    CREATE NEW EMAIL TEMPLATE
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-md">
                    Create Stunning Emails Effortlessly with Advanced AI and Deep Customization
                </p>

                <Tabs defaultValue="Create with AI" className="w-full max-w-[500px] mt-10">
                    <TabsList className="grid grid-cols-2 w-full bg-muted p-1 rounded-xl shadow-sm">
                        <TabsTrigger
                            value="Create with AI"
                            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> Create with AI
                            </span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="Start from Scratch"
                            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
                        >
                            <span className="flex items-center gap-2">
                                <Pencil className="h-4 w-4" /> Start from Scratch
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="Create with AI" className="mt-6">
                        <div className="flex flex-col items-center gap-6 p-6 border rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800">
                            <AIInputbox />
                        </div>
                    </TabsContent>

                    <TabsContent value="Start from Scratch" className="mt-6">
                        <div className="flex flex-col items-center gap-6 p-6 border rounded-2xl shadow-md bg-gray-100 dark:bg-gray-800">
                            <p className="text-muted-foreground text-sm text-center">
                                Want full creative freedom? Start from a blank canvas!
                            </p>
                            <Button
                                onClick={handleEditorRouter}
                                size="lg"
                                className="w-full rounded-xl text-base font-semibold transition-all hover:scale-105 hover:shadow-lg"
                            >
                                Start from Scratch
                            </Button>
                        </div>
                    </TabsContent>

                </Tabs>
            </motion.div>
        </div>
    );
};

export default Create;
