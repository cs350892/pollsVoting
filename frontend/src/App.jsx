
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import RoutesComponent from './Routes'; 

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <RoutesComponent />
      </AuthProvider>
    </Router>
  );
}

export default App;