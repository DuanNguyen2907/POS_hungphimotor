import { Select } from 'antd';
import { usePosStore } from '../store/posStore';

export function CustomerSelect() {
  const customers = usePosStore((s) => s.customers);
  const selectedCustomer = usePosStore((s) => s.selectedCustomer);
  const setSelectedCustomer = usePosStore((s) => s.setSelectedCustomer);

  return (
    <Select
      size="large"
      className="kv-customer-select"
      placeholder="Chọn khách hàng"
      value={selectedCustomer?.id}
      allowClear
      showSearch
      optionFilterProp="label"
      onChange={(value) => {
        const customer = customers.find((c) => c.id === value);
        setSelectedCustomer(customer);
      }}
      options={customers.map((c) => ({
        value: c.id,
        label: `${c.fullName}${c.phone ? ` - ${c.phone}` : ''}`
      }))}
    />
  );
}
