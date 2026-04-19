import { useEffect } from 'react';
import { Alert, Col, Layout, Row, Spin, Typography, message } from 'antd';
import { ProductList } from '../components/ProductList';
import { CartPanel } from '../components/CartPanel';
import { PaymentSection } from '../components/PaymentSection';
import { CustomerSelect } from '../components/CustomerSelect';
import { usePosLogic } from '../hooks/usePosLogic';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export function PosScreen() {
  const {
    products,
    subtotal,
    discount,
    discountAmount,
    total,
    loadingProducts,
    productsError,
    checkoutLoading,
    loadProducts,
    setDiscount,
    addToCart,
    increaseCartItem,
    decreaseCartItem,
    submitOrder
  } = usePosLogic();

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const onAddToCart = (product: (typeof products)[number]) => {
    const error = addToCart(product);
    if (error) {
      message.warning(error);
    }
  };

  const onIncrease = (productId: string) => {
    const error = increaseCartItem(productId);
    if (error) {
      message.warning(error);
    }
  };

  const onCheckout = async () => {
    const result = await submitOrder();
    if (result.ok) {
      message.success(result.message);
      void loadProducts();
      return;
    }

    message.error(result.message);
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
              <ProductList products={products} onAddToCart={onAddToCart} />
            </Col>

            <Col
              span={9}
              style={{ background: '#fff', borderRadius: 8, display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ padding: 12 }}>
                <CustomerSelect />
              </div>
              <div style={{ flex: 1 }}>
                <CartPanel onIncrease={onIncrease} onDecrease={decreaseCartItem} />
              </div>
            </Col>
          </Row>
        </Spin>
      </Content>

      <Footer style={{ background: 'transparent', padding: 0 }}>
        <PaymentSection
          subtotal={subtotal}
          discountType={discount.type}
          discountValue={discount.value}
          discountAmount={discountAmount}
          total={total}
          checkoutLoading={checkoutLoading}
          onDiscountTypeChange={(type) => setDiscount((prev) => ({ ...prev, type }))}
          onDiscountValueChange={(value) => setDiscount((prev) => ({ ...prev, value }))}
          onCheckout={onCheckout}
        />
      </Footer>
    </Layout>
  );
}
