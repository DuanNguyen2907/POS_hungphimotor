import { Button, Card, Divider, Space, Typography } from 'antd';
import { usePosStore } from '../store/posStore';

const { Text, Title } = Typography;

interface PaymentSectionProps {
  checkoutLoading: boolean;
  onCheckout: () => Promise<void>;
}

export function PaymentSection({ checkoutLoading, onCheckout }: PaymentSectionProps) {
  const total = usePosStore((s) => s.getTotal());
  const cartItems = usePosStore((s) => s.cartItems);

  return (
    <Card size="small" style={{ margin: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Total items</Text>
          <Text>{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</Text>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>
            Grand Total
          </Title>
          <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
            {total.toLocaleString()} đ
          </Title>
        </div>

        <Button type="primary" size="large" block loading={checkoutLoading} onClick={() => void onCheckout()}>
          Payment
        </Button>
      </Space>
    </Card>
  );
}
