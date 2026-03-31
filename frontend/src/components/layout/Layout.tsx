const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold">Task Manager</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        {children}
      </div>
    </div>
  );
};

export default Layout;