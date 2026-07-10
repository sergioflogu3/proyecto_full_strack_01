import { useState } from 'react';
import type { Task, TaskStatus } from '../types';
import { KANBAN_COLUMNS } from '../config/kanban';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onComments: (task: Task) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function TaskCard({ task, onStatusChange, onDelete, onEdit, onComments, onDragStart, onDragEnd, isDragging }: TaskCardProps) {
  const [hovered, setHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    onDragStart(task.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-lg border border-slate-200 p-3 shadow-sm
                  transition cursor-grab active:cursor-grabbing
                  ${hovered ? 'shadow-md' : ''} ${isDragging ? 'opacity-50 scale-95' : ''} relative group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Botón eliminar — solo visible en hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
        className="absolute top-2 right-8 text-slate-300 hover:text-red-500
                   opacity-0 group-hover:opacity-100 transition text-lg leading-none w-6 h-6 flex items-center justify-center"
        title="Eliminar"
      >
        ×
      </button>

      {/* Botón editar — solo visible en hover */}
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(task); }}
        className="absolute top-2 right-14 text-slate-300 hover:text-blue-500
                   opacity-0 group-hover:opacity-100 transition text-sm leading-none w-6 h-6 flex items-center justify-center"
        title="Editar"
      >
        ✏️
      </button>

      <div onClick={() => onComments(task)} className="cursor-pointer">
        <p className="font-medium text-slate-800 text-sm pr-4 mb-1">{task.title}</p>

        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          {task.assignee ? (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {task.assignee.name}
            </span>
          ) : <span />}

          <span className="text-xs text-slate-400">
            💬 {task._count?.comments ?? 0}
          </span>
        </div>
      </div>

      {/* Selector de estado */}
      <select
        value={task.status}
        onChange={e => onStatusChange(task.id, e.target.value as TaskStatus)}
        onClick={e => e.stopPropagation()}
        className="mt-2 w-full text-xs border border-slate-200 rounded px-2 py-1
                   text-slate-600 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {KANBAN_COLUMNS.map(col => (
          <option key={col.id} value={col.id}>{col.label}</option>
        ))}
      </select>
    </div>
  );
}
