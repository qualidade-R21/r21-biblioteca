import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Header from "@/components/biblioteca/Header";
import StatsBar from "@/components/biblioteca/StatsBar";
import SearchFilters from "@/components/biblioteca/SearchFilters";
import LivroTable from "@/components/biblioteca/LivroTable";
import EmprestimoDialog from "@/components/biblioteca/EmprestimoDialog";

export default function Biblioteca() {
  const [search, setSearch] = useState("");
  const [situacao, setSituacao] = useState("all");
  const [categoria, setCategoria] = useState("all");
  const [selectedLivro, setSelectedLivro] = useState(null);

  const queryClient = useQueryClient();

  const { data: livros = [], isLoading } = useQuery({
    queryKey: ["livros"],
    queryFn: () => base44.entities.Livro.list("titulo", 500),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Livro.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      setSelectedLivro(null);
    },
  });

  const categorias = useMemo(() => {
    const cats = [...new Set(livros.map(l => l.categoria).filter(Boolean))];
    return cats.sort();
  }, [livros]);

  const filteredLivros = useMemo(() => {
    return livros.filter((l) => {
      const searchLower = search.toLowerCase();
      const matchSearch =
        !search ||
        l.titulo?.toLowerCase().includes(searchLower) ||
        l.autor?.toLowerCase().includes(searchLower) ||
        l.nome_responsavel?.toLowerCase().includes(searchLower);
      const matchSituacao = situacao === "all" || l.situacao === situacao;
      const matchCategoria = categoria === "all" || l.categoria === categoria;
      return matchSearch && matchSituacao && matchCategoria;
    });
  }, [livros, search, situacao, categoria]);

  const handleAction = (livro) => {
    setSelectedLivro(livro);
  };

  const handleConfirm = (data) => {
    updateMutation.mutate({ id: selectedLivro.id, data });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <StatsBar livros={livros} />
        <SearchFilters
          search={search}
          setSearch={setSearch}
          situacao={situacao}
          setSituacao={setSituacao}
          categoria={categoria}
          setCategoria={setCategoria}
          categorias={categorias}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filteredLivros.length} livro{filteredLivros.length !== 1 ? "s" : ""} encontrado{filteredLivros.length !== 1 ? "s" : ""}
          </p>
        </div>
        <LivroTable livros={filteredLivros} onAction={handleAction} />
      </main>

      <EmprestimoDialog
        livro={selectedLivro}
        open={!!selectedLivro}
        onClose={() => setSelectedLivro(null)}
        onConfirm={handleConfirm}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}