import { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Login from './screens/Login';
import { Equipe, Tela } from './types';

export default function App() {
  const [telaAtual, setTelaAtual] = useState<Tela>(Tela.LOGIN);
  const [nomeJogador, setNomeJogador] = useState('');
  const [equipeJogador, setEquipeJogador] = useState<Equipe | null>(null);

  const handleLogin = (nome: string, equipe: Equipe): void => {
    setNomeJogador(nome);
    setEquipeJogador(equipe);
    setTelaAtual(Tela.JOGO);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {telaAtual === Tela.LOGIN && <Login onLogin={handleLogin} />}
        {telaAtual === Tela.JOGO && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>
              Olá, {nomeJogador}! 🎮
            </Text>
            <Text style={{
              marginTop: 16, fontSize: 22, fontWeight: 'bold',
              color: equipeJogador === Equipe.VERMELHO ? '#ef4444' : '#3b82f6',
            }}>
              Equipe {equipeJogador}
            </Text>
            <Text style={{ color: '#6b7280', marginTop: 12, fontSize: 14, textAlign: 'center' }}>
              Token salvo no AsyncStorage ✅
            </Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111827' },
});
