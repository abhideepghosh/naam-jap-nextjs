"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppContext } from "@/context/app-provider";
import { 
    Home, 
    BarChart3, 
    Settings, 
    Waves, 
    Menu
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/settings/mode-toggle";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/statistics", label: "Statistics", icon: BarChart3 },
    { href: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { userName } = useAppContext();

    const NavContent = () => (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <Waves className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold">Naam Japper</span>
                </Link>
            </div>
            <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                    <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Button>
                    </Link>
                ))}
            </nav>
            <div className="mt-auto p-4 border-t">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="font-semibold">{userName}</span>
                        <span className="text-sm text-muted-foreground">User</span>
                    </div>
                    <ModeToggle />
                </div>
            </div>
        </div>
    );

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-card lg:block">
            <NavContent />
        </div>
        <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[280px]">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <NavContent />
                    </SheetContent>
                </Sheet>
                <div className="flex-1">
                  <Link href="/" className="flex items-center gap-2">
                      <Waves className="h-6 w-6 text-primary" />
                      <span className="text-lg font-bold">Naam Japper</span>
                  </Link>
                </div>
                <ModeToggle />
            </header>
            <main className="flex-1 bg-background">{children}</main>
        </div>
    </div>
  );
}
