import { Button, Card, Divider, Space, Typography, message } from 'antd';
import { usePosStore } from '../store/posStore';

const { Text, Title } = Typography;

export function PaymentSection() {
  const total = usePosStore((s) => s.getTotal());
  const cartItems = usePosStore((s) => s.cartItems);
  const selectedCustomer = usePosStore((s) => s.selectedCustomer);
  const clearCart = usePosStore((s) => s.clearCart);

  const onCheckout = () => {
    if (!cartItems.length) {
      message.warning('Please add at least one product to cart');
      return;
    }

    message.success(
      `Checkout success. Customer: ${selectedCustomer?.fullName ?? 'Guest'} | Total: ${total.toLocaleString()} đ`
    );
    clearCart();
  };

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

        <Button type="primary" size="large" block onClick={onCheckout}>
          Payment
        </Button>
      </Space>
    </Card>
  );
}
