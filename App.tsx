// Importações necessárias do React, React Native e Axios
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';

// Componente principal do aplicativo
const App = () => {
  // Estado para armazenar o texto digitado pelo usuário
  const [input, setInput] = useState<string>(''); 
  // Estado para armazenar a resposta da API
  const [info, setInfo] = useState<string | null>(null); 
  // Estado para indicar se a aplicação está processando uma requisição
  const [loading, setLoading] = useState<boolean>(false); 
  // Estado para exibir gradualmente a resposta da IA (animação de digitação)
  const [displayedText, setDisplayedText] = useState<string>(''); 

  // Efeito para animar a exibição da resposta como se estivesse sendo digitada
  useEffect(() => {
    if (info) {
      setDisplayedText(''); // Reseta o texto antes de iniciar a animação
      let currentIndex = 0; // Índice para controlar os caracteres exibidos
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + info[currentIndex]); // Adiciona um caractere por vez
        currentIndex++;
        if (currentIndex >= info.length) clearInterval(interval); // Para a animação quando todo o texto for exibido
      }, 30); // Define a velocidade da animação (30ms por caractere)
      return () => clearInterval(interval); // Limpa o intervalo quando o componente desmontar
    }
  }, [info]);

  // Função para buscar informações da API com base no input do usuário
  const fetchInformation = async () => {
    if (!input.trim()) {
      setInfo('Por favor, insira um local válido.'); // Validação para evitar inputs vazios
      return;
    }

    setLoading(true); // Ativa o indicador de carregamento
    setInfo(null); // Reseta a resposta anterior

    try {
      // Chamada POST à API
      const response = await axios.post(
        'https://openrouter.ai/api/v1/completions',
        {
          model: 'openai/gpt-3.5-turbo', // Modelo utilizado pela API
          prompt: `Me forneça informações interessantes, curiosidades ou fatos históricos sobre: ${input}.`,
          max_tokens: 400, // Limite de tokens na resposta
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer {SUA_CHAVE_DE_API}`, // Substituir pela chave da API
            'X-Title': 'TouristInfoApp', // Título do aplicativo para referência na API
          },
        }
      );

      // Extrai o conteúdo da resposta
      const content =
        response.data.choices[0]?.message?.content ||
        response.data.choices[0]?.text ||
        'Nenhuma informação disponível.';
      setInfo(content); // Atualiza o estado com o texto recebido
    } catch (error) {
      console.error('Erro ao obter informações da API:', error); // Loga o erro no console
      setInfo('Erro ao obter informações. Tente novamente mais tarde.'); // Mensagem de erro para o usuário
    } finally {
      setLoading(false); // Desativa o indicador de carregamento
    }
  };

  return (
    // ScrollView para permitir a rolagem caso o conteúdo exceda a tela
    <ScrollView contentContainerStyle={styles.container}>
      {/* Título da aplicação */}
      <Text style={styles.title}>Descubra um Local</Text>
      
      {/* Campo de entrada decorado com um ícone */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>📍</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome de um local" // Placeholder para orientar o usuário
          value={input} // Valor do campo controlado pelo estado
          onChangeText={setInput} // Atualiza o estado ao digitar
        />
      </View>
      
      {/* Botão de pesquisa */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]} // Estilo muda se o botão estiver desabilitado
        onPress={fetchInformation} // Chama a função ao pressionar
        disabled={loading} // Desabilita o botão durante o carregamento
      >
        {loading ? ( // Mostra um indicador de carregamento enquanto a API processa
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pesquisar</Text> // Texto padrão do botão
        )}
      </TouchableOpacity>
      
      {/* Exibe o texto da resposta com a animação */}
      {displayedText && <Text style={styles.info}>{displayedText}</Text>}
    </ScrollView>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row', // Alinha o ícone e o input na mesma linha
    alignItems: 'center',
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  inputIcon: {
    fontSize: 20, // Tamanho do ícone
    marginRight: 10, // Espaçamento entre o ícone e o campo de texto
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: '#7CA9FF', // Cor diferente para o botão desabilitado
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
});

// Exporta o componente para ser utilizado no aplicativo
export default App;
