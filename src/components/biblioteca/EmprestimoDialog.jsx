import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export default function EmprestimoDialog({ livro, open, onClose, onConfirm, isLoading }) {
  const [nome, setNome] = useState("");
  const disponivel = livro?.situacao === "DISPONÍVEL";

  const handleConfirm = () => {
    if (disponivel && !nome.trim()) return;
    onConfirm({
      situacao: disponivel ? "INDISPONÍVEL" : "DISPONÍVEL",
      nome_responsavel: disponivel ? nome.trim().toUpperCase() : "",
      data_emprestimo: disponivel ? format(new Date(), "yyyy-MM-dd") : null,
    });
    setNome("");
  };

  if (!livro) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {disponivel ? "Registrar Empréstimo" : "Registrar Devolução"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="font-medium text-sm">{livro.titulo}</p>
            <p className="text-xs text-muted-foreground">{livro.autor}</p>
          </div>

          {disponivel ? (
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium">
                Nome de quem está retirando
              </Label>
              <Input
                id="nome"
                placeholder="Digite o nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoFocus
              />
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">Responsável atual</p>
              <p className="text-sm font-medium">{livro.nome_responsavel}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading || (disponivel && !nome.trim())}>
            {isLoading ? "Salvando..." : disponivel ? "Confirmar Empréstimo" : "Confirmar Devolução"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}