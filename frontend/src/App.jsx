import {useEffect, useState} from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import axios from 'axios';
const API_URL = 'http://localhost:5500';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");

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
        console.log("Received from TaskForm:", text);
        if(!text.trim() || adding) return false;

        try{
            setAdding(true);
            setError("");
            const response = await axios.post(`${API_URL}/add`, {text});
            console.log("Backend response:", response.data);
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

                    <TaskList tasks={tasks} loading={loading} />
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                MERN Stack Internship — Task 2
                </p>
            </div>
        </main>
    )
}