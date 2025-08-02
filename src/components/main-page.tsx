"use client";

import { useAppContext } from "@/context/app-provider";
import { Onboarding } from "@/components/onboarding";
import { AppLayout } from "@/components/layout/app-layout";
import { DeityList } from "@/components/deities/deity-list";
import { MainCounter } from "@/components/counter/main-counter";
import { FloatingCounter } from "@/components/counter/floating-counter";
import { Skeleton } from "./ui/skeleton";

export function MainPage() {
  const { isLoaded, userName } = useAppContext();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="space-y-4 w-1/2">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!userName) {
    return <Onboarding />;
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
            Namaste, {userName}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
          <div className="lg:col-span-1">
            <DeityList />
          </div>
          <div className="lg:col-span-2">
            <MainCounter />
          </div>
        </div>
      </div>
      <FloatingCounter />
    </AppLayout>
  );
}
