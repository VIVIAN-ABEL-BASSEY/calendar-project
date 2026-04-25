import { Link } from "react-router-dom";


const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-2xl font-bold mb-8">Calendar</h2>

        <nav className="space-y-4">
          <Link to="/" className="cursor-pointer hover:text-gray-300 block py-2">
            Dashboard
          </Link>
          <Link to="/tasks" className="block py-2 cursor-pointer hover:text-gray-300">
            Tasks
          </Link>
          <p className="cursor-pointer hover:text-gray-300">Settings</p>
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default Layout;