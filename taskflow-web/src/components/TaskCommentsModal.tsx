import { useState, useEffect, type FormEvent } from 'react';
import { commentsService } from '../api/comments.service';
import type { Comment, Task } from '../types';

interface Props {
  task: Task;
  onClose: () => void;
}

export function TaskCommentsModal({ task, onClose }: Props) {
  const [comments,  setComments]  = useState<Comment[]>([]);
  const [content,   setContent]   = useState('');
  const [loading,   setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    commentsService.getByTask(task.id)
      .then(setComments)
      .catch(() => setError('Error al cargar comentarios'))
      .finally(() => setLoading(false));
  }, [task.id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const newComment = await commentsService.create({
        content: content.trim(),
        taskId: task.id,
      });
      setComments(prev => [...prev, newComment]);
      setContent('');
    } catch {
      setError('Error al crear el comentario');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Comentarios: {task.title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
        </div>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}

        <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-[200px]">
          {loading ? (
            <div className="text-center text-slate-400 py-8">Cargando...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-slate-400 py-8 text-sm">Sin comentarios aún</div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">
                    {comment.user?.name ?? 'Usuario'}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-600">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-slate-200 pt-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Escribe un comentario..."
            rows={2}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white
                         text-sm font-semibold px-4 py-2 rounded-lg transition">
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
