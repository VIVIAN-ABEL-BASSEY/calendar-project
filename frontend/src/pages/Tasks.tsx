import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask, createTask as createTaskAPI } from "../api/taskApi";
import TaskInput from "../components/task/TaskInput";

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [editingTask, setEditingTask] = useState<any | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.data.tasks);
  };

  const createTask = async (data: any) => {
    const res = await createTaskAPI({ ...data, status: "pending" });
    setTasks((prev) => [res.data, ...prev]);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task._id !== id));
  };

  const toggleStatus = async (task: any) => {
    const updatedStatus =
      task.status === "pending" ? "completed" : "pending";

    setTasks((prev) =>
      prev.map((t) =>
        t._id === task._id ? { ...t, status: updatedStatus } : t
      )
    );

    await updateTask(task._id, { status: updatedStatus });
  };

  const handleEdit = (task: any) => setEditingTask(task);

  const handleUpdate = async () => {
    setTasks((prev) =>
      prev.map((t) =>
        t._id === editingTask._id ? editingTask : t
      )
    );

    await updateTask(editingTask._id, editingTask);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Tasks</h1>

        <TaskInput onCreate={createTask} />

        {/* Edit Form */}
        {editingTask && (
          <div className="p-4 bg-gray-100 rounded mb-4">
            <input
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              className="p-2 border w-full mb-2"
            />
            <button onClick={handleUpdate}>Save</button>
          </div>
        )}

        {/* Task List */}
        <ul>
          {filteredTasks.map((task) => (
            <li key={task._id}>
              {task.title}
              <button onClick={() => handleDelete(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Tasks;