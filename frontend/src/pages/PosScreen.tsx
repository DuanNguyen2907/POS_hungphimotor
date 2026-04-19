import { useEffect, useState } from 'react';
import { Alert, Col, Layout, Row, Spin, Typography, message } from 'antd';
import { ProductList } from '../components/ProductList';
import { CartPanel } from '../components/CartPanel';
import { PaymentSection } from '../components/PaymentSection';
import { CustomerSelect } from '../components/CustomerSelect';
import { api } from '../api/api';
import { productApi } from '../api/productApi';
import { customerApi } from '../api/customerApi';
import { usePosStore } from '../store/posStore';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export function PosScreen() {
  const setProducts = usePosStore((s) => s.setProducts);
  const setCustomers = usePosStore((s) => s.setCustomers);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, customers] = await Promise.all([
          productApi.getAll(),
          customerApi.getAll()
        ]);
        setProducts(products);
        setCustomers(customers);
      } catch (error) {
        message.error('Failed to load POS data');
      }
    };

    void loadData();
  }, [setCustomers, setProducts]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ background: '#fff', borderBottom: '1px solid #eee' }}>
        <Title level={4} style={{ margin: 0, lineHeight: '64px' }}>
          POS Screen
        </Title>
      </Header>

      <Content style={{ padding: 12 }}>
        <Row gutter={12} style={{ height: 'calc(100vh - 190px)' }}>
          <Col span={15} style={{ background: '#fff', borderRadius: 8 }}>
            <ProductList />
          </Col>

          <Col span={9} style={{ background: '#fff', borderRadius: 8, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 12 }}>
              <CustomerSelect />
            </div>
            <div style={{ flex: 1 }}>
              <CartPanel />
            </div>
          </Col>
        </Row>
      </Content>

      <Footer style={{ background: 'transparent', padding: 0 }}>
        <PaymentSection />
      </Footer>
    </Layout>
  );
}
