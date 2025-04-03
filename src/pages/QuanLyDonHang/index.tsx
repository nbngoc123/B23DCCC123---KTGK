import React from 'react';
import { 
  OrderStatus,
  Order,
} from '@/services/QuanLyDonHang/typing';
import {
  Button,
  Input,
  Table,
  Select,
  Space,
  Tag,
  Popconfirm,
  Row,
  Col
} from 'antd';
import moment from 'moment';
import OrderForm from './Form';
import { useModel } from 'umi';
import type { IColumn } from '@/components/Table/typing';


const OrderManagement: React.FC = () => {
  const {
    filteredOrders,
    searchTerm,
    filterStatus,
    setSearchTerm,
    setFilterStatus,
    handleAddNew,
    handleEdit,
    handleCancelOrder,
  } = useModel('QuanLyDonHang.donhang');

  const columns: IColumn<Order>[] = [
    {
      title: 'Mã Đơn Hàng',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: 'Khách Hàng',
      dataIndex: ['customer', 'name'],
      key: 'customerName',
      width: 200,
    },
    {
      title: 'Ngày Đặt Hàng',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 150,
      render: (date: Date) => moment(date).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.orderDate).unix() - moment(b.orderDate).unix(),
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
      align: 'right',
      render: (amount: number) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: OrderStatus) => {
        let color = 'default';
        switch (status) {
          case OrderStatus.PENDING: color = 'orange'; break;
          case OrderStatus.SHIPPING: color = 'blue'; break;
          case OrderStatus.COMPLETED: color = 'green'; break;
          case OrderStatus.CANCELLED: color = 'red'; break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
filters: [
        { text: OrderStatus.PENDING, value: OrderStatus.PENDING },
        { text: OrderStatus.SHIPPING, value: OrderStatus.SHIPPING },
        { text: OrderStatus.COMPLETED, value: OrderStatus.COMPLETED },
        { text: OrderStatus.CANCELLED, value: OrderStatus.CANCELLED },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành Động',
      key: 'action',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title={`Bạn chắc chắn muốn hủy đơn hàng ${record.id}?`}
            onConfirm={() => handleCancelOrder(record)}
            okText="Đồng ý"
            cancelText="Không"
            disabled={record.status !== OrderStatus.PENDING}
          >
            <Button danger disabled={record.status !== OrderStatus.PENDING}>
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <Button type="primary" onClick={handleAddNew}>
            Thêm Đơn Hàng
          </Button>
        </Col>
        <Col flex="auto">
          <Input.Search
            placeholder="Tìm theo mã ĐH hoặc tên KH"
            allowClear
            onSearch={setSearchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%' }}
            value={searchTerm}
          />
        </Col>
        <Col>
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 180 }}
            onChange={setFilterStatus}
            value={filterStatus}
          >
            {Object.values(OrderStatus).map(status => (
              <Select.Option key={status} value={status}>{status}</Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        bordered
        scroll={{ x: true }}
      />

      <OrderForm />
    </div>
  );
};

export default OrderManagement;
