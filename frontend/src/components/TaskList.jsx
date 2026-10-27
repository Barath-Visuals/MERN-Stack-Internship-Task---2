import { useState } from "react";
import { FiClipboard, FiCheckCircle, FiEdit2, FiTrash2, FiSave, FiX,
} from "react-icons/fi";

export default function TaskList (
        {tasks, loading, onEditTask, onDeleteTask, updatingTaskId, deletingTaskId}
    )
{
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");

    const startEditing = (task) => {
        setEditingId(task._id);
        setEditText(task.text);
    };

    const cancelEditing =() =>{
        setEditingId(null);
        setEditText("");
    }

    const saveEditing = async (taskId) => {
        if (!editText.trim()) return;

        const success = await onEditTask(taskId, editText.trim());
        if(success) {
            cancelEditing();
        }
    }

    if (loading) {
        return(
            <p className="tpy-10 text-center text-sm text-gray-500">
                Loading tasks...
            </p>
        );
    }

    if (tasks.length === 0) {
        return(
            <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <h3 className="font-medium text-gray-700">No tasks yet</h3>
                <p className="text-sm text-gray-400">
                    Add a task to get started!
                </p>
            </div>
        )
    }
    return(
        <div className="flex flex-col gap-3">
            {tasks.map((task) => {
                const isEditing = editingId === task._id;
                const isUpdating = updatingTaskId === task._id;
                const isDeleting = deletingTaskId === task._id;
                const isBusy = Boolean(updatingTaskId || deletingTaskId);

                return(
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4" key={task._id}>
                        <div className="flex items-start gap-1">
                            <FiCheckCircle size={20} className="shrink-0 text-violet-500"/>
                            <div className="flex flex-col items-start">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter"){
                                                saveEditing(task._id);
                                            }

                                            if (e.key === "Escape") {
                                                cancelEditing();
                                            }
                                        }}
                                        aria-label="Edit task"
                                        className="min-w-0 flex-1 rounded-lg border border-violet-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none"
                                    />
                                ) : (
                                    <p className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700">
                                        {task.text}
                                    </p>
                                )}
                                {!isEditing && (
                                    <span className="shrink-0 text-xs text-gray-400">
                                        {task.createdAt ? new Date( task.createdAt).toLocaleDateString("en-IN") : ""}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => saveEditing(task._id)}
                                        disabled={!editText.trim() || isUpdating || isBusy}
                                        className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FiSave size={14} />
                                        {isUpdating ? "Saving..." : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        disabled={isUpdating}
                                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <FiX size={14} />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => startEditing(task)}
                                        disabled={isBusy}
                                        aria-label={`Edit ${task.text}`}
                                        className="flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-medium text-violet-600 transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FiEdit2 size={14} />
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDeleteTask(task._id)
                                        }
                                        disabled={isBusy}
                                        aria-label={`Delete ${task.text}`}
                                        className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <FiTrash2 size={14} />
                                        {isDeleting
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}