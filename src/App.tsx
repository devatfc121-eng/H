import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  RotateCcw,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Pill,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Product, Doctor, CartItem, ActiveTab, Speciality, SpecialityItem, Order, OrderStatus, UpcomingProduct } from './types';
import { INITIAL_PRODUCTS, INITIAL_DOCTORS, PRODUCT_FORMS, SPECIALITIES, INITIAL_SPECIALITIES } from './data/initialProducts';
import { INITIAL_ORDERS } from './data/initialOrders';
import { INITIAL_UPCOMING_PRODUCTS } from './data/initialUpcomingProducts';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ServicesGrid } from './components/ServicesGrid';
import { ProductCard } from './components/ProductCard';
import { FilterModal } from './components/FilterModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AddProductModal } from './components/AddProductModal';
import { VisualAidMode } from './components/VisualAidMode';
import { ServicesModal } from './components/ServicesModal';
import { CartDrawer } from './components/CartDrawer';
import { BottomNav } from './components/BottomNav';
import { ApkInstallModal } from './components/ApkInstallModal';
import { RateListPrintModal } from './components/RateListPrintModal';
import { PdfImageUploadModal } from './components/PdfImageUploadModal';
import { ManageSpecialitiesModal } from './components/ManageSpecialitiesModal';
import { ManageProductFormsModal } from './components/ManageProductFormsModal';
import { GooglePortalModal } from './components/GooglePortalModal';
import { NewlyLaunchedSection } from './components/NewlyLaunchedSection';
import { UpcomingProductsSection } from './components/UpcomingProductsSection';
import { AddEditUpcomingModal } from './components/AddEditUpcomingModal';
import { OrdersSection } from './components/OrdersSection';
import { OrderDetailModal } from './components/OrderDetailModal';
import { CreateEditOrderModal } from './components/CreateEditOrderModal';
import { usePWAInstall, useOnlineStatus } from './hooks/usePWAInstall';
import { Smartphone, Download, Printer, WifiOff, Globe, RefreshCw, Send, Maximize2 } from 'lucide-react';

const STORAGE_KEY_PRODUCTS = 'pharma_app_products_v3';
const STORAGE_KEY_DOCTORS = 'pharma_app_doctors_v3';
const STORAGE_KEY_CART = 'pharma_app_cart_v2';
const STORAGE_KEY_SPECIALITIES = 'pharma_app_specialities_v3';
const STORAGE_KEY_PRODUCT_FORMS = 'pharma_app_product_forms_v1';
const STORAGE_KEY_ADMIN_WHATSAPP = 'pharma_app_admin_whatsapp_v1';
const STORAGE_KEY_ORDERS = 'pharma_app_orders_v2';
const STORAGE_KEY_UPCOMING = 'pharma_app_upcoming_v2';

