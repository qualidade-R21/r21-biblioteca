import React, { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIAS = [
  "Controle da Qualidade",
  "Desenvolvimento Pessoal e Alta Performance",
  "Espiritualidade, Propósito e Psicologia",
  "Estratégia e Tomada de Decisão",
  "Finanças",
  "Finanças e Mentalidade de Riqueza",
  "Finanças e Planos de Investimento",
  "Gestão Empresarial e Estratégia",
  "Gestão Integrada",
  "Liderança",
  "Liderança e Desenvolvimento Pessoal",
  "Liderança Empática",
  "Vendas, Persuasão e Comunicação",
];

const EMPTY = { titulo: "", autor: "", categoria: "", situacao: "DISPONÍVEL" };

export default function LivroDialog({ open, onClose, onSave, isLoading }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) setForm(EMPTY);
  }, [open]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const valid = form.titulo.trim() && form.autor.trim() && form.categoria;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Livro</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="titulo">Título</Label>
            <Input id="titulo" value={form.titulo} onChange={(e) => set("titulo", e.target.value)} placeholder="Título do livro" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="autor">Autor</Label>
            <Input id="autor" value={form.autor} onChange={(e) => set("autor", e.target.value)} placeholder="Nome do autor" />
          </div>
          <div className="space-y-1">
            <Label>Categoria</Label>
            <Select value={form.categoria} onValueChange={(v) => set("categoria", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Situação</Label>
            <Select value={form.situacao} onValueChange={(v) => set("situacao", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DISPONÍVEL">Disponível</SelectItem>
                <SelectItem value="INDISPONÍVEL">Indisponível</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
          <Button onClick={() => onSave(form)} disabled={isLoading || !valid}>
            {isLoading ? "Salvando..." : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}