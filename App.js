import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, TextInput } from 'react-native';
import {
  Button,
  List,
  PaperProvider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function Lista({ navigation }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const tasksString = await AsyncStorage.getItem('tasks');
      if (tasksString) {
        setTasks(JSON.parse(tasksString));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas.', error);
    }
  };

  return (
    <PaperProvider>
      <Button
        style={styles.containerButton}
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate('Adicionar tarefa', { setTasks })}
      >
        Adicionar tarefa
      </Button>

      <FlatList
        style={styles.containerList}
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
          />
        )}
      />
    </PaperProvider>
  );
}

function Tarefa({ route, navigation }) {
  const { setTasks } = route.params;
  const [title, setTitle] = useState('');

  const addTask = async () => {
    try {
      const newTask = { id: Date.now(), title };
      const tasksString = await AsyncStorage.getItem('tasks');
      const tasks = tasksString ? JSON.parse(tasksString) : [];
      tasks.push(newTask);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      setTasks(tasks);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao carregar tarefa.', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite sua nova tarefa"
        value={title}
        onChangeText={setTitle}
      />
      <Button mode="contained" onPress={addTask}>
        Salvar tarefa
      </Button>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista de tarefas">
        <Stack.Screen name="Lista de tarefas" component={Lista} />
        <Stack.Screen name="Adicionar tarefa" component={Tarefa} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  containerButton: {
    margin: 10,
  },
  containerList: {
    margin: 10,
  },
  input: {
    width: '100%',
    padding: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default App;
