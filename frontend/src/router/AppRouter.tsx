import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import CalendarPage from '../pages/CalendarPage'
import AppShell from '../components/layout/AppShell'
import '../styles/sidebar.css'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route
            path="/calendar"
            element={
              <AppShell>
                {(currentDate, registerCreateTask) => (
                  <CalendarPage
                    currentDate={currentDate}
                    registerCreateTask={registerCreateTask}
                  />
                )}
              </AppShell>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}