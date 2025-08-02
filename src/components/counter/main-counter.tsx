"use client";

import { useAppContext } from "@/context/app-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";
import React, { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function MainCounter() {
  const { activeDeity, incrementCount, resetTodaysCount } = useAppContext();
  const [animate, setAnimate] = useState(false);
  const { toast } = useToast();

  const handleIncrement = () => {
    if (activeDeity) {
      incrementCount(activeDeity.id);
      setAnimate(true);
    }
  };

  const handleReset = () => {
    if(activeDeity) {
        resetTodaysCount(activeDeity.id);
        toast({ title: "Count Reset", description: `Today's count for ${activeDeity.name} has been reset to 0.` });
    }
  }

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [animate]);
  
  if (!activeDeity) {
    return (
      <Card className="flex flex-col items-center justify-center text-center p-8 min-h-[300px] lg:min-h-full shadow-lg">
        <CardHeader>
            <CardTitle className="text-2xl">No Active Japa</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">
                Please select a name from your list to start chanting, or add a new one if your list is empty.
            </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col items-center justify-center text-center p-4 sm:p-8 min-h-[300px] lg:min-h-full shadow-lg relative">
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                    <RotateCcw className="h-5 w-5"/>
                    <span className="sr-only">Reset Count</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Reset Today's Count?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will reset the count for "{activeDeity.name}" to 0 for today. Are you sure?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <CardHeader className="pb-2">
            <CardDescription className="text-lg">Chanting:</CardDescription>
            <CardTitle className="text-4xl font-bold text-primary">{activeDeity.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center flex-1">
            <div 
                className={`text-8xl sm:text-9xl font-bold transition-transform duration-300 ease-out ${animate ? 'scale-110' : 'scale-100'}`}
                onTransitionEnd={() => setAnimate(false)}
            >
                {activeDeity.dailyCount}
            </div>
            <Button
                onClick={handleIncrement}
                className="mt-8 w-24 h-24 rounded-full shadow-2xl active:scale-95 transition-transform"
                aria-label={`Increment count for ${activeDeity.name}`}
            >
                <Plus className="h-12 w-12" />
            </Button>
        </CardContent>
    </Card>
  );
}
