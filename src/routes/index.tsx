//controla qual a rota ficará disponível
import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import AuthRoutes from '../routes/auth.routes';
import { useAuth } from '../contexts/auth';
import AppRoutes from '../routes/app.routes';

const Routes: React.FC = () => {
  //verifica se tá autenticado
  const { signed, loading } = useAuth();

  //mostrar a loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return signed ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
