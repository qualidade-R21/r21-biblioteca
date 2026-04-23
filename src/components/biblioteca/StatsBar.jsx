import React from "react";
import { BookOpen, BookCheck, BookX, Users } from "lucide-react";

export default function StatsBar({ livros }) {
  const total = livros.length;
  const disponiveis = livros.filter(l => l.situacao === "DISPONÍVEL").length;
  const emprestados = livros.filter(l => l.situacao === "INDISPONÍVEL").length;
  const responsaveis = new Set(
    livros.filter(l => l.nome_responsavel).map(l => l.nome_responsavel.toUpperCase())
  ).size;

  const stats = [
    { label: "Total de Livros", value: total, icon: BookOpen, color: "text-foreground" },
    { label: "Disponíveis", value: disponiveis, icon: BookCheck, color: "text-chart-5" },
    { label: "Emprestados", value: emprestados, icon: BookX, color: "text-primary" },
    { label: "Pessoas", value: responsaveis, icon: Users, color: "text-muted-foreground" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border rounded-lg p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-medium leading-none">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}