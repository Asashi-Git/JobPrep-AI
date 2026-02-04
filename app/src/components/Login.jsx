import { useNavStore } from '../store/useNavStore';

function Login() {
  const goToDashboard = useNavStore((state) => state.goToDashboard);
  const goToRegister = useNavStore((state) => state.goToRegister);

  return (
    <div className="card">
      <h2>Login</h2>
      <input type="text" placeholder="username" />
      <input type="password" placeholder="password" />
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={goToDashboard}>
          Sign In
        </button>

        <button onClick={goToRegister} style={{ backgroundColor: '#666' }}>
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;