export default function App() {
  // Load products from localStorage or use initial set
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS) || localStorage.getItem('pharma_app_products_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any newly introduced INITIAL_PRODUCTS by id so user gets the new speciality medicines
          const existingIds = new Set(parsed.map((p: Product) => p.id));
          const missingInitial = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
          if (missingInitial.length > 0) {
            return [...parsed, ...missingInitial];
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Dynamic Specialities list
  const [specialities, setSpecialities] = useState<SpecialityItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SPECIALITIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any newly introduced initial specialities
          const existingNames = new Set(parsed.map((s: SpecialityItem) => s.name.toLowerCase()));
          const missing = INITIAL_SPECIALITIES.filter(
            (s) => !existingNames.has(s.name.toLowerCase())
          );
          if (missing.length > 0) {
            return [...parsed, ...missing];
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_SPECIALITIES;
  });

  // Doctors directory
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DOCTORS) || localStorage.getItem('pharma_app_doctors_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((d: Doctor) => d.id));
          const missing = INITIAL_DOCTORS.filter((d) => !existingIds.has(d.id));
          return missing.length > 0 ? [...parsed, ...missing] : parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_DOCTORS;
  });

  // Cart / Doctor sample requests
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true); // Admin by default so Shivam can add/delete easily!
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<string>('All');
  const [selectedSpeciality, setSelectedSpeciality] = useState<Speciality>('All');

  // Modals
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isVisualAidOpen, setIsVisualAidOpen] = useState(false);
  const [visualAidInitialProductId, setVisualAidInitialProductId] = useState<string | undefined>();
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('Doctors');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isRateListModalOpen, setIsRateListModalOpen] = useState(false);
  const [isPdfImageModalOpen, setIsPdfImageModalOpen] = useState(false);
  const [pdfUploadTargetProductId, setPdfUploadTargetProductId] = useState<string | undefined>();
  const [preloadedNewProductImage, setPreloadedNewProductImage] = useState<string | undefined>();
  const [preloadedNewProductPdfPages, setPreloadedNewProductPdfPages] = useState<string[] | undefined>();
  const [isManageSpecialitiesOpen, setIsManageSpecialitiesOpen] = useState(false);
  const [isManageProductFormsOpen, setIsManageProductFormsOpen] = useState(false);
  const [isGooglePortalOpen, setIsGooglePortalOpen] = useState(false);

  // Dynamic Product Dosage Forms
  const [productForms, setProductForms] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCT_FORMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return PRODUCT_FORMS.filter((f) => f !== 'All');
  });

  // Admin WhatsApp Number for Direct Orders
  const [adminWhatsappNumber, setAdminWhatsappNumber] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_WHATSAPP);
      if (saved && saved.trim()) return saved;
    } catch {
      // ignore
    }
    return '+91 98765 43210';
  });

  // PWA install state, OTA online updates & offline detector
  const {
    isInstalled,
    isInstallable,
    hasUpdate,
    checkForUpdates,
    applyUpdate,
    versionInfo,
    directOpen,
    sendApkEmail,
    sendApkWhatsApp,
    appUrl,
  } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [apkModalInitialTab, setApkModalInitialTab] = useState<'phone' | 'playstore' | 'send_apk' | 'ota_updates' | 'apk_download'>('phone');

  // Undo Toast state for product deletion
  const [deletedProductUndo, setDeletedProductUndo] = useState<Product | null>(null);
  const [deletedOrderUndo, setDeletedOrderUndo] = useState<Order | null>(null);
  const [deletedUpcomingUndo, setDeletedUpcomingUndo] = useState<UpcomingProduct | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Orders Pipeline Management State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_ORDERS;
  });

  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState<Order | null>(null);
  const [isOrderDetailModalOpen, setIsOrderDetailModalOpen] = useState<boolean>(false);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [isCreateEditOrderOpen, setIsCreateEditOrderOpen] = useState<boolean>(false);

  // Upcoming Products Pipeline State
  const [upcomingProducts, setUpcomingProducts] = useState<UpcomingProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_UPCOMING);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_UPCOMING_PRODUCTS;
  });

  const [upcomingProductToEdit, setUpcomingProductToEdit] = useState<UpcomingProduct | null>(null);
  const [isAddEditUpcomingOpen, setIsAddEditUpcomingOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_UPCOMING, JSON.stringify(upcomingProducts));
    } catch {
      // ignore
    }
  }, [upcomingProducts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SPECIALITIES, JSON.stringify(specialities));
    } catch {
      // ignore
    }
  }, [specialities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCT_FORMS, JSON.stringify(productForms));
    } catch {
      // ignore
    }
  }, [productForms]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_WHATSAPP, adminWhatsappNumber);
    } catch {
      // ignore
    }
  }, [adminWhatsappNumber]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DOCTORS, JSON.stringify(doctors));
    } catch {
      // ignore
    }
  }, [doctors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const handleAddSpeciality = (newSpec: SpecialityItem) => {
    setSpecialities((prev) => [...prev, newSpec]);
    showToast(`"${newSpec.name}" speciality successfully added!`);
  };

  const handleUpdateSpeciality = (oldName: string, updatedSpec: SpecialityItem) => {
    setSpecialities((prev) =>
      prev.map((s) => (s.name.toLowerCase() === oldName.toLowerCase() ? updatedSpec : s))
    );

    // If name changed, update products and doctors mapped to this speciality
    if (oldName.toLowerCase() !== updatedSpec.name.toLowerCase()) {
      setProducts((prev) =>
        prev.map((p) => (p.speciality === oldName ? { ...p, speciality: updatedSpec.name } : p))
      );
      setDoctors((prev) =>
        prev.map((d) => (d.speciality === oldName ? { ...d, speciality: updatedSpec.name } : d))
      );
      if (selectedSpeciality === oldName) {
        setSelectedSpeciality(updatedSpec.name);
      }
    }
    showToast(`Speciality "${updatedSpec.name}" updated successfully!`);
  };

  const handleDeleteSpeciality = (specName: string) => {
    const fallback = specialities.find((s) => s.name !== specName)?.name || 'General Physician';
    setSpecialities((prev) => prev.filter((s) => s.name !== specName));

    // Reassign products to fallback so user doesn't lose products
    setProducts((prev) =>
      prev.map((p) => (p.speciality === specName ? { ...p, speciality: fallback } : p))
    );
    setDoctors((prev) =>
      prev.map((d) => (d.speciality === specName ? { ...d, speciality: fallback } : d))
    );
    if (selectedSpeciality === specName) {
      setSelectedSpeciality('All');
    }
    showToast(`Speciality "${specName}" deleted. Products moved to ${fallback}.`);
  };

  const handleResetSpecialities = () => {
    setSpecialities(INITIAL_SPECIALITIES);
    showToast('Specialities reset to standard pharma divisions list!');
  };

  const handleAddProductForm = (newForm: string) => {
    const trimmed = newForm.trim();
    if (!trimmed) return;
    if (productForms.some((f) => f.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`Dosage form "${trimmed}" already exists!`);
      return;
    }
    setProductForms((prev) => [...prev, trimmed]);
    showToast(`Dosage form "${trimmed}" successfully added!`);
  };

  const handleDeleteProductForm = (formName: string) => {
    const fallback = productForms.find((f) => f !== formName) || 'Tablet';
    setProductForms((prev) => prev.filter((f) => f !== formName));
    setProducts((prev) =>
      prev.map((p) => (p.form === formName ? { ...p, form: fallback } : p))
    );
    if (selectedForm === formName) {
      setSelectedForm('All');
    }
    showToast(`Form "${formName}" deleted. Medicines reassigned to ${fallback}.`);
  };

  const handleResetProductForms = () => {
    setProductForms(PRODUCT_FORMS.filter((f) => f !== 'All'));
    showToast('Dosage forms reset to standard pharma forms!');
  };

  const handleUpdateAdminWhatsapp = (newNumber: string) => {
    setAdminWhatsappNumber(newNumber);
    showToast(`Order WhatsApp number set to ${newNumber}!`);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    if (selectedProductForDetail && selectedProductForDetail.id === updatedProduct.id) {
      setSelectedProductForDetail(updatedProduct);
    }
    showToast(`"${updatedProduct.name}" visual aid & details updated!`);
  };

  const handleImportFullData = (data: {
    products?: Product[];
    specialities?: any[];
    productForms?: string[];
    doctors?: Doctor[];
    adminWhatsappNumber?: string;
  }) => {
    if (data.products && Array.isArray(data.products)) setProducts(data.products);
    if (data.doctors && Array.isArray(data.doctors)) setDoctors(data.doctors);
    if (data.productForms && Array.isArray(data.productForms)) setProductForms(data.productForms);
    if (data.adminWhatsappNumber) setAdminWhatsappNumber(data.adminWhatsappNumber);
    if (data.specialities && Array.isArray(data.specialities)) {
      const normalized = data.specialities.map((s: any) =>
        typeof s === 'string'
          ? { id: s.toLowerCase().replace(/\s+/g, '-'), name: s, description: `${s} range` }
          : s
      );
      setSpecialities(normalized);
    }
    showToast('Google Portal backup restored successfully!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleExportCatalog = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      representative: 'Shivam Baranwal',
      company: 'Biophar Lifesciences',
      products,
      doctors,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `biophar_catalog_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Catalog backup downloaded successfully!');
  };

  const handleImportCatalog = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.products && Array.isArray(json.products)) {
          setProducts(json.products);
        }
        if (json.doctors && Array.isArray(json.doctors)) {
          setDoctors(json.doctors);
        }
        showToast('Catalog & Doctors restored successfully!');
      } catch {
        showToast('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  // Add or Update product
  const handleSaveProduct = (newOrUpdatedProduct: Product) => {
    setProducts((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === newOrUpdatedProduct.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newOrUpdatedProduct;
        return copy;
      }
      return [newOrUpdatedProduct, ...prev];
    });
    setProductToEdit(null);
    showToast(`"${newOrUpdatedProduct.name}" added successfully to catalog!`);
  };

  // Delete product
  const handleDeleteProduct = (productId: string, productName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    setDeletedProductUndo(targetProduct);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`"${productName}" was deleted.`);
  };

  // Undo Delete
  const handleUndoDelete = () => {
    if (deletedProductUndo) {
      setProducts((prev) => [deletedProductUndo, ...prev]);
      showToast(`Restored "${deletedProductUndo.name}"`);
      setDeletedProductUndo(null);
    }
  };

  // Edit product
  const handleEditProduct = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProductToEdit(product);
    setIsAddModalOpen(true);
  };

  // Reset to default seed products
  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog back to initial default medicines?')) {
      setProducts(INITIAL_PRODUCTS);
      showToast('Catalog reset to initial products');
    }
  };

  // Add doctor
  const handleAddDoctor = (doc: Doctor) => {
    setDoctors((prev) => [doc, ...prev]);
    showToast(`${doc.name} added to Doctor directory!`);
  };

  // Doctor visit detailing
  const handleSelectDoctorForVisit = (doc: Doctor) => {
    setSelectedSpeciality(doc.speciality);
    showToast(`Showing medicines suited for ${doc.name} (${doc.speciality})`);
  };

  // Cart operations
  const handleAddToCart = (
    product: Product,
    quantity: number = 1,
    type: 'Order' | 'Sample Request' = 'Order',
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.type === type);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.type === type
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, type }];
    });
    showToast(`Added ${product.name} to ${type === 'Sample Request' ? 'Sample Requests' : 'Cart'}!`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Orders Pipeline Management Handlers
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated: Order = {
            ...ord,
            status: newStatus,
            dispatchDate:
              (newStatus === 'Dispatched' || newStatus === 'Delivered') && !ord.dispatchDate
                ? new Date().toISOString()
                : ord.dispatchDate,
            deliveryDate:
              newStatus === 'Delivered' && !ord.deliveryDate
                ? new Date().toISOString()
                : ord.deliveryDate,
          };
          if (selectedOrderForDetail && selectedOrderForDetail.id === orderId) {
            setSelectedOrderForDetail(updated);
          }
          return updated;
        }
        return ord;
      })
    );
    showToast(`Order status moved to "${newStatus}"!`);
  };

  const handleSaveOrder = (savedOrder: Order) => {
    setOrders((prev) => {
      const idx = prev.findIndex((o) => o.id === savedOrder.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = savedOrder;
        return copy;
      }
      return [savedOrder, ...prev];
    });
    setOrderToEdit(null);
    if (selectedOrderForDetail && selectedOrderForDetail.id === savedOrder.id) {
      setSelectedOrderForDetail(savedOrder);
    }
    showToast(`Order #${savedOrder.orderNumber} saved successfully!`);
  };

  const handleDeleteOrder = (orderId: string, orderNumber: string) => {
    const target = orders.find((o) => o.id === orderId);
    if (!target) return;
    setDeletedOrderUndo(target);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (selectedOrderForDetail?.id === orderId) {
      setSelectedOrderForDetail(null);
      setIsOrderDetailModalOpen(false);
    }
    showToast(`Order ${orderNumber} was deleted.`);
  };

  const handleUndoDeleteOrder = () => {
    if (deletedOrderUndo) {
      setOrders((prev) => [deletedOrderUndo, ...prev]);
      showToast(`Restored order ${deletedOrderUndo.orderNumber}`);
      setDeletedOrderUndo(null);
    }
  };

  // Upcoming Products Handlers
  const handleSaveUpcomingProduct = (product: UpcomingProduct) => {
    setUpcomingProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = product;
        return copy;
      }
      return [product, ...prev];
    });
    setUpcomingProductToEdit(null);
    showToast(`"${product.name}" saved in Upcoming pipeline!`);
  };

  const handleDeleteUpcomingProduct = (productId: string, name: string) => {
    const target = upcomingProducts.find((p) => p.id === productId);
    if (!target) return;
    setDeletedUpcomingUndo(target);
    setUpcomingProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`"${name}" removed from upcoming pipeline.`);
  };

  const handleUndoDeleteUpcoming = () => {
    if (deletedUpcomingUndo) {
      setUpcomingProducts((prev) => [deletedUpcomingUndo, ...prev]);
      showToast(`Restored upcoming product "${deletedUpcomingUndo.name}"`);
      setDeletedUpcomingUndo(null);
    }
  };

  const handleRecordDoctorInterest = (product: UpcomingProduct) => {
    showToast(`Pre-booking interest recorded for "${product.name}"!`);
  };

  // Filtering products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search term matching name, composition, brand, or description
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesComp = p.composition.toLowerCase().includes(q);
        const matchesBrand = (p.brand || '').toLowerCase().includes(q);
        const matchesSpeciality = (p.speciality || '').toLowerCase().includes(q);
        const matchesDesc = (p.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesComp && !matchesBrand && !matchesSpeciality && !matchesDesc) {
          return false;
        }
      }

      // Form filter
      if (selectedForm !== 'All' && p.form !== selectedForm) {
        return false;
      }

      // Speciality filter
      if (selectedSpeciality !== 'All' && p.speciality !== selectedSpeciality) {
        return false;
      }

      return true;
    });
  }, [products, searchTerm, selectedForm, selectedSpeciality]);

  const activeFilterCount = (selectedForm !== 'All' ? 1 : 0) + (selectedSpeciality !== 'All' ? 1 : 0);

  const handleOpenVisualAidForProduct = (product: Product) => {
    setVisualAidInitialProductId(product.id);
    setIsVisualAidOpen(true);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 pb-20 selection:bg-sky-200">
      {/* Top Header matching user's screenshot */}
      <Header
        isAdminMode={isAdminMode}
        onToggleAdminMode={() => {
          setIsAdminMode(!isAdminMode);
          showToast(isAdminMode ? 'Switched to Doctor Presentation Mode' : 'Switched to Admin Manager Mode (Add/Delete enabled)');
        }}
        onOpenAddModal={() => {
          setProductToEdit(null);
          setIsAddModalOpen(true);
        }}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setActiveTab('orders')}
        onOpenServices={(service) => {
          setSelectedServiceType(service || 'Doctors');
          setIsServicesModalOpen(true);
        }}
        onOpenApkModal={() => {
          setApkModalInitialTab(hasUpdate ? 'ota_updates' : 'phone');
          setIsApkModalOpen(true);
        }}
        onOpenRateListModal={() => setIsRateListModalOpen(true)}
        onOpenPdfImageModal={() => {
          setPdfUploadTargetProductId(undefined);
          setIsPdfImageModalOpen(true);
        }}
        onOpenGooglePortal={() => setIsGooglePortalOpen(true)}
        productCount={products.length}
        isOnline={isOnline}
        hasUpdate={hasUpdate}
        onDirectOpen={directOpen}
        onOpenPlayStore={() => {
          setApkModalInitialTab('playstore');
          setIsApkModalOpen(true);
        }}
      />

      {/* Sticky Search Bar matching screenshot */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenFilter={() => setIsFilterModalOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto">
        {/* If user selected Home Tab */}
        {activeTab === 'home' && (
          <>
            {/* Services Grid matching screenshot 3 */}
            <ServicesGrid
              onSelectService={(service) => {
                setSelectedServiceType(service);
                setIsServicesModalOpen(true);
              }}
              onOpenDoctors={() => {
                setSelectedServiceType('Doctors');
                setIsServicesModalOpen(true);
              }}
            />

            {/* Newly Launched Products Section on Home Screen */}
            <NewlyLaunchedSection
              products={products}
              onSelectProduct={(p) => setSelectedProductForDetail(p)}
              onAddToCart={(p, e) => handleAddToCart(p, 1, 'Order', e)}
              onEditProduct={(p) => handleEditProduct(p)}
              onDeleteProduct={(id, name) => handleDeleteProduct(id, name)}
              onAddNewProduct={() => {
                setProductToEdit(null);
                setIsAddModalOpen(true);
              }}
              isAdminMode={isAdminMode}
            />

            {/* Upcoming Products Pipeline Section on Home Screen */}
            <UpcomingProductsSection
              upcomingProducts={upcomingProducts}
              onAddUpcoming={() => {
                setUpcomingProductToEdit(null);
                setIsAddEditUpcomingOpen(true);
              }}
              onEditUpcoming={(item) => {
                setUpcomingProductToEdit(item);
                setIsAddEditUpcomingOpen(true);
              }}
              onDeleteUpcoming={(id, name) => handleDeleteUpcomingProduct(id, name)}
              onRecordDoctorInterest={(item) => handleRecordDoctorInterest(item)}
            />

            {/* OTA Online Update Available Alert Banner */}
            {hasUpdate && (
              <div className="mx-4 sm:mx-6 mb-3 p-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl text-white shadow-lg flex items-center justify-between gap-3 border border-amber-300/40 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center shrink-0 animate-pulse">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-black tracking-tight truncate">
                      Biophar APK Update Available (v{versionInfo.version})
                    </h4>
                    <p className="text-[11px] text-amber-100 font-medium truncate">
                      Naye products & online OTA updates ready hain. Ek tap me install karein.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setApkModalInitialTab('ota_updates');
                      setIsApkModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-black/25 hover:bg-black/35 text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={applyUpdate}
                    className="px-3 py-1.5 bg-white text-slate-950 hover:bg-amber-50 active:scale-95 font-black text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Update Now</span>
                  </button>
                </div>
              </div>
            )}

            {/* Mobile APK Installation & OTA Status Banner */}
            <div className="mx-4 sm:mx-6 mb-3 p-3.5 bg-gradient-to-r from-sky-600 via-sky-700 to-blue-700 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-sky-200" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-extrabold tracking-tight truncate">
                      {isInstalled ? 'Biophar Android App Active' : 'Biophar Mobile App / APK Install'}
                    </h4>
                    <span className="text-[9px] font-mono bg-sky-500/50 px-1.5 py-0.5 rounded-full border border-sky-300/30">
                      v{versionInfo.version}
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-100 font-medium truncate">
                    {isInstalled
                      ? 'Automatic online OTA updates enabled for all pharma detailing.'
                      : 'Doctor clinic me 100% offline visual aid detailing ke liye phone me install karein.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 flex-wrap sm:flex-nowrap justify-end">
                {/* Direct Open Standalone Button */}
                <button
                  id="home-direct-open-btn"
                  onClick={directOpen}
                  className="px-2.5 py-2 bg-sky-900/70 hover:bg-sky-900 text-sky-100 active:scale-95 font-bold text-xs rounded-xl border border-sky-400/30 shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Direct Open Standalone App"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-sky-300" />
                  <span>Direct Open</span>
                </button>

                {/* Send Me APK Button */}
                <button
                  id="home-send-apk-btn"
                  onClick={() => {
                    setApkModalInitialTab('send_apk');
                    setIsApkModalOpen(true);
                  }}
                  className="px-2.5 py-2 bg-sky-800/80 hover:bg-sky-800 text-sky-100 active:scale-95 font-bold text-xs rounded-xl border border-sky-400/30 shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                  title="Send APK to shivambaranwal121@gmail.com or WhatsApp"
                >
                  <Send className="w-3.5 h-3.5 text-sky-300" />
                  <span>Send APK</span>
                </button>

                {/* Google Play Store Hub Button */}
                <button
                  id="home-playstore-btn"
                  onClick={() => {
                    setApkModalInitialTab('playstore');
                    setIsApkModalOpen(true);
                  }}
                  className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95 font-black text-xs rounded-xl border border-emerald-400/50 shadow-xs shrink-0 flex items-center gap-1 cursor-pointer transition-all"
                  title="Google Play Store Hub & AAB Package"
                >
                  <span className="text-emerald-200 font-black text-xs">▶</span>
                  <span>Play Store</span>
                </button>

                {/* 1-Click Install Button */}
                <button
                  id="home-install-apk-btn"
                  onClick={() => {
                    setApkModalInitialTab(isInstalled ? 'ota_updates' : 'phone');
                    setIsApkModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-white text-sky-900 hover:bg-sky-50 active:scale-95 font-black text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer transition-transform"
                >
                  <Download className="w-3.5 h-3.5 text-sky-600" />
                  <span>{isInstalled ? 'OTA Setup' : 'Install APK'}</span>
                </button>
              </div>
            </div>

            {/* Admin Quick Banner when Admin Mode is on */}
            {isAdminMode && (
              <div className="mx-4 sm:mx-6 mb-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2 text-xs text-amber-900 font-medium">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Admin Mode Active:</strong> Aap naye products add kar sakte ho aur purane delete ya edit kar sakte ho.
                  </span>
                </div>
                <button
                  id="admin-add-quick-btn"
                  onClick={() => {
                    setProductToEdit(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold rounded-xl text-xs flex items-center gap-1 shadow-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Add Product</span>
                </button>
              </div>
            )}

            {/* Quick Product Form Chips Row */}
            <div className="px-4 sm:px-6 py-2 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
              {['All', ...productForms].map((form) => (
                <button
                  key={form}
                  onClick={() => setSelectedForm(form)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedForm === form
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {form}
                </button>
              ))}

              {/* Manage Forms Button */}
              <button
                onClick={() => setIsManageProductFormsOpen(true)}
                className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 flex items-center gap-1 transition-colors"
                title="Add or Delete Medicine Dosage Forms"
              >
                <Plus className="w-3 h-3" />
                <span>Manage Forms</span>
              </button>
            </div>

            {/* Products Section Header matching Screenshot 1 & 3 */}
            <div className="px-4 sm:px-6 pt-3 pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase font-['Cabinet_Grotesk',sans-serif]">
                  PRODUCTS
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Showing {filteredProducts.length} medicines
                  {selectedForm !== 'All' ? ` • ${selectedForm}` : ''}
                  {selectedSpeciality !== 'All' ? ` • ${selectedSpeciality}` : ''}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Visual Aid Presentation Launch */}
                <button
                  id="home-open-visual-aid-btn"
                  onClick={() => {
                    setVisualAidInitialProductId(filteredProducts?.[0]?.id);
                    setIsVisualAidOpen(true);
                  }}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-sky-200 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>Doctor Detailing Slide</span>
                </button>

                {/* Reset filters if applied */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedForm('All');
                      setSelectedSpeciality('All');
                      setSearchTerm('');
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* If user selected Products Tab */}
        {activeTab === 'products' && (
          <div className="px-4 sm:px-6 pt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase">
                  Complete Product Catalog
                </h2>
                <p className="text-xs text-slate-500">
                  All authorized medicines ready for doctor presentation & order booking
                </p>
              </div>

              <button
                onClick={() => {
                  setProductToEdit(null);
                  setIsAddModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>+ Add Product</span>
              </button>
            </div>

            {/* Filter chips */}
            <div className="overflow-x-auto flex items-center gap-1.5 pb-2 mb-2">
              {PRODUCT_FORMS.slice(0, 10).map((form) => (
                <button
                  key={form}
                  onClick={() => setSelectedForm(form)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    selectedForm === form
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {form}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* If user selected Speciality Tab */}
        {activeTab === 'speciality' && (
          <div className="px-4 sm:px-6 pt-4 pb-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 rounded-2xl p-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-sky-700 block">
                  THERAPEUTIC DIVISIONS & DOCTOR PORTFOLIOS
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Medical Specialities Range
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tailored portfolios for Dental, ENT, Gynecologist, Paediatric, Ortho, Diabetes, Antibiotics & more ({specialities.length} divisions)
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {selectedSpeciality !== 'All' && (
                  <button
                    onClick={() => setSelectedSpeciality('All')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Clear Filter ({selectedSpeciality})</span>
                  </button>
                )}

                <button
                  id="btn-manage-specialities"
                  onClick={() => setIsManageSpecialitiesOpen(true)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>+ Manage Specialities</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {specialities.map((spec) => {
                const count = products.filter((p) => p.speciality === spec.name).length;
                const isSelected = selectedSpeciality === spec.name;
                return (
                  <div
                    key={spec.id || spec.name}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-500 ring-offset-2'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300 hover:shadow-xs'
                    }`}
                    onClick={() => {
                      setSelectedSpeciality(isSelected ? 'All' : spec.name);
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: spec.color || '#0284c7' }}
                        />
                        <span className="text-sm font-black tracking-tight">{spec.name}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {count} {count === 1 ? 'Product' : 'Products'}
                      </span>
                    </div>

                    {spec.description && (
                      <p
                        className={`text-xs line-clamp-2 mt-1 leading-relaxed ${
                          isSelected ? 'text-sky-100' : 'text-slate-500'
                        }`}
                      >
                        {spec.description}
                      </p>
                    )}

                    <div className="mt-3 pt-2.5 border-t border-slate-100/30 flex items-center justify-between text-[11px] font-bold">
                      <span className={isSelected ? 'text-white' : 'text-sky-600'}>
                        {isSelected ? '✓ Currently Showing' : 'Click to filter products →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* If user selected Orders Tab */}
        {activeTab === 'orders' && (
          <OrdersSection
            orders={orders}
            onStatusChange={handleStatusChange}
            onSelectOrder={(ord) => {
              setSelectedOrderForDetail(ord);
              setIsOrderDetailModalOpen(true);
            }}
            onEditOrder={(ord) => {
              setOrderToEdit(ord);
              setIsCreateEditOrderOpen(true);
            }}
            onDeleteOrder={handleDeleteOrder}
            onCreateNewOrder={() => {
              setOrderToEdit(null);
              setIsCreateEditOrderOpen(true);
            }}
            onOpenCart={() => setIsCartOpen(true)}
            cartCount={totalCartCount}
            adminWhatsappNumber={adminWhatsappNumber}
          />
        )}

        {/* Product Cards Grid matching Screenshot 1 & 3 (only when not in Orders tab) */}
        {activeTab !== 'orders' && (
          <div className="px-4 sm:px-6 pt-2 pb-6">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 my-4">
                <Pill className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                  No medicines matched your current search or filter criteria. You can add a new product or clear filters.
                </p>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedForm('All');
                      setSelectedSpeciality('All');
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Clear Search & Filters
                  </button>
                  <button
                    onClick={() => {
                      setProductToEdit(null);
                      setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs"
                  >
                    + Add This Medicine Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProductForDetail(p)}
                    onAddToCart={(p, e) => handleAddToCart(p, 1, 'Order', e)}
                    onDeleteProduct={(id, name, e) => handleDeleteProduct(id, name, e)}
                    onEditProduct={(p, e) => handleEditProduct(p, e)}
                    isAdminMode={isAdminMode}
                  />
                ))}
              </div>
            )}

            {/* Reset catalog button in footer */}
            <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span>BIOPHAR Lifesciences Pvt. Ltd. • Doctor Detailing Aid</span>
              <button
                onClick={handleResetCatalog}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Default Products</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (+ Add Product) */}
      <div className="fixed bottom-18 right-4 sm:right-6 z-40">
        <button
          id="floating-add-product-btn"
          onClick={() => {
            setProductToEdit(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 active:scale-95 text-white font-black px-4 py-3 rounded-full shadow-xl shadow-sky-500/30 transition-all border border-white/20"
          title="Add New Medicine Product"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span className="text-xs sm:text-sm tracking-wide">+ Add Product</span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'visual_aids') {
            setVisualAidInitialProductId(filteredProducts?.[0]?.id);
            setIsVisualAidOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        cartCount={totalCartCount}
      />

      {/* Filter Bottom Sheet / Modal (Screenshot 2) */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedForm={selectedForm}
        onSelectForm={(form) => setSelectedForm(form)}
        selectedSpeciality={selectedSpeciality}
        onSelectSpeciality={(spec) => setSelectedSpeciality(spec)}
        onReset={() => {
          setSelectedForm('All');
          setSelectedSpeciality('All');
        }}
        totalFilteredCount={filteredProducts.length}
        availableSpecialities={specialities.map((s) => s.name)}
        onOpenManageSpecialities={() => setIsManageSpecialitiesOpen(true)}
        availableForms={productForms}
        onOpenManageForms={() => {
          setIsFilterModalOpen(false);
          setIsManageProductFormsOpen(true);
        }}
      />

      {/* Product Detail Modal (Screenshot 4) */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={!!selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={(p, qty, type) => handleAddToCart(p, qty, type)}
        onDeleteProduct={(id, name) => handleDeleteProduct(id, name)}
        onEditProduct={(p) => handleEditProduct(p)}
        onOpenVisualAid={(p) => handleOpenVisualAidForProduct(p)}
        onOpenUploadModal={(p) => {
          setPdfUploadTargetProductId(p.id);
          setIsPdfImageModalOpen(true);
        }}
        onUpdateProduct={handleUpdateProduct}
        isAdminMode={isAdminMode}
      />

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setProductToEdit(null);
          setPreloadedNewProductImage(undefined);
          setPreloadedNewProductPdfPages(undefined);
        }}
        onSaveProduct={handleSaveProduct}
        productToEdit={productToEdit}
        initialImage={preloadedNewProductImage}
        initialPdfPages={preloadedNewProductPdfPages}
        availableSpecialities={specialities.map((s) => s.name)}
        onOpenManageSpecialities={() => setIsManageSpecialitiesOpen(true)}
        availableForms={productForms}
        onOpenManageForms={() => setIsManageProductFormsOpen(true)}
      />

      {/* Manage Specialities Modal (Add, Edit, Delete, Reassign) */}
      <ManageSpecialitiesModal
        isOpen={isManageSpecialitiesOpen}
        onClose={() => setIsManageSpecialitiesOpen(false)}
        specialities={specialities}
        onAddSpeciality={handleAddSpeciality}
        onUpdateSpeciality={handleUpdateSpeciality}
        onDeleteSpeciality={handleDeleteSpeciality}
        onResetSpecialities={handleResetSpecialities}
        products={products}
      />

      {/* Manage Product Dosage Forms Modal (Add, Delete, Reset) */}
      <ManageProductFormsModal
        isOpen={isManageProductFormsOpen}
        onClose={() => setIsManageProductFormsOpen(false)}
        forms={productForms}
        onAddForm={handleAddProductForm}
        onDeleteForm={handleDeleteProductForm}
        onResetForms={handleResetProductForms}
        products={products}
      />

      {/* Visual Aid Presentation Detailing Slide Show */}
      <VisualAidMode
        products={filteredProducts.length > 0 ? filteredProducts : products}
        initialProductId={visualAidInitialProductId}
        isOpen={isVisualAidOpen}
        onClose={() => setIsVisualAidOpen(false)}
        onOpenUploadModal={(p) => {
          setPdfUploadTargetProductId(p.id);
          setIsPdfImageModalOpen(true);
        }}
        onRequestSample={(product) => {
          handleAddToCart(product, 1, 'Sample Request');
          showToast(`Complimentary sample for ${product.name} recorded for Doctor!`);
        }}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* PDF Brochure & Multi-Image Upload Hub */}
      <PdfImageUploadModal
        isOpen={isPdfImageModalOpen}
        onClose={() => {
          setIsPdfImageModalOpen(false);
          setPdfUploadTargetProductId(undefined);
        }}
        products={products}
        initialProductId={pdfUploadTargetProductId}
        onUpdateProduct={(updatedProduct) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
          );
          if (selectedProductForDetail && selectedProductForDetail.id === updatedProduct.id) {
            setSelectedProductForDetail(updatedProduct);
          }
          showToast(`"${updatedProduct.name}" visuals & PDF slides updated!`);
        }}
        onCreateProductFromImage={(coverImage, pdfPages) => {
          setProductToEdit(null);
          setPreloadedNewProductImage(coverImage);
          setPreloadedNewProductPdfPages(pdfPages);
          setIsAddModalOpen(true);
          showToast('New product initialized with uploaded brochure! Enter product name & price.');
        }}
      />

      {/* Services & Doctors Directory Modal */}
      <ServicesModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
        serviceType={selectedServiceType}
        doctors={doctors}
        onAddDoctor={handleAddDoctor}
        onSelectDoctorForVisit={handleSelectDoctorForVisit}
        onOpenApkInstall={() => setIsApkModalOpen(true)}
        onOpenRateList={() => setIsRateListModalOpen(true)}
        products={products}
        onExportCatalog={handleExportCatalog}
        onImportCatalog={handleImportCatalog}
        specialities={specialities}
        onOpenManageSpecialities={() => {
          setIsServicesModalOpen(false);
          setIsManageSpecialitiesOpen(true);
        }}
        onOpenManageForms={() => {
          setIsServicesModalOpen(false);
          setIsManageProductFormsOpen(true);
        }}
        onOpenGooglePortal={() => {
          setIsServicesModalOpen(false);
          setIsGooglePortalOpen(true);
        }}
      />

      {/* Google Portal & Cloud Sync Modal */}
      <GooglePortalModal
        isOpen={isGooglePortalOpen}
        onClose={() => setIsGooglePortalOpen(false)}
        products={products}
        specialities={specialities.map((s) => s.name)}
        productForms={productForms}
        doctors={doctors}
        adminWhatsappNumber={adminWhatsappNumber}
        onImportFullData={handleImportFullData}
      />

      {/* APK / Mobile Install & OTA Updates Modal */}
      <ApkInstallModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
        initialTab={apkModalInitialTab}
      />

      {/* Doctor & Chemist Rate List Print / Export Modal */}
      <RateListPrintModal
        isOpen={isRateListModalOpen}
        onClose={() => setIsRateListModalOpen(false)}
        products={products}
      />

      {/* Cart & Sample Request Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        doctors={doctors}
        adminWhatsappNumber={adminWhatsappNumber}
        onUpdateAdminWhatsapp={handleUpdateAdminWhatsapp}
        onSaveOrderToPipeline={(newOrder) => {
          handleSaveOrder(newOrder);
        }}
        onViewOrdersPipeline={() => {
          setIsCartOpen(false);
          setActiveTab('orders');
        }}
      />

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrderForDetail}
        isOpen={isOrderDetailModalOpen}
        onClose={() => {
          setIsOrderDetailModalOpen(false);
          setSelectedOrderForDetail(null);
        }}
        onStatusChange={handleStatusChange}
        onEditOrder={(ord) => {
          setIsOrderDetailModalOpen(false);
          setOrderToEdit(ord);
          setIsCreateEditOrderOpen(true);
        }}
        onDeleteOrder={(id, orderNumber) => handleDeleteOrder(id, orderNumber)}
        adminWhatsappNumber={adminWhatsappNumber}
      />

      {/* Create / Edit Order Modal */}
      <CreateEditOrderModal
        isOpen={isCreateEditOrderOpen}
        onClose={() => {
          setIsCreateEditOrderOpen(false);
          setOrderToEdit(null);
        }}
        orderToEdit={orderToEdit}
        onSaveOrder={handleSaveOrder}
        products={products}
        doctors={doctors}
      />

      {/* Add / Edit Upcoming Product Modal */}
      <AddEditUpcomingModal
        isOpen={isAddEditUpcomingOpen}
        onClose={() => {
          setIsAddEditUpcomingOpen(false);
          setUpcomingProductToEdit(null);
        }}
        productToEdit={upcomingProductToEdit}
        onSaveProduct={handleSaveUpcomingProduct}
        specialities={specialities.map((s) => s.name)}
        productForms={productForms}
      />

      {/* Toast Notification with Undo */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom duration-200 max-w-sm w-full mx-4 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 truncate">{toastMessage}</span>
          {deletedProductUndo && toastMessage.includes('deleted') && (
            <button
              onClick={handleUndoDelete}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider shrink-0"
            >
              Undo
            </button>
          )}
          {deletedOrderUndo && toastMessage.includes('deleted') && (
            <button
              onClick={handleUndoDeleteOrder}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider shrink-0"
            >
              Undo
            </button>
          )}
          {deletedUpcomingUndo && toastMessage.includes('removed') && (
            <button
              onClick={handleUndoDeleteUpcoming}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[11px] font-black uppercase tracking-wider shrink-0"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
