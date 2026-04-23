import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function LivroRow({ livro, onAction, onDelete }) {
  const disponivel = livro.situacao === "DISPONÍVEL";

  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/40 transition-colors">
      <td className="px-4 py-3">
        <p className="font-medium text-lg leading-tight">{livro.titulo}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{livro.autor}</p>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <span className="text-xs text-muted-foreground">{livro.categoria}</span>
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={disponivel ? "outline" : "default"}
          className={disponivel
            ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
            : "bg-primary text-primary-foreground text-xs"
          }
        >
          {livro.situacao}
        </Badge>
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        {livro.nome_responsavel ? (
          <span className="text-sm">{livro.nome_responsavel}</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        {livro.data_emprestimo ? (
          <span className="text-xs text-muted-foreground">
            {format(new Date(livro.data_emprestimo), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant={disponivel ? "default" : "outline"}
            size="sm"
            onClick={() => onAction(livro)}
            className="text-xs h-7 px-3"
          >
            <ArrowRightLeft className="w-3 h-3 mr-1" />
            {disponivel ? "Emprestar" : "Devolver"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(livro)}
            className="text-xs h-7 px-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </td>
    </tr>
  );
}