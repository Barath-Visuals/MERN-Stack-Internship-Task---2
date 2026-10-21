import { useState } from "react";

export default function TaskForm ({ onAddTask, loading}) {
    const [text, setText] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting task:", text);

        if(!text.trim()) {
            console.log("Task text is empty. Not submitting.");
            return
        };

        const success = await onAddTask(text.trim());

        if(success) {
            setText("");
        }
    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition"
            />

            <button className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={loading}>
                <span className=" font-medium text-white">
                    {loading ? "Adding..." : "Add Task"}
                </span>
            </button>
        </form>
    )
}