"use client";

import { useState } from "react";
import { useAppContext } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Waves } from "lucide-react";

export function Onboarding() {
  const [name, setName] = useState("");
  const { setUserName } = useAppContext();

  const handleSave = () => {
    if (name.trim()) {
      setUserName(name.trim());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                    <Waves className="w-10 h-10 text-primary"/>
                </div>
                <CardTitle className="text-3xl font-bold">Welcome to Naam Japper</CardTitle>
                <CardDescription className="text-muted-foreground pt-2">
                    Your personal companion for spiritual practice.
                    Please start by telling us your name.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Input
                        id="name"
                        placeholder="Please enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        className="h-12 text-center text-lg"
                        aria-label="Your Name"
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button 
                    onClick={handleSave} 
                    disabled={!name.trim()}
                    className="w-full h-12 text-lg"
                >
                    Save & Continue
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
