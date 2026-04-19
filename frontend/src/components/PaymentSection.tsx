import { Button, Card, Divider, InputNumber, Select, Space, Typography } from 'antd';
import type { DiscountType } from '../hooks/usePosLogic';

const { Text, Title } = Typography;

interface PaymentSectionProps {
  subtotal: number;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  total: number;
  checkoutLoading: boolean;
  onDiscountTypeChange: (type: DiscountType) => void;
  onDiscountValueChange: (value: number) => void;
  onCheckout: () => Promise<void>;
}

export function PaymentSection({
  subtotal,
  discountType,
  discountValue,
  discountAmount,
  total,
  checkoutLoading,
  onDiscountTypeChange,
  onDiscountValueChange,
  onCheckout
}: PaymentSectionProps) {
  return (
    <Card size="small" style={{ margin: 12 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Subtotal</Text>
          <Text>{subtotal.toLocaleString()} đ</Text>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Select
            style={{ width: 140 }}
            value={discountType}
            onChange={(value) => onDiscountTypeChange(value as DiscountType)}
            options={[
              { value: 'none', label: 'No discount' },
              { value: 'fixed', label: 'Fixed (đ)' },
              { value: 'percent', label: 'Percent (%)' }
            ]}
          />
          <InputNumber
            style={{ flex: 1 }}
            min={0}
            value={discountValue}
            onChange={(value) => onDiscountValueChange(Number(value ?? 0))}
            disabled={discountType === 'none'}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>Discount</Text>
          <Text>- {discountAmount.toLocaleString()} đ</Text>
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

        <Button type="primary" size="large" block loading={checkoutLoading} onClick={() => void onCheckout()}>
          Payment
        </Button>
      </Space>
    </Card>
  );
}
