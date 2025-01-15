import React, { useEffect, useState } from 'react';

//firebase
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

//navigation
import { NavigationContainer } from '@react-navigation/native';
import Navigator from './routes/Navigator';

import { ThemeProvider } from './theme/ThemeContext';
import { autoClearCache } from './utils/cacheManager';

const App: React.FC = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return () => unsubscribe();
  }, [initializing]);

    //check cache size and clear time
  //clear cache if time exceeded
  useEffect(() => {
    autoClearCache();
  }, [])

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <ThemeProvider>
        <Navigator user={user} />
      </ThemeProvider>
    </NavigationContainer>
  );
};

export default App;
