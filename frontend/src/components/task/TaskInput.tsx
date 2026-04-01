// import { useState } from "react";

// interface Props {
//   onCreate: (title: string) => void;
// }

// const TaskInput = ({ onCreate }: Props) => {
//   const [title, setTitle] = useState("");

//   const handleAdd = () => {
//     if (!title.trim()) return;

//     onCreate(title);
//     setTitle("");
//   };

//   return (
//     <div className="flex gap-2 mb-4">
//       <input
//         type="text"
//         placeholder="Add a new task..."
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="flex-1 p-2 border rounded outline-none"
//       />

//       <button
//         onClick={handleAdd}
//         className="bg-blue-500 text-white px-4 rounded"
//       >
//         Add
//       </button>
//     </div>
//   );
// };

// export default TaskInput;

import { useState } from "react";

interface Props {
  onCreate: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high";
  }) => void;
}

const TaskInput = ({ onCreate }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = () => {
    const trimmed = title.trim();

    if (!trimmed) {
      alert("Title is required");
      return;
    }

    onCreate({
      title: trimmed,
      description,
      dueDate: dueDate || undefined,
      priority,
    });

    // reset
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
    setIsOpen(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      {!isOpen ? (
        <input
          type="text"
          placeholder="Add a new task..."
          onFocus={() => setIsOpen(true)}
          className="w-full p-2 border rounded"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {/* Title */}
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded"
          />

          {/* Description */}
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded"
          />

          {/* Due Date */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border rounded"
          />

          {/* Priority */}
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
            className="p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInput;