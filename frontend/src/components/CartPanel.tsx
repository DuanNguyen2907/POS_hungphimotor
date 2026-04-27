import { Button, List, Typography } from 'antd';
import { MinusOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { usePosStore } from '../store/posStore';

const { Text } = Typography;

export function CartPanel() {
  const cartItems = usePosStore((s) => s.cartItems);
  const increaseQuantity = usePosStore((s) => s.increaseQuantity);
  const decreaseQuantity = usePosStore((s) => s.decreaseQuantity);
  const removeFromCart = usePosStore((s) => s.removeFromCart);

  return (
    <div className="kv-cart-list">
      <List
        dataSource={cartItems}
        locale={{ emptyText: 'Giỏ hàng đang trống' }}
        renderItem={(item) => (
          <List.Item className="kv-cart-item">
            <div className="kv-cart-item-main">
              <Text strong>{item.name}</Text>
              <Text type="secondary">
                {item.unitPrice.toLocaleString()} đ x {item.quantity}
              </Text>
            </div>

            <div className="kv-cart-actions">
              <Button
                icon={<MinusOutlined />}
                size="small"
                onClick={() => decreaseQuantity(item.productId)}
              />
              <Text className="kv-cart-qty">{item.quantity}</Text>
              <Button
                icon={<PlusOutlined />}
                size="small"
                onClick={() => increaseQuantity(item.productId)}
              />
              <Button
                icon={<DeleteOutlined />}
                danger
                size="small"
                onClick={() => removeFromCart(item.productId)}
              />
            </div>

            <Text strong className="kv-cart-line-total">
              {(item.unitPrice * item.quantity).toLocaleString()} đ
            </Text>
          </List.Item>
        )}
      />
    </div>
  );
}
