import { Button, List, Typography } from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePosStore } from '../store/posStore';

const { Text } = Typography;

interface CartPanelProps {
  onIncrease: (productId: string) => void;
  onDecrease: (productId: string) => void;
}

export function CartPanel({ onIncrease, onDecrease }: CartPanelProps) {
  const cartItems = usePosStore((s) => s.cartItems);
  const removeFromCart = usePosStore((s) => s.removeFromCart);

  return (
    <div style={{ padding: 12, height: '100%', overflowY: 'auto' }}>
      <List
        dataSource={cartItems}
        locale={{ emptyText: 'Cart is empty' }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                key="minus"
                icon={<MinusOutlined />}
                size="small"
                onClick={() => onDecrease(item.productId)}
              />,
              <Text key="qty">{item.quantity}</Text>,
              <Button
                key="plus"
                icon={<PlusOutlined />}
                size="small"
                onClick={() => onIncrease(item.productId)}
              />,
              <Button
                key="remove"
                icon={<DeleteOutlined />}
                danger
                size="small"
                onClick={() => removeFromCart(item.productId)}
              />
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`${item.unitPrice.toLocaleString()} đ x ${item.quantity}`}
            />
            <Text strong>{(item.unitPrice * item.quantity).toLocaleString()} đ</Text>
          </List.Item>
        )}
      />
    </div>
  );
}
