function Login({ onLoginSuccess, onRegister }) {
  return (
    <div className="card">
      <h2>Connexion</h2>
      <div>
      <button onClick={onRegister}>Register</button>
      </div>
      <input type="text" placeholder="Utilisateur" />
      <button onClick={onLoginSuccess}>Entrer</button>
    </div>
  );
}
export default Login;
