import {useEffect, useState} from 'react';
import {FiCheckCircle, FiEdit2, FiTrash2} from "react-icons/fi";
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import axios from 'axios';
const API_URL = 'http://localhost:5500';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [updatingTaskId, setUpdatingTaskId] = useState(null);
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const [error, setError] = useState("");
    const [taskToDelete, setTaskToDelete] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try{
                const response = await axios.get(`${API_URL}/tasks`);
                setTasks(response.data);
            } catch (error) {
                console.error(error);
                setError("Unable to load taks. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
    }, []);

    const addTask = async (text) => {
        // console.log("Received from TaskForm:", text);
        if(!text.trim() || adding) return false;

        try{
            setAdding(true);
            setError("");
            const response = await axios.post(`${API_URL}/add`, {text});
            // console.log("Backend response:", response.data);
            setTasks((prev) => [response.data, ...prev]);
            return true;
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Unable to add task. Please try again later."
            );
            return false;
        } finally {
            setAdding(false);
        }
    };

    const editTask = async(id, text) => {
        if(!text.trim() || updatingTaskId) return false;
        try{
            setUpdatingTaskId(id);
            setError("");

            const response = await axios.post(`${API_URL}/update/${id}`, {text});
            
            setTasks((prev) => prev.map((task) => task._id === id ? response.data : task))
            return true;
        } catch (error) {
            console.log(error);
            setError(
                error.response?.data?.message || 
                "Unable to update task. Please try again later."
            );
            return false;
        } finally {
            setUpdatingTaskId(null);
        }
    }

    const deleteTask = async(id) => {
        if(updatingTaskId || deletingTaskId) return;
        setTaskToDelete(id);
    }

    const confirmDeleteTask = async() => {
        const id = taskToDelete;

        if(!id || updatingTaskId || deletingTaskId) return;

        try{
            setDeletingTaskId(id);
            setError("");

            await axios.delete(`${API_URL}/delete/${id}`)
            setTasks((prev) => prev.filter((task) => task._id !== id));
            setTaskToDelete(null);
        } catch (error) {
            console.log(error);
            setError(
                error.response?.data?.message ||
                "Unable to delete task. Please try again later."
            );
        } finally {
            setDeletingTaskId(null);
        }
    }

    return(
        <main className="min-h-screen bg-[#F7F7FB] px-4 py-16 sm:px-6">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        My To-Do List
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Organize your tasks and stay productive.
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

                    <TaskForm
                        onAddTask={addTask}
                        loading={adding}
                    />

                    {error && (
                        <div
                        role="alert"
                        className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                        >
                        {error}
                        </div>
                    )}

                    {/* Task list header */}
                    <div className="mb-5 mt-8 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Your Tasks
                        </h2>

                        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-600">
                            {tasks.length} Tasks
                        </span>
                    </div>

                    <TaskList 
                        tasks={tasks}
                        loading={loading}
                        onEditTask={editTask}
                        onDeleteTask={deleteTask}
                        updatingTaskId={updatingTaskId}
                        deletingTaskId={deletingTaskId}
                    />
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                MERN Stack Internship — Task 2
                </p>
            </div>

            {taskToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 px-4 py-6 backdrop-blur-[3px]" onMouseDown={(e) =>{
                    if(e.target === e.currentTarget && !deletingTaskId) {
                        setTaskToDelete(null);
                    }
                }}
                >
                    <div role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" className="w-full max-w-sm flex flex-col rounded-2xl bg-gray-100 p-4 gap-3" >
                        <h2
                            id="delete-modal-title"
                            className=" text-xl font-semibold tracking-tight text-gray-900"
                        >
                            Delete this task?
                        </h2>

                        <p className="text-sm leading-5 tracking-tight text-gray-700">
                            This action cannot be undone. The task will be
                            permanently removed from your list.
                        </p>

                        <div className="rounded-xl bg-gray-200 p-3">
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                Task to delete
                            </p>

                            <p className="break-words text-sm font-medium text-gray-700">
                                {tasks.find(
                                    (task) => task._id === taskToDelete
                                )?.text || "Selected task"}
                            </p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setTaskToDelete(null)}
                                disabled={Boolean(deletingTaskId)}
                                className="inline-flex w-full items-center justify-center rounded-xl bg-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDeleteTask}
                                disabled={Boolean(deletingTaskId)}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36"
                            >
                                <FiTrash2 size={16} />
                                {deletingTaskId ? "Deleting..." : "Delete task"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}