import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function SearchFilters({ search, setSearch, situacao, setSituacao, categoria, setCategoria, categorias }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, autor ou responsável..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>
      <Select value={situacao} onValueChange={setSituacao}>
        <SelectTrigger className="w-full sm:w-44 bg-card">
          <SelectValue placeholder="Situação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="DISPONÍVEL">Disponível</SelectItem>
          <SelectItem value="INDISPONÍVEL">Indisponível</SelectItem>
        </SelectContent>
      </Select>
      <Select value={categoria} onValueChange={setCategoria}>
        <SelectTrigger className="w-full sm:w-56 bg-card">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categorias.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}