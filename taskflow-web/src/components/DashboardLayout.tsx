import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { label: 'Inicio', icon: '🏠', path: '/dashboard' },
  { label: 'Tareas', icon: '📋', path: '/tasks' },
  { label: 'Proyectos', icon: '📅', path: '/projects' },
  { label: 'Configuración', icon: '⚙️', path: '/settings' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 text-xl leading-none"
            >
              ☰
            </button>
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.name ?? 'usuario'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white text-sm rounded px-4 py-2 hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={`bg-white shadow-sm border-r border-gray-200 transition-all duration-200 ${
            sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'
          }`}
        >
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <footer className="bg-white shadow-sm border-t border-gray-200 px-6 py-4">
        <p className="text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} TaskFlow. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}
