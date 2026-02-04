import { useNavStore } from '../store/useNavStore';

function Login() {
  // Nous récupérons uniquement les actions dont nous avons besoin
  const goToDashboard = useNavStore((state) => state.goToDashboard);
  const goToRegister = useNavStore((state) => state.goToRegister);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <h2>Login</h2>
      <input type="text" placeholder="username" />
      <input type="password" placeholder="password" />
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        {/* Bouton Sign In -> Mène au Dashboard */}
        <button onClick={goToDashboard}>
          Sign In
        </button>

        {/* Bouton Sign Up -> Mène à l'inscription */}
        <button onClick={goToRegister} style={{ backgroundColor: '#666' }}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;