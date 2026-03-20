"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ErrorModalProps {
  title: string;
  description: string;
}

export function ErrorModal({ title, description }: ErrorModalProps) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Button asChild className="w-full mt-2">
          <Link href="/">Back to setup</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
