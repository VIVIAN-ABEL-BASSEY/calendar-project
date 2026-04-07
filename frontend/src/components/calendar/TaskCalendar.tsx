import { useState } from "react";
import Calendar from "react-calendar";

interface Props {
  tasks: any[];
  onDelete: (id: string) => void;
  onToggle: (task: any) => void;
}


const TaskCalendar = ({ tasks, onDelete, onToggle  }: Props) => {
  const [date, setDate] = useState<Date | null>(new Date());
  
 // filter tasks for selected date
    const selectedDateTasks = tasks.filter((task) => {
    if (!task.dueDate || !date) return false;

    const taskDate = new Date(task.dueDate);

    return taskDate.toDateString() === date.toDateString();
});

  return (
    <div className="bg-white p-4 rounded shadow">
        <Calendar
            selectRange={false}
            onChange={(value) => {
                if (value instanceof Date) setDate(value);
            }}
            value={date}
            tileContent={({ date, view }) => {
                if (view !== "month") return null;

                const hasTask = tasks.some((task) => {
                if (!task.dueDate) return false;
                return (
                    new Date(task.dueDate).toDateString() ===
                    date.toDateString()
                );
                });

                return hasTask ? (
                <div className="flex justify-center mt-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                </div>
                ) : null;
            }}
        />

      <div className="mt-4">
        <h3 className="font-semibold">Tasks for {date ? date.toDateString() : "No date selected"}</h3>
        {selectedDateTasks.length === 0 ? (
          <p className="text-sm text-gray-500">
            No tasks for this day
          </p>
        ) : (
          <ul>
            {selectedDateTasks.map((task) => (
              <li
                key={task._id}
                className={`p-2 border-b flex justify-between items-center ${
                    task.priority === "high"
                    ? "border-l-4 border-red-500"
                    : task.priority === "medium"
                    ? "border-l-4 border-yellow-500"
                    : "border-l-4 border-green-500"
                }`}
                >
                <div>
                    <p
                    className={`${
                        task.status === "completed"
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                    >
                    {task.title}
                    </p>
                    <p>{task.description}</p>
                    <p>{task.status}</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => onToggle(task)}
                        className="text-green-500 text-xs"
                    >
                        {task.status === "pending" ? "✔" : "↺"}
                    </button>

                    <button
                        onClick={() => onDelete(task._id)}
                        className="text-red-500 text-xs"
                    >
                        ✕
                    </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskCalendar;