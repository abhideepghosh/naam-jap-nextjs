"use client";

import { useAppContext } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

export function FloatingCounter() {
  const { activeDeity, incrementCount, showFloatingCounter, toggleFloatingCounter } = useAppContext();

  if (!showFloatingCounter || !activeDeity) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 shadow-2xl animate-in fade-in zoom-in-95">
      <CardContent className="p-2 flex items-center gap-2">
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs text-muted-foreground">{activeDeity.name}</span>
          <span className="font-bold text-lg">{activeDeity.dailyCount}</span>
        </div>
        <Button 
          size="icon" 
          className="w-10 h-10 rounded-full"
          onClick={() => incrementCount(activeDeity.id)}
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="w-8 h-8 rounded-full"
          onClick={toggleFloatingCounter}
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </Button>
      </CardContent>
    </Card>
  );
}
