import React from "react";
import { BookOpen } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-medium tracking-tight leading-tight">
              Biblioteca R21
            </h1>
            <p className="text-xs text-primary-foreground/70 font-light">
              Controle de Retiradas
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-primary-foreground/60">
          <span>ÁREA: DIVERSOS</span>
          <span className="mx-1">•</span>
          <span>VERSÃO: 00</span>
        </div>
      </div>
    </header>
  );
}