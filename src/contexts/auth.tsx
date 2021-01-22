import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import * as auth from '../services/auth';
import api from '../services/api';

interface User {
  name: string;
  password: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<object | null>(null);
  const [loading, setLoading] = useState(true); //mostrar o loading enquanto muda de tela

  //verifica se tem usuário logado
  useEffect(() => {
    async function loadStoragedData() {
      const storagedUser = await AsyncStorage.getItem('@WVAuth:user');
      const storagedToken = await AsyncStorage.getItem('@WVAuth:token');

      //aguardar 2 segundos mostrando o loading
      // await new Promise(resolve => setTimeout(resolve, 2000));

      if (storagedUser && storagedToken) {
        //Recuperação do token
        setUser(JSON.parse(storagedUser)); //passa o dados do user logado
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      }
      setLoading(false);
    }
    loadStoragedData(); //pega os dados do usuário logado
  });

  //logar usuário
  async function signIn() {
    const response = await auth.signIn();
    //console.log(response);

    //const { token, user } = response;

    setUser(response.user);

    //A partir do login a cada requisição será enviado o token
    api.defaults.headers.Authorization = `Bearer ${response.token}`;

    await AsyncStorage.setItem('@WVAuth:user', JSON.stringify(response.user));
    await AsyncStorage.setItem('@WVAuth:token', response.token);
  }

  //deslogar usuário
  async function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  //pega os dados do usuário e loga
  return (
    <AuthContext.Provider
      value={{ signed: !!user, user, loading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
