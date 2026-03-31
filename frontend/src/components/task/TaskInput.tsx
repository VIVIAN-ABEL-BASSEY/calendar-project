import { useState } from "react";

interface Props {
  onCreate: (title: string) => void;
}

const TaskInput = ({ onCreate }: Props) => {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;

    onCreate(title);
    setTitle("");
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 p-2 border rounded outline-none"
      />

      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 rounded"
      >
        Add
      </button>
    </div>
  );
};

export default TaskInput;