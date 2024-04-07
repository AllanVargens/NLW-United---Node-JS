// src/utils/generate_slug.ts
function generateSlug(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, "-").replace(/-{2,}/g, "-").trim();
}

export {
  generateSlug
};
