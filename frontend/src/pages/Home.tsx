import { useEffect, useState } from "react";
import { getTasks } from "../api/taskApi";

const Home = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await getTasks();
        setTasks(res.data.tasks);
      } catch (error:any) {
        console.log(error.response?.data)
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h2>My Tasks</h2>

      {tasks && tasks.length === 0 ? (
  <p>No tasks yet</p>
) : (
  tasks?.map((task) => (
    <div key={task._id}>
      <p>{task.title}</p>
    </div>
  ))
)}
    </div>
  );
};

export default Home;