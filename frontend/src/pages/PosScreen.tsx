import { useEffect } from 'react';
import { Layout, Row, Col, Typography, message, Space, Badge } from 'antd';
import { ShopOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { ProductList } from '../components/ProductList';
import { CartPanel } from '../components/CartPanel';
import { PaymentSection } from '../components/PaymentSection';
import { CustomerSelect } from '../components/CustomerSelect';
import { productApi } from '../api/productApi';
import { customerApi } from '../api/customerApi';
import { usePosStore } from '../store/posStore';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

export function PosScreen() {
  const setProducts = usePosStore((s) => s.setProducts);
  const setCustomers = usePosStore((s) => s.setCustomers);
  const cartItems = usePosStore((s) => s.cartItems);
  const total = usePosStore((s) => s.getTotal());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, customers] = await Promise.all([productApi.getAll(), customerApi.getAll()]);
        setProducts(products);
        setCustomers(customers);
      } catch (error) {
        message.error('Failed to load POS data');
      }
    };

    void loadData();
  }, [setCustomers, setProducts]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Layout className="kv-layout">
      <Header className="kv-header">
        <div className="kv-brand">
          <div className="kv-brand-logo">KV</div>
          <div>
            <Title level={4} className="kv-brand-title">
              KiotViet POS Mockup
            </Title>
            <Text className="kv-brand-subtitle">Bán hàng nhanh tại quầy</Text>
          </div>
        </div>

        <Space size={20} className="kv-header-stats">
          <Badge color="#22c55e" text={`Sản phẩm trong giỏ: ${totalItems}`} />
          <Text className="kv-header-total">Tạm tính: {total.toLocaleString()} đ</Text>
        </Space>
      </Header>

      <Content className="kv-content">
        <Row gutter={16} className="kv-main-row">
          <Col xs={24} lg={15} className="kv-main-col">
            <section className="kv-panel kv-products-panel">
              <div className="kv-section-title">
                <ShopOutlined />
                <span>Danh sách sản phẩm</span>
              </div>
              <ProductList />
            </section>
          </Col>

          <Col xs={24} lg={9} className="kv-main-col">
            <section className="kv-panel kv-cart-panel">
              <div className="kv-section-title">
                <ShoppingCartOutlined />
                <span>Giỏ hàng</span>
              </div>

              <div className="kv-customer-wrap">
                <div className="kv-customer-label">
                  <UserOutlined />
                  <span>Khách hàng</span>
                </div>
                <CustomerSelect />
              </div>

              <div className="kv-cart-list-wrap">
                <CartPanel />
              </div>

              <PaymentSection />
            </section>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
