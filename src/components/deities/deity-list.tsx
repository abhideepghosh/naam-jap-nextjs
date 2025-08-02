"use client";

import { useState } from "react";
import { useAppContext } from "@/context/app-provider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, ArrowUp, ArrowDown, List } from "lucide-react";
import { AddDeityDialog } from "./add-deity-dialog";
import { DeityActions } from "./deity-actions";

export function DeityList() {
  const { deities, activeDeity, setActiveDeity, reorderDeities } = useAppContext();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="text-primary"/> Your Japa List
          </CardTitle>
          <CardDescription>
            Select a name to start chanting. You can add, remove, and reorder names.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deities.length > 0 ? (
            <ul className="space-y-2">
              {deities.map((deity, index) => (
                <li
                  key={deity.id}
                  onClick={() => setActiveDeity(deity.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                    deity.isActive
                      ? "bg-primary/10 border-primary"
                      : "bg-secondary/50 hover:bg-secondary border-transparent"
                  }`}
                >
                  {deity.isActive ? (
                    <Check className="h-5 w-5 text-primary shrink-0" />
                  ) : (
                    <div className="h-5 w-5 shrink-0" />
                  )}
                  <span className="flex-1 font-medium">{deity.name}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); reorderDeities(deity.id, 'up'); }}
                      disabled={index === 0}
                      aria-label={`Move ${deity.name} up`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); reorderDeities(deity.id, 'down'); }}
                      disabled={index === deities.length - 1}
                      aria-label={`Move ${deity.name} down`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <DeityActions deity={deity} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
              <p>Your list is empty.</p>
              <p>Add a name to begin your practice.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button className="w-full h-11" onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Name
          </Button>
        </CardFooter>
      </Card>
      <AddDeityDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
    </>
  );
}
