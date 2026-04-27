import { Button, Divider, Typography, message } from 'antd';
import { useState } from 'react';
import { CreditCardOutlined } from '@ant-design/icons';
import { api } from '../api/api';
import { usePosStore } from '../store/posStore';

const { Text, Title } = Typography;

export function PaymentSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = usePosStore((s) => s.getTotal());
  const cartItems = usePosStore((s) => s.cartItems);
  const selectedCustomer = usePosStore((s) => s.selectedCustomer);
  const clearCart = usePosStore((s) => s.clearCart);
  const setProducts = usePosStore((s) => s.setProducts);
  const products = usePosStore((s) => s.products);

  const onCheckout = async () => {
    if (!cartItems.length) {
      message.warning('Please add at least one product to cart');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await api.createOrder({
        customerId: selectedCustomer?.id,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      const quantityByProductId = new Map(cartItems.map((item) => [item.productId, item.quantity]));

      setProducts(
        products.map((product) => {
          const soldQuantity = quantityByProductId.get(product.id);
          if (!soldQuantity) {
            return product;
          }

          return {
            ...product,
            stock: Math.max(product.stock - soldQuantity, 0)
          };
        })
      );

      message.success(
        `Order ${order.orderNo} created. Customer: ${selectedCustomer?.fullName ?? 'Guest'} | Total: ${total.toLocaleString()} đ`
      );
      clearCart();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        message.error('Unauthorized. Please login again.');
        return;
      }

      if (error?.response?.status === 400) {
        message.error('Checkout failed due to invalid payload or stock conflict.');
        return;
      }

      message.error('Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kv-payment-box">
      <div className="kv-payment-row">
        <Text type="secondary">Số lượng hàng</Text>
        <Text strong>{cartItems.reduce((sum, i) => sum + i.quantity, 0)}</Text>
      </div>

      <Divider style={{ margin: '10px 0' }} />

      <div className="kv-payment-row">
        <Title level={4} style={{ margin: 0 }}>
          Khách cần trả
        </Title>
        <Title level={4} style={{ margin: 0, color: '#0f62fe' }}>
          {total.toLocaleString()} đ
        </Title>
      </div>

      <Button
        type="primary"
        size="large"
        block
        onClick={onCheckout}
        loading={isSubmitting}
        icon={<CreditCardOutlined />}
      >
        Thanh toán
      </Button>
    </div>
  );
}
