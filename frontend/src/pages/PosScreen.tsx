import { useEffect, useState } from 'react';
import { Alert, Col, Layout, Row, Spin, Typography, message } from 'antd';
import { ProductList } from '../components/ProductList';
import { CartPanel } from '../components/CartPanel';
import { PaymentSection } from '../components/PaymentSection';
import { CustomerSelect } from '../components/CustomerSelect';
import { api } from '../api/api';
import { usePosStore } from '../store/posStore';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export function PosScreen() {
  const setProducts = usePosStore((s) => s.setProducts);
  const clearCart = usePosStore((s) => s.clearCart);
  const cartItems = usePosStore((s) => s.cartItems);
  const selectedCustomer = usePosStore((s) => s.selectedCustomer);
  const total = usePosStore((s) => s.getTotal());

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      setProductsError(null);
      try {
        const products = await api.getProducts();
        setProducts(products);
      } catch {
        setProductsError('Failed to load products from API.');
      } finally {
        setLoadingProducts(false);
      }
    };

    void loadProducts();
  }, [setProducts]);

  const handleCheckout = async () => {
    if (!cartItems.length) {
      message.warning('Please add at least one product to cart');
      return;
    }

    setCheckoutLoading(true);
    try {
      const order = await api.createOrder({
        customerId: selectedCustomer?.id,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      message.success(`Order ${order.orderNo} created. Total: ${total.toLocaleString()} đ`);
      clearCart();
    } catch {
      message.error('Checkout failed. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
        <Title level={4} style={{ margin: 0, lineHeight: '64px' }}>
          POS Screen
        </Title>
      </Header>

      <Content style={{ padding: 12 }}>
        {productsError && (
          <Alert
            type="error"
            message={productsError}
            style={{ marginBottom: 12 }}
            showIcon
          />
        )}

        <Spin spinning={loadingProducts} tip="Loading products...">
          <Row gutter={12} style={{ height: 'calc(100vh - 190px)' }}>
            <Col span={15} style={{ background: '#fff', borderRadius: 8 }}>
              <ProductList />
            </Col>

            <Col
              span={9}
              style={{ background: '#fff', borderRadius: 8, display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: 12 }}>
                <CustomerSelect />
              </div>
              <div style={{ flex: 1 }}>
                <CartPanel />
              </div>
            </Col>
          </Row>
        </Spin>
      </Content>

      <Footer style={{ background: 'transparent', padding: 0 }}>
        <PaymentSection checkoutLoading={checkoutLoading} onCheckout={handleCheckout} />
      </Footer>
    </Layout>
  );
}
