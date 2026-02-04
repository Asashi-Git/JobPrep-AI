function Login({ onLoginSuccess }) {
  return (
    <div className="card">
      <h2>Register</h2>
      <input type="text" placeholder="Utilisateur" />
      <button onClick={onLoginSuccess}>Entrer</button>
    </div>
  );
}
export default Login;
