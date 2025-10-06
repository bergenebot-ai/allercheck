export function formatISO(date: string): string {
  return new Date(date).toLocaleDateString('ca-ES');
}

export function nowISO(): string {
  return new Date().toISOString();
}
