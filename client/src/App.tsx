import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './components/layouts/MainLayout'
import AuthLayout from './components/layouts/AuthLayout'
import AuthProvider from './components/AuthProvider'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MyPage from './pages/MyPage'
import Recordings from './pages/Recordings'
import Feed from './pages/Feed'

const router = createBrowserRouter([
  {
    // 헤더·푸터가 있는 일반 페이지
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/mypage', element: <MyPage /> },
      { path: '/recordings', element: <Recordings /> },
      { path: '/feed', element: <Feed /> },
    ],
  },
  {
    // 헤더·푸터 없는 인증 페이지
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
