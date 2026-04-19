import { ConfigProvider } from 'antd';
import { PosScreen } from './pages/PosScreen';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6
        }
      }}
    >
      <PosScreen />
    </ConfigProvider>
  );
}
