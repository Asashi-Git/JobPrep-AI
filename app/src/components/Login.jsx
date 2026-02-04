// src/components/Login.jsx
function Login({ onLoginSuccess }) {
  return (
    <div className="card">
      <h2>Connexion</h2>
      <input type="text" placeholder="Utilisateur" />
      <button onClick={onLoginSuccess}>Entrer</button>
    </div>
  );
}
export default Login;
