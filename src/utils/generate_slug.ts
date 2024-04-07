export function generateSlug(text: string): string {
  return text
    .normalize("NFD") // Remove os acentos
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase() // Transforma o texto em minúsculas
    .replace(/[^\w\s]/g, "") // Remove símbolos
    .replace(/\s+/g, "-") // Substitui espaços por traços
    .replace(/-{2,}/g, "-") // Remove múltiplos traços consecutivos
    .trim(); // Remove espaços em branco no início e no fim
}
