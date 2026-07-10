import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectsService } from '../api/projects.service';
import type { Project } from '../types';

export default function ProjectsPage() {
  const [projects,    setProjects]    = useState<Project[]>([]);
  const [loading,      setLoading]    = useState(true);
  const [error,        setError]      = useState('');
  const [showCreate,   setShowCreate] = useState(false);
  const [showEdit,     setShowEdit]   = useState(false);
  const [showDelete,   setShowDelete] = useState(false);
  const [editProject,  setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);
  const [name,         setName]       = useState('');
  const [desc,         setDesc]       = useState('');
  const [saving,       setSaving]     = useState(false);

  const { user } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    projectsService.getAll()
      .then(setProjects)
      .catch(() => setError('No se pudieron cargar los proyectos'))
      .finally(() => setLoading(false));
  }, []);

  const openEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditProject(project);
    setName(project.name);
    setDesc(project.description ?? '');
    setShowEdit(true);
  };

  const openDelete = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteProject(project);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    if (!deleteProject) return;
    setSaving(true);
    try {
      await projectsService.remove(deleteProject.id);
      setProjects(prev => prev.filter(p => p.id !== deleteProject.id));
      setShowDelete(false);
      setDeleteProject(null);
    } catch {
      setError('Error al eliminar el proyecto');
    } finally { setSaving(false); }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setSaving(true);
    try {
      const newProject = await projectsService.create({
        name: name.trim(),
        description: desc.trim() || undefined,
        ownerId: user.id,
      });
      setProjects(prev => [newProject, ...prev]);
      setShowCreate(false);
      setName(''); setDesc('');
    } catch {
      setError('Error al crear el proyecto');
    } finally { setSaving(false); }
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editProject || !name.trim()) return;
    setSaving(true);
    try {
      const updated = await projectsService.update(editProject.id, {
        name: name.trim(),
        description: desc.trim() || undefined,
      });
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      setShowEdit(false);
      setEditProject(null);
      setName(''); setDesc('');
    } catch {
      setError('Error al actualizar el proyecto');
    } finally { setSaving(false); }
  };

  const closeModals = () => {
    setShowCreate(false);
    setShowEdit(false);
    setShowDelete(false);
    setEditProject(null);
    setDeleteProject(null);
    setName('');
    setDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Proyectos</h1>
        <button onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm
                     font-medium px-4 py-2 rounded-lg transition">
          + Nuevo Proyecto
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {loading && <div className="text-center py-12 text-slate-500">Cargando...</div>}
        {error   && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">{error}</div>}

        {!loading && projects.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-slate-500 text-lg">Aún no tienes proyectos.</p>
            <button onClick={() => setShowCreate(true)}
              className="mt-4 text-blue-600 font-medium hover:underline">
              Crea tu primer proyecto →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="bg-white rounded-xl border border-slate-200 p-5
                         hover:shadow-md hover:border-blue-300 cursor-pointer transition group relative">
              <h2 className="font-semibold text-slate-800 mb-1 truncate pr-16">{project.name}</h2>
              {project.description && (
                <p className="text-slate-500 text-sm mb-3 line-clamp-2">{project.description}</p>
              )}
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto">
                <span className="bg-slate-100 px-2 py-1 rounded-full">
                  {project._count?.tasks ?? 0} tareas
                </span>
              </div>

              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => openEdit(project, e)}
                  className="bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600
                             w-8 h-8 rounded-lg flex items-center justify-center text-sm transition"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => openDelete(project, e)}
                  className="bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600
                             w-8 h-8 rounded-lg flex items-center justify-center text-sm transition"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModals}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Nuevo Proyecto</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="pname" className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input id="pname" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="pdesc" className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea id="pdesc" value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModals}
                  className="text-slate-600 hover:text-slate-800 text-sm font-medium px-4 py-2">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white
                             text-sm font-semibold px-4 py-2 rounded-lg transition">
                  {saving ? 'Creando...' : 'Crear Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && editProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModals}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-slate-800 mb-4">Editar Proyecto</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label htmlFor="ename" className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input id="ename" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="edesc" className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea id="edesc" value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModals}
                  className="text-slate-600 hover:text-slate-800 text-sm font-medium px-4 py-2">
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white
                             text-sm font-semibold px-4 py-2 rounded-lg transition">
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDelete && deleteProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={closeModals}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2 text-center">Eliminar Proyecto</h2>
            <p className="text-slate-500 text-sm text-center mb-6">
              ¿Estás seguro de eliminar el proyecto <strong>"{deleteProject.name}"</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={closeModals}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition">
                Cancelar
              </button>
              <button onClick={handleDelete} disabled={saving}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                {saving ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
