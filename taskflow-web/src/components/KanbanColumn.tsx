import type { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import type { KanbanColumnConfig } from '../config/kanban';

interface KanbanColumnProps {
  config: KanbanColumnConfig;
  tasks: Task[];
  draggingTaskId: string | null;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onComments: (task: Task) => void;
  onAddTask?: () => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onDrop: (newStatus: TaskStatus) => void;
}

export function KanbanColumn({ config, tasks, draggingTaskId, onStatusChange, onDelete, onEdit, onComments, onAddTask, onDragStart, onDragEnd, onDrop }: KanbanColumnProps) {

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50');
    onDrop(config.id);
  };

  return (
    <div
      className={`flex flex-col rounded-xl ${config.bgColor} min-h-[200px] p-3 transition-all ${draggingTaskId ? 'ring-2 ring-transparent' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Encabezado de columna */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
          <span className="text-sm font-semibold text-slate-700">{config.label}</span>
          <span className="text-xs bg-white text-slate-500 px-1.5 py-0.5 rounded-full border">
            {tasks.length}
          </span>
        </div>
        {onAddTask && config.id === 'TODO' && (
          <button onClick={onAddTask}
            className="text-slate-400 hover:text-blue-600 text-lg leading-none transition">
            +
          </button>
        )}
      </div>

      {/* Tareas */}
      <div className="flex flex-col gap-2 flex-1">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onEdit={onEdit}
            onComments={onComments}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggingTaskId === task.id}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-slate-300 text-xs">
            Sin tareas
          </div>
        )}
      </div>
    </div>
  );
}
