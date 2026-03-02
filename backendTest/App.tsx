import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Login from "./Login";

export default function App() {
  const [ usuarioLogadoNome, setUsuarioLogadoNome ] = useState<String | null>()
  const [isUsuarioLogado, setUsuarioLogado] = useState<Boolean>(false);

  const onCliqueLogar = () => {
    setUsuarioLogado(true);
  };

  const onUsuarioLogado = (nome: string): void => {
    console.log("Usuario logou")
    setUsuarioLogadoNome(nome)
    setUsuarioLogado(true)
  }

  if (!isUsuarioLogado) {
    return <Login onUsuarioLogado={onUsuarioLogado}/>;
  }

  useEffect(() => {
    if(isUsuarioLogado === true){
      console.log("Atualizou");
    }else{
      console.log("Erro");
    }
  }, [isUsuarioLogado]);

  

  return (
    <View style={styles.container}>
      <Text>Olá {usuarioLogadoNome}</Text>
      <Button title="Logar" onPress={onCliqueLogar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7635c0",
    alignItems: "center",
    justifyContent: "center",
  },
});
