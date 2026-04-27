import { ConfigProvider } from 'antd';
import { PosScreen } from './pages/PosScreen';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0f62fe',
          borderRadius: 8,
          colorBgLayout: '#f3f6fb',
          fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
        }
      }}
    >
      <PosScreen />
    </ConfigProvider>
  );
}
