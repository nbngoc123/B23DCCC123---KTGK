import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Select,
  InputNumber,
  Button,
  Space,
  message
} from 'antd';
import { OrderStatus, Order, OrderItem } from '@/services/QuanLyDonHang/typing';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const OrderForm: React.FC = () => {
  const [form] = Form.useForm();
  const { 
    visible,
    isEdit,
    currentRow,
    MOCK_CUSTOMERS,
    MOCK_PRODUCTS,
    handleFormSubmit,
    handleModalClose,
    calculateTotal,
    onFinish,
    currentTotal 
  } = useModel('QuanLyDonHang.donhang');


  useEffect(() => {
    if (visible) {
      if (isEdit && currentRow) {
        const formItems = currentRow.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));
        
        form.setFieldsValue({
          customerId: currentRow.customer.id,
          status: currentRow.status,
          items: formItems,
        });
        calculateTotal(formItems);
      } else {
        form.resetFields();
        form.setFieldsValue({
          status: OrderStatus.PENDING,
          items: [{ quantity: 1 }]
        });
        calculateTotal([{ quantity: 1 }]);
      }
    }
  }, [visible, isEdit, currentRow, form, MOCK_PRODUCTS]);

  

  // Xử lý thay đổi giá trị form
  const handleFormChange = () => {
    const items = form.getFieldValue('items');
    calculateTotal(items);
  };

  return (
    <Modal
      title={isEdit ? 'Chỉnh Sửa Đơn Hàng' : 'Thêm Đơn Hàng Mới'}
      visible={visible}
      onCancel={handleModalClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleFormChange}
        autoComplete="off"
      >
        <Form.Item
          name="customerId"
          label="Khách Hàng"
          rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
        >
          <Select placeholder="Chọn khách hàng" showSearch optionFilterProp="children">
            {MOCK_CUSTOMERS.map(customer => (
              <Select.Option key={customer.id} value={customer.id}>
                {customer.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng Thái Đơn Hàng"
          initialValue={OrderStatus.PENDING}
        >
          <Select placeholder="Chọn trạng thái">
            {Object.values(OrderStatus).map(status => (
              <Select.Option key={status} value={status}>{status}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Sản phẩm trong đơn hàng">
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space 
                    key={key} 
                    style={{ 
                      display: 'flex', 
                      marginBottom: 8, 
                      borderBottom: '1px dashed #ccc', 
                      paddingBottom: 8 
                    }} 
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'productId']}
                      rules={[{ required: true, message: 'Chọn sản phẩm!' }]}
                      style={{ minWidth: 300, marginBottom: 0 }}
                    >
                      <Select placeholder="Chọn sản phẩm" showSearch optionFilterProp="children">
                        {MOCK_PRODUCTS.map(product => (
                          <Select.Option key={product.id} value={product.id}>
                            {product.name} ({product.price.toLocaleString('vi-VN')} VND)
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity']}
                      rules={[
                        { required: true, message: 'Nhập số lượng!' },
                        { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0' }
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <InputNumber placeholder="SL" min={1} style={{ width: 70 }} />
                    </Form.Item>
                    {fields.length > 1 && (
                      <MinusCircleOutlined 
                        onClick={() => remove(name)} 
                        style={{ color: 'red' }} 
                      />
                    )}
                  </Space>
                ))}
                <Form.Item>
                  <Button 
                    type="dashed" 
                    onClick={() => add({ quantity: 1 })} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    Thêm Sản Phẩm
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label="Tổng Tiền Đơn Hàng">
          <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
            {currentTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </span>
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginTop: 20, marginBottom: 0 }}>
          <Space>
            <Button onClick={handleModalClose}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit">
              {isEdit ? 'Lưu thay đổi' : 'Thêm Đơn Hàng'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OrderForm;
