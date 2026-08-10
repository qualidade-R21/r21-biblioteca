import React, { useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileText } from "lucide-react";
import { exportLivrosPdf } from "@/utils/exportPdf";

import Header from "@/components/biblioteca/Header";
import StatsBar from "@/components/biblioteca/StatsBar";
import SearchFilters from "@/components/biblioteca/SearchFilters";
import LivroTable from "@/components/biblioteca/LivroTable";
import EmprestimoDialog from "@/components/biblioteca/EmprestimoDialog";
import LivroDialog from "@/components/biblioteca/LivroDialog";
import ConfirmDeleteDialog from "@/components/biblioteca/ConfirmDeleteDialog";

export default function Biblioteca() {
  const [search, setSearch] = useState("");
  const [situacao, setSituacao] = useState("all");
  const [categoria, setCategoria] = useState("all");
  const [selectedLivro, setSelectedLivro] = useState(null);
  const [showCadastro, setShowCadastro] = useState(false);
  const [livroParaExcluir, setLivroParaExcluir] = useState(null);

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

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Livro.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      setShowCadastro(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Livro.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["livros"] });
      setLivroParaExcluir(null);
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

  const handleExport = () => {
    const headers = ["Título", "Autor", "Categoria", "Situação", "Responsável", "Data Empréstimo"];
    const rows = filteredLivros.map((l) => [
      l.titulo ?? "",
      l.autor ?? "",
      l.categoria ?? "",
      l.situacao ?? "",
      l.nome_responsavel ?? "",
      l.data_emprestimo ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "biblioteca.csv";
    link.click();
    URL.revokeObjectURL(url);
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
          <div className="flex items-center gap-2">
            <Button onClick={handleExport} variant="outline" size="sm" disabled={filteredLivros.length === 0}>
              <Download className="w-4 h-4 mr-1" />
              CSV
            </Button>
            <Button onClick={() => exportLivrosPdf(filteredLivros)} variant="outline" size="sm" disabled={filteredLivros.length === 0}>
              <FileText className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button onClick={() => setShowCadastro(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Novo Livro
            </Button>
          </div>
        </div>
        <LivroTable livros={filteredLivros} onAction={handleAction} onDelete={setLivroParaExcluir} />
      </main>

      <EmprestimoDialog
        livro={selectedLivro}
        open={!!selectedLivro}
        onClose={() => setSelectedLivro(null)}
        onConfirm={handleConfirm}
        isLoading={updateMutation.isPending}
      />

      <LivroDialog
        open={showCadastro}
        onClose={() => setShowCadastro(false)}
        onSave={(data) => createMutation.mutate(data)}
        isLoading={createMutation.isPending}
      />

      <ConfirmDeleteDialog
        livro={livroParaExcluir}
        open={!!livroParaExcluir}
        onClose={() => setLivroParaExcluir(null)}
        onConfirm={() => deleteMutation.mutate(livroParaExcluir.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}