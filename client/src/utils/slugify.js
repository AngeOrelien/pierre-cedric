export const generateSlug = (text) =>
  text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9\s-]/g,'')
    .replace(/\s+/g,'-').replace(/-+/g,'-').trim();
