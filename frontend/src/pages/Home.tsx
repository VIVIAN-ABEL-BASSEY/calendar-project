// import { useEffect, useState } from "react";
// import { getTasks } from "../api/taskApi";
// import Layout from "../components/layout/Layout";

// const Home = () => {
//   const [tasks, setTasks] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await getTasks();
//         setTasks(res.data.tasks);
//       } catch (error:any) {
//         console.log(error.response?.data)
//       }
//     };

//     fetchTasks();
//   }, []);

//   return (
//     <Layout>
//       <h2>My Tasks</h2>

//       {tasks && tasks.length === 0 ? (
//   <p>No tasks yet</p>
// ) : (
//   tasks?.map((task) => (
//     <div key={task._id}>
//       <p>{task.title}</p>
//     </div>
//   ))
// )}
//     </Layout>
//   );
// };

// export default Home;

import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import { getTasks,deleteTask, updateTask, createTask as createTaskAPI } from "../api/taskApi";
import TaskInput from "../components/task/TaskInput";
import TaskCalendar from "../components/calendar/TaskCalendar";

const Home = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
    const [editingTask, setEditingTask] = useState<any | null>(null);

    const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.data.tasks);
    };
    useEffect(() => {
    fetchTasks();
    }, []);

  const createTask = async (data: any) => {
    const res = await createTaskAPI({
      ...data,
      status: "pending",
    });

    const newTask = res.data;

    console.log("NEW TASK RESPONSE:", newTask); // debug

    setTasks((prev) => [
      {
        ...newTask,
        title: newTask.title || data.title, // fallback
      },
      ...prev,
    ]);
  };

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

  const filteredTasks = tasks.filter((task) => {
  if (filter === "all") return true;
  return task.status === filter;
});
  const handleEdit = (task: any) => {
    setEditingTask(task);
  };
  
  const handleUpdate = async () => {
  try {
    // ✅ Update UI instantly
    setTasks((prev) =>
      prev.map((t) =>
        t._id === editingTask._id ? editingTask : t
      )
    );

    // ✅ Then sync with backend
    await updateTask(editingTask._id, editingTask);

    setEditingTask(null); // close form
  } catch (err) {
    console.error(err);
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

      {/* Content */}
      <div className="p-6">
        <TaskInput onCreate={createTask} />
        {editingTask && (
          <div className="p-4 bg-gray-100 rounded mb-4">
            <h3 className="font-semibold mb-2">Edit Task</h3>

            <input
              type="text"
              value={editingTask.title}
              onChange={(e) =>
                setEditingTask({ ...editingTask, title: e.target.value })
              }
              className="p-2 border w-full mb-2"
            />

            <textarea
              value={editingTask.description}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  description: e.target.value,
                })
              }
              className="p-2 border w-full mb-2"
            />

            <input
              type="date"
              value={editingTask.dueDate?.split("T")[0]}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  dueDate: e.target.value,
                })
              }
              className="p-2 border w-full mb-2"
            />

            <select
              value={editingTask.priority}
              onChange={(e) =>
                setEditingTask({
                  ...editingTask,
                  priority: e.target.value,
                })
              }
              className="p-2 border w-full mb-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </div>
        )}

        {tasks.length === 0 ? (
            <p>No tasks yet</p>
        ) : (
            <ul>
            {filteredTasks.map((task) => (
              <li key={task._id} className="p-2 bg-white mb-2 rounded shadow">
                {/* {task.title} */}
                <p className={`font-semibold text-lg ${
                  task.status === "completed"? "line-through text-gray-400": ""}`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-500">{task.description}</p>
                <p className="text-sm text-gray-500">{task.status}</p>
                <p className="text-xs">Due on {task.dueDate}</p>
                <button onClick={() => handleDelete(task._id)}className="text-red-500 text-sm mt-2">Delete
                </button>
                <button onClick={() => toggleStatus(task)}className="text-green-500 text-sm mt-2 mr-3">
                  {task.status === "pending" ? "Mark as Done" : "Undo"}
                </button>
                <button onClick={() => handleEdit(task)} className="text-blue-500 text-sm mt-2">
                  Edit
                </button>
              </li>
            ))}
            </ul>
        )}
        </div>
    </Layout>
  );
};

export default Home;