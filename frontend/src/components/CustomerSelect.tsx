import { Select } from 'antd';
import { usePosStore } from '../store/posStore';

export function CustomerSelect() {
  const customers = usePosStore((s) => s.customers);
  const selectedCustomer = usePosStore((s) => s.selectedCustomer);
  const setSelectedCustomer = usePosStore((s) => s.setSelectedCustomer);

  return (
    <Select
      style={{ width: '100%' }}
      placeholder="Select customer"
      value={selectedCustomer?.id}
      allowClear
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
