export function corPorTemperatura(valor: number): string {
  if (valor < 18) return '#3b82f6';
  if (valor < 25) return '#22c55e';
  if (valor < 30) return '#f59e0b';
  return '#ef4444';
}

export function corPorUmidade(valor: number): string {
  if (valor < 40) return '#f97316';
  if (valor <= 70) return '#22c55e';
  return '#3b82f6';
}

export function corPorStatus(valor: string): string {
  if (valor === 'online') return '#22c55e';
  if (valor === 'alerta') return '#f59e0b';
  if (valor === 'offline') return '#6b7280';
  return '#1f2937';
}

export function corPorTopico(topico: string, valor: string): string {
  if (topico.endsWith('/temperatura')) {
    const num = parseFloat(valor);
    if (!isNaN(num)) return corPorTemperatura(num);
  }
  if (topico.endsWith('/umidade')) {
    const num = parseFloat(valor);
    if (!isNaN(num)) return corPorUmidade(num);
  }
  if (topico.endsWith('/status')) {
    return corPorStatus(valor.trim());
  }
  return '#1f2937';
}
