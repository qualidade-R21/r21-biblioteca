import jsPDF from "jspdf";

export function exportLivrosPdf(livros) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 15;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Biblioteca R21 — Acervo", margin, y);
  y += 6;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Total de registros: ${livros.length}`, margin, y);
  y += 6;

  const cols = [
    { title: "Título", w: 80 },
    { title: "Autor", w: 50 },
    { title: "Categoria", w: 40 },
    { title: "Situação", w: 30 },
    { title: "Responsável", w: 40 },
    { title: "Data", w: 30 },
  ];
  const tableWidth = cols.reduce((s, c) => s + c.w, 0);
  const rowH = 7;

  const drawHeader = () => {
    doc.setFillColor(0, 100, 34);
    doc.rect(margin, y, tableWidth, rowH, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    let x = margin;
    cols.forEach((c) => {
      doc.text(c.title, x + 1.5, y + 5);
      x += c.w;
    });
    y += rowH;
  };

  const drawRow = (livro, i) => {
    if (y + rowH > doc.internal.pageSize.getHeight() - 14) {
      doc.addPage();
      y = 15;
      drawHeader();
    }
    if (i % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, tableWidth, rowH, "F");
    }
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const values = [
      livro.titulo ?? "",
      livro.autor ?? "",
      livro.categoria ?? "",
      livro.situacao ?? "",
      livro.nome_responsavel ?? "",
      livro.data_emprestimo ?? "",
    ];
    let x = margin;
    values.forEach((v, idx) => {
      const text = String(v).length > 28 ? String(v).slice(0, 27) + "…" : String(v);
      doc.text(text, x + 1.5, y + 5, { maxWidth: cols[idx].w - 3 });
      x += cols[idx].w;
    });
    y += rowH;
  };

  drawHeader();
  doc.setFont("helvetica", "normal");
  livros.forEach((l, i) => drawRow(l, i));

  // bordas da tabela
  doc.setDrawColor(200);
  doc.rect(margin, 15 + 12, tableWidth, y - (15 + 12));

  doc.save("biblioteca.pdf");
}