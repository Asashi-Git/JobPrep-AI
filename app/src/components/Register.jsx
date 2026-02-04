import { useNavStore } from '../store/useNavStore';

function Register() {
  const goToLogin = useNavStore((state) => state.goToLogin);

  return (
    <div className="card">
      <h2>Create an Account</h2>
      <input type="text" placeholder="username" />
      <input type="text" placeholder="email" />
      <input type="password" placeholder="password" />
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={goToLogin}>
          Sign up and Sign in
        </button>
      </div>
    </div>
  );
}

export default Register;