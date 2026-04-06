import { useState } from "react";
import Calendar from "react-calendar";

interface Props {
  tasks: any[];
}

const TaskCalendar = ({ tasks }: Props) => {
  const [date, setDate] = useState<Date | null>(new Date());

  // filter tasks for selected date
    const selectedDateTasks = tasks.filter((task) => {
    if (!task.dueDate || !date) return false;

    const taskDate = new Date(task.dueDate);

    return taskDate.toDateString() === date.toDateString();
});

  return (
    <div className="bg-white p-4 rounded shadow">
        <Calendar onChange={(value) => {
            if (value instanceof Date) {
            setDate(value);
            }}}value={date}
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
                className="p-2 border-b"
              >
                {task.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskCalendar;