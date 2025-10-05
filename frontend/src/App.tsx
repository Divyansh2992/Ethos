import { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

interface User {
  email: string;
  fullName?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleSignIn = (userData: User) => {
    setUser(userData);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return user ? <Dashboard user={user} onSignOut={handleSignOut} /> : <Auth onSignIn={handleSignIn} />;
}

export default App;