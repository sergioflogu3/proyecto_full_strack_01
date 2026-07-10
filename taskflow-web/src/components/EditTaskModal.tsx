import { useState, useEffect, type FormEvent } from 'react';
import { tasksService } from '../api/tasks.service';
import { usersService } from '../api/users.service';
import type { Task, TaskStatus, User } from '../types';
import { KANBAN_COLUMNS } from '../config/kanban';

interface Props {
  task: Task;
  onUpdated: (task: Task) => void;
  onClose: () => void;
}

export function EditTaskModal({ task, onUpdated, onClose }: Props) {
  const [title,     setTitle]     = useState(task.title);
  const [desc,      setDesc]      = useState(task.description ?? '');
  const [status,    setStatus]    = useState<TaskStatus>(task.status);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo ?? '');
  const [users,     setUsers]     = useState<User[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    usersService.getAll().then(setUsers).catch(() => {});
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');
    try {
      const updated = await tasksService.update(task.id, {
        title: title.trim(),
        description: desc.trim() || undefined,
        status,
        assignedTo: assignedTo || null,
      });
      onUpdated(updated);
      onClose();
    } catch {
      setError('Error al actualizar la tarea');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Editar Tarea</h2>
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="et_title" className="block text-sm font-medium text-slate-700 mb-1">
              Título *
            </label>
            <input
              id="et_title"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="et_desc" className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              id="et_desc"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label htmlFor="et_status" className="block text-sm font-medium text-slate-700 mb-1">
              Estado
            </label>
            <select
              id="et_status"
              value={status}
              onChange={e => setStatus(e.target.value as TaskStatus)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {KANBAN_COLUMNS.map(col => (
                <option key={col.id} value={col.id}>{col.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="et_assignee" className="block text-sm font-medium text-slate-700 mb-1">
              Asignar a
            </label>
            <select
              id="et_assignee"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin asignar</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="text-slate-600 hover:text-slate-800 text-sm font-medium px-4 py-2">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white
                         text-sm font-semibold px-4 py-2 rounded-lg transition">
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
