import { useNavStore } from '../store/useNavStore';

function Register() {
  const goToLogin = useNavStore((state) => state.goToLogin);

  return (
    <div className="card">
      <h2>Créer un compte</h2>
      <input type="text" placeholder="Nouvel utilisateur" />
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={goToLogin}>
          S'inscrire et retourner au Login
        </button>
      </div>
    </div>
  );
}

export default Register;
