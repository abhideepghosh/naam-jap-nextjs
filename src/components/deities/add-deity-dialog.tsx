"use client";

import { useState } from "react";
import { useAppContext } from "@/context/app-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface AddDeityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddDeityDialog({ open, onOpenChange }: AddDeityDialogProps) {
  const [name, setName] = useState("");
  const { addDeity } = useAppContext();
  const { toast } = useToast();

  const handleSave = () => {
    if (name.trim()) {
      addDeity(name.trim());
      toast({ title: "Success", description: `"${name.trim()}" has been added.` });
      setName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Add a New Name</DialogTitle>
            <DialogDescription>
                Enter the name of the deity you wish to add to your Japa list.
            </DialogDescription>
            </DialogHeader>
            <Input
                placeholder="e.g., Sri Ram"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!name.trim()}>Save Name</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}
