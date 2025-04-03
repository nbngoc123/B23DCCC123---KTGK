/** Enum định nghĩa các trạng thái đơn hàng */
export enum OrderStatus {
PENDING = 'Chờ xác nhận', 
SHIPPING = 'Đang giao',
COMPLETED = 'Hoàn thành',
CANCELLED = 'Hủy'
}

/** Thông tin Khách hàng */
export interface Customer {
id: string;   // Mã khách hàng
name: string; // Tên khách hàng
}

/** Thông tin Sản phẩm */
export interface Product {
id: string;   // Mã sản phẩm
name: string; // Tên sản phẩm
price: number;// Giá sản phẩm
}

/** Chi tiết một mục trong đơn hàng */
export interface OrderItem {
product: Product; // Sản phẩm
quantity: number; // Số lượng
}

/** Thông tin Đơn hàng */
export interface Order {
id: string;           // Mã đơn hàng (duy nhất)
customer: Customer;   // Khách hàng
orderDate: Date;      // Ngày đặt
items: OrderItem[];   // Danh sách sản phẩm trong đơn
totalAmount: number;  // Tổng tiền
status: OrderStatus;  // Trạng thái (sử dụng enum OrderStatus)
}