import { useMemo, useState } from 'react';
import { Card, Col, Input, Row, Tag, Typography } from 'antd';
import type { Product } from '../types';

const { Text } = Typography;

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  const [searchText, setSearchText] = useState('');

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
    <div style={{ padding: 12 }}>
      <Input.Search
        placeholder="Search by name or barcode"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
      />

      <Row gutter={[12, 12]} style={{ marginTop: 12, maxHeight: 520, overflowY: 'auto' }}>
        {filteredProducts.map((product) => (
          <Col key={product.id} span={12}>
            <Card hoverable size="small" onClick={() => onAddToCart(product)}>
              <Text strong>{product.name}</Text>
              <br />
              <Text type="secondary">{product.barcode}</Text>
              <br />
              <Tag color="blue">{product.price.toLocaleString()} đ</Tag>
              <Tag color={product.stock > 0 ? 'green' : 'red'}>
                Stock: {product.stock}
              </Tag>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
