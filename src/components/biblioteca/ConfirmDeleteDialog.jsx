import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function ConfirmDeleteDialog({ livro, open, onClose, onConfirm, isLoading }) {
  if (!livro) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Excluir Livro</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.
          </p>
          <div className="bg-muted/50 rounded-lg p-3 mt-3">
            <p className="font-medium text-sm">{livro.titulo}</p>
            <p className="text-xs text-muted-foreground">{livro.autor}</p>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            <Trash2 className="w-4 h-4 mr-1" />
            {isLoading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}