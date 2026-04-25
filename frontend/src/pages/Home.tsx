import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import { getTasks,deleteTask, updateTask, createTask as createTaskAPI } from "../api/taskApi";
import TaskInput from "../components/task/TaskInput";
import TaskCalendar from "../components/calendar/TaskCalendar";

const Home = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
    const [editingTask, setEditingTask] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    await deleteTask(id);

    setTasks((prev) => prev.filter((task) => task._id !== id));
  };

  const toggleStatus = async (task: any) => {
    const updatedStatus =
      task.status === "pending" ? "completed" : "pending";
      console.log("Sending status:", updatedStatus);

    // 🔥 update UI instantly
    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, status: updatedStatus } : t
      )
    );

    try {
      const res = await updateTask(task._id, { status: updatedStatus });
    console.log("Response:", res.data);
    } catch (err: any) {
      console.error("ERROR:", err.response?.data);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-semibold">Today</h1>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          + Add Task
        </button>
      </div>
      <TaskCalendar tasks={tasks} onDelete={handleDelete} onToggle={toggleStatus}/>
    </Layout>
  );
};

export default Home;