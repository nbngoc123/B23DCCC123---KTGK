// Kiểu dữ liệu cho các trường thông tin trong văn bằng
type FieldDataType = 'String' | 'Number' | 'Date';

// Interface cho cấu hình trường thông tin
interface FieldConfig {
  id: string;
  name: string;
  dataType: FieldDataType;
  required: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Interface cho sổ văn bằng
interface DiplomaBook {
  id: string;
  year: number; 
  currentNumber: number; 
  createdAt: Date;
  updatedAt?: Date;
  diplomaId: string[];
}

// Interface cho thông tin văn bằng
interface Diploma {
  id: string;
  entryNumber: number; // Số vào sổ
  diplomaNumber: string; // Số hiệu văn bằng
  studentId: string; // Mã sinh viên
  fullName: string; // Họ tên
  dateOfBirth: Date; // Ngày sinh
  graduationDecisionId: string; // ID quyết định tốt nghiệp
  diplomaBookId: string; // ID sổ văn bằng
  fieldValues: DiplomaFieldValue[]; // Các trường thông tin động
  createdAt: Date;
  updatedAt?: Date;
}


