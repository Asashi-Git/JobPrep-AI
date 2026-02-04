function Dashboard({ onLogout }) {
  return (
    <div className="card">
      <h2>Bienvenue sur le Tableau de Bord</h2>
      <p>Ceci est le contenu secret de l'application.</p>
      <button onClick={onLogout}>Se déconnecter</button>
    </div>
  );
}
export default Dashboard;
