export type ProductForm = string;

export type Speciality = string;

export interface SpecialityItem {
  id: string;
  name: string;
  description?: string;
  color: string;
  iconName?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  composition: string;
  form: ProductForm;
  packaging: string;
  packSize: string;
  mrp: number;
  ptr?: number; // Price to Retailer
  gst: number;
  description: string;
  indications: string[];
  keyBenefits: string[];
  dosageGuide?: string;
  speciality: Speciality;
  image?: string;
  images?: string[];
  pdfVisualAidPages?: string[];
  badgeColor?: string;
  isNew?: boolean;
  isFastMoving?: boolean;
  createdAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  speciality: Speciality;
  clinic: string;
  city: string;
  phone: string;
  preferredTiming: string;
  visitedStatus: 'Visited' | 'Pending' | 'Follow-up';
}

export interface CartItem {
  product: Product;
  quantity: number;
  type: 'Order' | 'Sample Request';
}

export type OrderStatus = 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';

export type OrderSortOption = 'date-desc' | 'date-asc' | 'status' | 'amount-desc' | 'amount-asc' | 'customer-asc';

export interface OrderItem {
  productId: string;
  productName: string;
  packSize: string;
  packaging: string;
  form: string;
  price: number;
  quantity: number;
  type: 'Order' | 'Sample Request';
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string; // ISO date string
  customerName: string;
  customerClinic: string;
  customerPhone: string;
  doctorName?: string;
  doctorSpeciality?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
  dispatchDate?: string;
  deliveryDate?: string;
  trackingNumber?: string;
  transportCarrier?: string;
}

export interface UpcomingProduct {
  id: string;
  name: string;
  composition: string;
  form: ProductForm;
  packaging: string;
  expectedLaunch: string; // e.g., "November 2026"
  targetSpeciality: Speciality;
  stage: 'DCGI Approval' | 'Stability Testing' | 'Pre-Launch Batch' | 'Packaging & Design' | 'Coming Soon';
  highlights: string[];
  approxMrp?: number;
  notes?: string;
  badgeColor?: string;
}

export type ActiveTab = 'home' | 'products' | 'visual_aids' | 'speciality' | 'orders';
