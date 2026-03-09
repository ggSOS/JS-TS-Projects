/**
 * Configuração de conexão com o backend
 * 
 * Para desenvolvimento:
 * - iOS Simulator: 'localhost'
 * - Android Emulator: '10.0.2.2' (emulador Android acessa localhost do host)
 * - Celular físico: IP do computador na rede local (ex: '192.168.1.100')
 * 
 * Para descobrir o IP no macOS: ipconfig getifaddr en0
 * Para descobrir o IP no Windows: ipconfig (procure "IPv4 Address")
 */
export const SERVER_CONFIG = {
  ip: 'localhost', // Altere para o IP do seu computador se usar celular físico
  port: 3000,
  get url() {
    return `http://${this.ip}:${this.port}`;
  }
};
