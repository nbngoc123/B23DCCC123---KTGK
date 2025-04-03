import { Customer, Order, OrderItem, OrderStatus, Product } from '@/services/QuanLyDonHang/typing';
import React, { useEffect, useState } from 'react';

const MOCK_CUSTOMERS: Customer[] = [
  { id: 'KH001', name: 'Nguyễn Văn An' },
  { id: 'KH002', name: 'Trần Thị Bích' },
  { id: 'KH003', name: 'Lê Văn Long' },
];

const MOCK_PRODUCTS: Product[] = [
  { id: 'SP001', name: 'Laptop UltraBook Model X', price: 21500000 },
  { id: 'SP002', name: 'Chuột không dây Logitech', price: 450000 },
  { id: 'SP003', name: 'Bàn phím cơ RGB', price: 1200000 },
  { id: 'SP004', name: 'Màn hình LCD 27 inch', price: 5500000 },
  { id: 'SP005', name: 'Ổ cứng SSD 1TB', price: 1800000 },
];

const LOCAL_STORAGE_KEY = 'orderData';

export default () => {
  // State quản lý dữ liệu đơn hàng
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  // State cho Modal và Form
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Order | undefined>(undefined);

  // State cho tìm kiếm và lọc
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | undefined>(undefined);

  // Hàm lấy dữ liệu từ localStorage
  const getDataOrders = () => {
    try {
      const dataLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsedData: Order[] = dataLocal ? JSON.parse(dataLocal) : [];
      const formattedData = parsedData.map(order => ({
        ...order,
        orderDate: new Date(order.orderDate),
        totalAmount: Number(order.totalAmount),
        items: order.items.map(item => ({
          ...item,
          product: {
            ...item.product,
            price: Number(item.product.price)
          },
          quantity: Number(item.quantity)
        }))
      }));
      setOrders(formattedData);
    } catch (error) {
      console.error("Failed to load orders from localStorage:", error);
      setOrders([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Hàm lưu dữ liệu vào localStorage
  const saveDataOrders = (dataToSave: Order[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
      setOrders(dataToSave);
    } catch (error) {
      console.error("Failed to save orders to localStorage:", error);
    }
  };

  useEffect(() => {
    getDataOrders();
  }, []);

  // Lọc và tìm kiếm dữ liệu
  useEffect(() => {
    let result = orders;

    if (filterStatus) {
      result = result.filter(order => order.status === filterStatus);
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toLowerCase().includes(lowerCaseSearchTerm) ||
        order.customer.name.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, filterStatus]);

  // --- Các hàm xử lý sự kiện ---
  const handleAddNew = () => {
    setIsEdit(false);
    setCurrentRow(undefined);
    setVisible(true);
  };

  const handleEdit = (record: Order) => {
    setIsEdit(true);
    setCurrentRow(record);
    setVisible(true);
  };

  const handleCancelOrder = (record: Order) => {
    if (record.status !== OrderStatus.PENDING) {
      return { success: false, message: 'Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"!' };
    }

    const updatedOrders = orders.map(order =>
      order.id === record.id ? { ...order, status: OrderStatus.CANCELLED } : order
    );
    saveDataOrders(updatedOrders);
    return { success: true, message: `Đã hủy đơn hàng ${record.id}` };
  };

  const handleModalClose = () => {
    setVisible(false);
  };

  const handleFormSubmit = (values: Omit<Order, 'id' | 'totalAmount'>, itemsData: OrderItem[]) => {
    try {
      const totalAmount = itemsData.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      if (isEdit && currentRow) {
        const updatedOrder: Order = {
          ...currentRow,
          customer: values.customer,
          orderDate: values.orderDate,
          status: values.status,
          items: itemsData,
          totalAmount: totalAmount,
        };
        const updatedOrders = orders.map(order =>
          order.id === currentRow.id ? updatedOrder : order
        );
        saveDataOrders(updatedOrders);
        return { success: true, message: `Đã cập nhật đơn hàng ${currentRow.id}` };
      } else {
        const newOrder: Order = {
          id: `DH-${Date.now()}`,
          customer: values.customer,
          orderDate: values.orderDate,
          status: values.status,
          items: itemsData,
          totalAmount: totalAmount,
        };
        saveDataOrders([newOrder, ...orders]);
        return { success: true, message: `Đã thêm đơn hàng ${newOrder.id}` };
      }
    } catch (error) {
      console.error("Error submitting order form:", error);
      return { success: false, message: "Có lỗi xảy ra khi lưu đơn hàng!" };
    }
  };

  return {
    orders,
    filteredOrders,
    visible,
    isEdit,
    currentRow,
    searchTerm,
    filterStatus,
    MOCK_CUSTOMERS,
    MOCK_PRODUCTS,
    setSearchTerm,
    setFilterStatus,
    handleAddNew,
    handleEdit,
    handleCancelOrder,
    handleModalClose,
    handleFormSubmit,
    getDataOrders
  };
};
