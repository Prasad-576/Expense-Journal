import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
