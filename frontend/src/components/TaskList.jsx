import { FiClipboard, FiCheckCircle } from "react-icons/fi";

export default function TaskList ({tasks, loading}){
    if (loading) {
        retrun(
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
            {tasks.map((task) => (
                <div key={task._id}
                    className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 transition hover:border-violet-200 hover:bg-violet-50"
                >
                    <FiCheckCircle
                        size={20}
                        className="shrink-0 text-violet-500"
                    />
                    <p className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700">{task.text}</p>
                    <span className="shrink-0 text-xs text-gray-400">
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-IN") : ""}
                    </span>
                </div>
            ))}
        </div>
    )
}