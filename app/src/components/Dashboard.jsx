import { useNavStore } from '../store/useNavStore';

function Dashboard() {
  const goToLogin = useNavStore((state) => state.goToLogin);

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Bienvenue dans l'espace sécurisé.</p>
      <button onClick={goToLogin}>Logout</button>
    </div>
  );
}

export default Dashboard;
