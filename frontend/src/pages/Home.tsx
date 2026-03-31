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

const Home = () => {
  return (
    <Layout>
      {/* Header */}
      <div className="bg-white p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-semibold">Today</h1>

        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          + Add Task
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <p>Your calendar will appear here</p>
      </div>
    </Layout>
  );
};

export default Home;