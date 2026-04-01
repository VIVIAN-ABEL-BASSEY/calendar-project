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
          <div>
          <label className="block text-sm font-medium mb-1">
            Add Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Set Priority
            </label>
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
              className="p-2 border rounded w-full"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
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