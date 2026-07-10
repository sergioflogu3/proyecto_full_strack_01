import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Bienvenido, {user?.name ?? 'usuario'}
      </h2>
      <p className="text-gray-600">
        Este es el panel principal. Acá se mostrarán las tareas y el contenido de la aplicación.
      </p>
    </div>
  );
}
