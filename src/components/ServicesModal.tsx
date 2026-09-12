import React, { useState } from 'react';
import {
  X,
  BriefcaseMedical,
  Users,
  BellRing,
  Award,
  CreditCard,
  FileCheck2,
  Phone,
  Clock,
  MapPin,
  Plus,
  Share2,
  CheckCircle2,
  Download,
  Calendar,
} from 'lucide-react';
import { Doctor, Speciality, Product, SpecialityItem } from '../types';

interface ServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  doctors: Doctor[];
  onAddDoctor: (doc: Doctor) => void;
  onSelectDoctorForVisit: (doc: Doctor) => void;
  onOpenApkInstall?: () => void;
  onOpenRateList?: () => void;
  products?: Product[];
  onExportCatalog?: () => void;
  onImportCatalog?: (file: File) => void;
  specialities?: SpecialityItem[];
  onOpenManageSpecialities?: () => void;
  onOpenManageForms?: () => void;
  onOpenGooglePortal?: () => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  doctors,
  onAddDoctor,
  onSelectDoctorForVisit,
  onOpenApkInstall,
  onOpenRateList,
  products = [],
  onExportCatalog,
  onImportCatalog,
  specialities = [],
  onOpenManageSpecialities,
  onOpenManageForms,
  onOpenGooglePortal,
}) => {
  const [activeTab, setActiveTab] = useState<string>(serviceType || 'Doctors');
  const [showAddDocForm, setShowAddDocForm] = useState(false);
  const [docName, setDocName] = useState('');
  const [docDegree, setDocDegree] = useState('MBBS, MD');
  const [docSpeciality, setDocSpeciality] = useState<Speciality>('General Physician');
  const [docClinic, setDocClinic] = useState('');
  const [docCity, setDocCity] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docTiming, setDocTiming] = useState('5:00 PM - 8:00 PM');

  // Sync tab when serviceType changes
  React.useEffect(() => {
    if (serviceType) {
      setActiveTab(serviceType);
    }
  }, [serviceType]);

  if (!isOpen) return null;

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
      qualification: docDegree,
      speciality: docSpeciality,
      clinic: docClinic || 'City Clinic',
      city: docCity || 'Main Market',
      phone: docPhone || '+91 98765 00000',
      preferredTiming: docTiming,
      visitedStatus: 'Pending',
    };

    onAddDoctor(newDoc);
    setShowAddDocForm(false);
    setDocName('');
    setDocClinic('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Doctors':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Doctor Directory & Visits</h3>
                <p className="text-xs text-slate-500">
                  Target doctors list for product detailing and sample delivery
                </p>
              </div>
              <button
                onClick={() => setShowAddDocForm(!showAddDocForm)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddDocForm ? 'Close Form' : '+ Add Doctor'}</span>
              </button>
            </div>

            {/* Add Doctor Form */}
            {showAddDocForm && (
              <form onSubmit={handleCreateDoctor} className="bg-sky-50/70 p-4 rounded-2xl border border-sky-200 space-y-3">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                  Add New Doctor Contact
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Doctor Name (e.g. Dr. A.K. Gupta)"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Qualification (e.g. MBBS, MS Ortho)"
                    value={docDegree}
                    onChange={(e) => setDocDegree(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Clinic / Hospital Name"
                    value={docClinic}
                    onChange={(e) => setDocClinic(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={docPhone}
                    onChange={(e) => setDocPhone(e.target.value)}
                    className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold"
                  />
                  <div className="sm:col-span-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Doctor Speciality</label>
                      {onOpenManageSpecialities && (
                        <button
                          type="button"
                          onClick={onOpenManageSpecialities}
                          className="text-[11px] font-bold text-sky-600 hover:text-sky-700 underline"
                        >
                          + Manage Specialities
                        </button>
                      )}
                    </div>
                    <select
                      value={docSpeciality}
                      onChange={(e) => setDocSpeciality(e.target.value as Speciality)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold"
                    >
                      {specialities.length > 0
                        ? specialities.map((s) => (
                            <option key={s.name} value={s.name}>
                              {s.name}
                            </option>
                          ))
                        : [
                            'General Physician',
                            'Ortho',
                            'Gynecologist',
                            'Paediatric',
                            'Dental Products',
                            'ENT Products',
                            'Diabetes',
                            'Antibiotics',
                            'Nephrology',
                            'Respiratory Range',
                            'Dermatology',
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  Save Doctor Profile
                </button>
              </form>
            )}

            {/* Doctor cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {doctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{doc.name}</h4>
                        <span className="text-[11px] text-sky-700 font-bold block">{doc.qualification}</span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          doc.visitedStatus === 'Visited'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.visitedStatus === 'Follow-up'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {doc.visitedStatus}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{doc.clinic}, {doc.city}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{doc.preferredTiming}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{doc.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {doc.speciality}
                    </span>
                    <button
                      onClick={() => {
                        onSelectDoctorForVisit(doc);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-700 border border-slate-200 rounded-lg font-bold text-[11px] transition-colors"
                    >
                      Detail Products &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'MR':
        return (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-sky-600 to-blue-700 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center font-black text-2xl">
                  S
                </div>
                <div>
                  <h3 className="text-xl font-black">SHIVAM BARANWAL</h3>
                  <span className="text-xs text-sky-200 font-semibold block">
                    Territory Business Executive / Medical Representative
                  </span>
                  <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full inline-block mt-1">
                    BIOPHAR LIFESCIENCES PVT. LTD.
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-sky-200 block text-[10px]">Monthly Target</span>
                  <span className="font-bold text-sm">₹ 3.5 Lakh</span>
                </div>
                <div>
                  <span className="text-sky-200 block text-[10px]">Achieved</span>
                  <span className="font-bold text-sm text-emerald-300">₹ 2.8 Lakh</span>
                </div>
                <div>
                  <span className="text-sky-200 block text-[10px]">Doctor Call Avg</span>
                  <span className="font-bold text-sm">11.4 / day</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-slate-800 text-sm">MR Profile & Contact Details:</h4>
              <p className="text-slate-600"><strong>Email:</strong> shivambaranwal121@gmail.com</p>
              <p className="text-slate-600"><strong>Headquarters:</strong> North Zone / Division 1</p>
              <p className="text-slate-600"><strong>Authorized Products:</strong> All Ortho, Gastro, Derma & Neuro range</p>
            </div>
          </div>
        );

      case 'Reminder Cards':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Doctor Clinic Reminder Cards (LBL)</h3>
              <p className="text-xs text-slate-500">
                Visual brand reminder cards given to doctors to keep on their prescription desk
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  brand: 'Acephar-CT',
                  slogan: 'For Rapid Relief in Pain & Inflammatory Swelling',
                  composition: 'Aceclofenac + Paracetamol + Trypsin Chymotrypsin',
                  color: 'bg-rose-500',
                  target: 'Prescribe in Trauma & Orthopedic OPD',
                },
                {
                  brand: '5 Fill D3 Plus',
                  slogan: 'Recharge Neurons & Strengthen Bones',
                  composition: 'Methylcobalamin + Folic Acid + Vit D3 + Pyridoxine',
                  color: 'bg-purple-600',
                  target: 'Ideal for Diabetic Neuropathy & Fatigue',
                },
                {
                  brand: 'A-Omega Softgels',
                  slogan: 'The Gold Standard Cardio-Protective Lipid Care',
                  composition: 'Omega-3 Fatty Acids (EPA & DHA) + Vitamin E',
                  color: 'bg-sky-600',
                  target: 'Prescribe for Dyslipidemia & Heart Wellness',
                },
                {
                  brand: 'Entecaref 0.5',
                  slogan: 'Potent Viral Suppression with High Barrier',
                  composition: 'Entecavir 0.5mg Tablets',
                  color: 'bg-blue-600',
                  target: 'Chronic Hepatitis B Management',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400">BIOPHAR REMINDER</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${card.color}`} />
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mt-1">{card.brand}</h4>
                    <p className="text-xs text-slate-600 font-semibold italic mt-0.5">{card.composition}</p>
                    <p className="text-xs text-sky-800 font-bold mt-2 bg-sky-50 p-2 rounded-lg">
                      &ldquo;{card.slogan}&rdquo;
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{card.target}</span>
                    <span className="font-bold text-sky-600">Ready to Share</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Certificates':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Quality & Manufacturing Accreditations</h3>
              <p className="text-xs text-slate-500">
                Official certifications verifying WHO-GMP compliant formulations
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'WHO-GMP Compliant Facility', code: 'CERT-GMP-2024-88', date: 'Valid until 2028', org: 'World Health Organization Standards' },
                { title: 'ISO 9001:2015 Quality Management', code: 'ISO-9001-QA-1092', date: 'Verified Active', org: 'International Quality Assurance' },
                { title: 'GLP Certified Testing Laboratory', code: 'GLP-LAB-5541', date: 'Batch Tested', org: 'Good Laboratory Practices' },
                { title: 'DCGI Drug Approval Documentation', code: 'DCGI-ND-7712', date: 'National Registry', org: 'Central Drugs Standard Control Org' },
              ].map((c, i) => (
                <div key={i} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{c.title}</h4>
                    <span className="text-[11px] text-slate-500 block">{c.org}</span>
                    <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-slate-600">
                      <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200">{c.code}</span>
                      <span className="text-emerald-600 font-bold">{c.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Visiting Card':
        return (
          <div className="space-y-4 flex flex-col items-center">
            {/* Front of E-Visiting Card */}
            <div className="w-full max-w-sm bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-sky-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-sky-400 uppercase">
                    BIOPHAR LIFESCIENCES
                  </span>
                  <h3 className="text-xl font-black tracking-tight text-white mt-0.5 font-['Cabinet_Grotesk',sans-serif]">
                    SHIVAM BARANWAL
                  </h3>
                  <span className="text-xs text-sky-200 font-medium">Territory Manager & Medical Representative</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center font-black text-sky-300">
                  BP
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-400" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>North Zone HQ, biopharls@gmail.com</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400">
                <span>Specialized in Ortho, Neuro & Gastro</span>
                <span className="text-sky-400 font-bold">Verified Rep</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Show this digital visiting card to clinic receptionists and doctors for appointments.
            </p>
          </div>
        );

      case 'COA Reports':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Certificate of Analysis (COA)</h3>
              <p className="text-xs text-slate-500">
                Lab testing reports confirming drug purity, assay, and dissolution specifications
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { product: 'Acephar-CT Tablets', batch: 'BP-ACT-2409', assay: '99.8% (Spec: 95-105%)', status: 'PASS', date: '08/2026' },
                { product: '5 Fill D3 Plus Tablets', batch: 'BP-F5D-2411', assay: '100.4% (Spec: 90-110%)', status: 'PASS', date: '07/2026' },
                { product: 'A-Omega Softgels', batch: 'BP-OMG-2405', assay: 'EPA 182mg / DHA 121mg', status: 'PASS', date: '09/2026' },
                { product: 'Entecaref 0.5 Tablets', batch: 'BP-ENT-2401', assay: '99.9% (Spec: 98-102%)', status: 'PASS', date: '06/2026' },
              ].map((coa, i) => (
                <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{coa.product}</h5>
                    <span className="text-[11px] text-slate-500">Batch: {coa.batch} • Assay: {coa.assay}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-lg text-[10px]">
                    {coa.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'APK / App':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Mobile App / APK Installation</h3>
              <p className="text-xs text-slate-500">
                Install Biophar directly on your Android phone as a standalone APK app with offline support
              </p>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm p-2 flex items-center justify-center shrink-0">
                  <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Biophar Lifesciences APK</h4>
                  <p className="text-xs text-slate-600">Full Visual Aid & Medicine Catalog (No internet required)</p>
                </div>
              </div>

              {onOpenApkInstall && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenApkInstall();
                  }}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Open Android APK Install Guide</span>
                </button>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-slate-700">
              <strong className="block text-slate-900">Key Android APK Features:</strong>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Bina internet ke doctor clinic me chalayein (Full Offline Cache)</li>
                <li>Real medicine box photo click & upload capability</li>
                <li>Direct WhatsApp share to Doctors & Stockists</li>
                <li>One-tap printable Doctor Rate List</li>
              </ul>
            </div>
          </div>
        );

      case 'Backup & Export':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Backup & Catalog Export</h3>
              <p className="text-xs text-slate-500">
                Export and print official price list or save catalog backup
              </p>
            </div>

            {/* Rate List Action */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Doctor Rate List & Catalog</h4>
                <p className="text-xs text-slate-500">Print or export clean rate list with MRP, GST, and Packaging</p>
              </div>
              {onOpenRateList && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenRateList();
                  }}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shrink-0"
                >
                  View & Print
                </button>
              )}
            </div>

            {/* Google Cloud Portal & Speciality Management */}
            <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 space-y-3">
              <div>
                <h4 className="font-bold text-sm text-sky-950">Google Portal & Catalog Controls</h4>
                <p className="text-xs text-sky-800">
                  Google Sheets live export, Google Drive sync, and custom formulations management.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {onOpenGooglePortal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenGooglePortal();
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <span>🌐 Open Google Portal & Sheets Sync</span>
                  </button>
                )}

                {onOpenManageForms && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenManageForms();
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>💊 Manage Product Forms</span>
                  </button>
                )}

                {onOpenManageSpecialities && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenManageSpecialities();
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>🩺 Manage Specialities</span>
                  </button>
                )}
              </div>
            </div>

            {/* Catalog JSON Backup */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Export / Import Catalog Data</h4>
                <p className="text-xs text-slate-500">Save a backup file of all your medicines & doctors</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {onExportCatalog && (
                  <button
                    onClick={onExportCatalog}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Backup (JSON)</span>
                  </button>
                )}

                <label className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs">
                  <span>Restore from Backup</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0] && onImportCatalog) {
                        onImportCatalog(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const navTabs = [
    'Doctors',
    'MR',
    'Reminder Cards',
    'Certificates',
    'Visiting Card',
    'COA Reports',
    'APK / App',
    'Backup & Export',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Pharma Services & Resources
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="px-6 pt-3 pb-1 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto">
          {navTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
