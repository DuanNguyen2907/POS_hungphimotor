import { useMemo, useState } from 'react';
import { Card, Col, Input, Row, Tag, Typography, Empty } from 'antd';
import { BarcodeOutlined, SearchOutlined } from '@ant-design/icons';
import { usePosStore } from '../store/posStore';

const { Text } = Typography;

export function ProductList() {
  const [searchText, setSearchText] = useState('');
  const products = usePosStore((s) => s.products);
  const addProductToCart = usePosStore((s) => s.addProductToCart);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.isActive &&
          (p.name.toLowerCase().includes(searchText.toLowerCase()) ||
            p.barcode.toLowerCase().includes(searchText.toLowerCase()))
      ),
    [products, searchText]
  );

  return (
    <div className="kv-products">
      <Input
        size="large"
        placeholder="Tìm theo tên hàng / mã vạch"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
        className="kv-search-input"
      />

      <Row gutter={[12, 12]} className="kv-product-grid">
        {filteredProducts.map((product) => (
          <Col key={product.id} xs={24} md={12}>
            <Card
              hoverable
              className="kv-product-card"
              bodyStyle={{ padding: 12 }}
              onClick={() => addProductToCart(product)}
            >
              <Text strong className="kv-product-name">
                {product.name}
              </Text>
              <div className="kv-product-meta">
                <BarcodeOutlined />
                <Text type="secondary">{product.barcode}</Text>
              </div>
              <div className="kv-product-tags">
                <Tag color="blue">{product.price.toLocaleString()} đ</Tag>
                <Tag color={product.stock > 0 ? 'green' : 'red'}>Tồn: {product.stock}</Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {!filteredProducts.length && <Empty description="Không tìm thấy sản phẩm" />}
    </div>
  );
}
