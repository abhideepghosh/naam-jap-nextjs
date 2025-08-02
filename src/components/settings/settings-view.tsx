"use client";

import React, { useState } from 'react';
import { AppLayout } from "@/components/layout/app-layout";
import { useAppContext } from '@/context/app-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ModeToggle } from './mode-toggle';

export function SettingsView() {
    const { userName, setUserName, showFloatingCounter, toggleFloatingCounter } = useAppContext();
    const [currentName, setCurrentName] = useState(userName || "");
    const { toast } = useToast();

    const handleNameSave = () => {
        if(currentName.trim()) {
            setUserName(currentName.trim());
            toast({title: "Success", description: "Your name has been updated."})
        }
    }

    return (
        <AppLayout>
            <div className="container mx-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
                <div className="grid gap-8 max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Manage your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Your Name</Label>
                                <div className="flex gap-2">
                                    <Input id="name" value={currentName} onChange={e => setCurrentName(e.target.value)} />
                                    <Button onClick={handleNameSave} disabled={currentName === userName || !currentName.trim()}>Save</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize the look and feel of the app.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="theme-mode">Theme Mode</Label>
                                <ModeToggle />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="floating-counter">Show Floating Counter</Label>
                                <Switch
                                    id="floating-counter"
                                    checked={showFloatingCounter}
                                    onCheckedChange={toggleFloatingCounter}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
