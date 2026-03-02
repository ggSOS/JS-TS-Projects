import { useState } from "react";
import { Button, StyleSheet, Text, View, TextInput, Alert } from "react-native";

interface Ilogin {
  onUsuarioLogado: (nome: string) => void;
}

export default function Login({ onUsuarioLogado }: Ilogin) {
  const [nomeUsuario, setNomeUsuario] = useState<string>("");

  const onEntrarPressionado = () => {
    // todo enviar dados para api
    // todo verificar sucesso
    const result: { status: number } = {
      status: 200,
    };

    if (nomeUsuario.length === 0) {
      Alert.alert("Insira o nome de Usuario");
      return;
    }

    if (result.status === 200) {
      // todo retornar para parent
      onUsuarioLogado(nomeUsuario);
      return;
    }

    console.log("Usuario Invalido");
  };

  return (
    <View style={styles.root}>
      <Text style={styles.text}>Insira o nome de Usuário</Text>
      <TextInput
        value={nomeUsuario}
        onChangeText={(value) => setNomeUsuario(value)}
      />
      <Button title="Entrar" onPress={onEntrarPressionado} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    alignItems: "center",
  },
});
