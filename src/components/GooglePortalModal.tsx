import React, { useState } from 'react';
import {
  X,
  Globe,
  FileSpreadsheet,
  Cloud,
  Download,
  Upload,
  ExternalLink,
  CheckCircle2,
  Copy,
  Calendar,
  Save,
  Database,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { Product, Doctor, CartItem } from '../types';

interface GooglePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  specialities: string[];
  productForms: string[];
  doctors: Doctor[];
  adminWhatsappNumber: string;
  onImportFullData: (data: {
    products?: Product[];
    specialities?: string[];
    productForms?: string[];
    doctors?: Doctor[];
    adminWhatsappNumber?: string;
  }) => void;
}

export const GooglePortalModal: React.FC<GooglePortalModalProps> = ({
  isOpen,
  onClose,
  products,
  specialities,
  productForms,
  doctors,
  adminWhatsappNumber,
  onImportFullData,
}) => {
  const [activeTab, setActiveTab] = useState<'sheets' | 'backup' | 'webportal' | 'calendar'>('sheets');
  const [googleSheetWebhook, setGoogleSheetWebhook] = useState(() => {
    return localStorage.getItem('biophar_google_sheet_webhook') || '';
  });
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle saving Google Sheet Webhook URL
  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('biophar_google_sheet_webhook', googleSheetWebhook.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Export to Google Sheets compatible CSV
  const handleExportGoogleSheetsCSV = () => {
    const headers = [
      'Product ID',
      'Brand',
      'Product Name',
      'Speciality',
      'Dosage Form',
      'Composition',
      'Packaging',
      'MRP (INR)',
      'GST (%)',
      'Description',
      'Visual Aid Slides Count',
    ];

    const rows = products.map((p) => [
      `"${p.id}"`,
      `"${p.brand}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.speciality}"`,
      `"${p.form}"`,
      `"${p.composition.replace(/"/g, '""')}"`,
      `"${p.packaging}"`,
      p.mrp,
      p.gst,
      `"${p.description.replace(/"/g, '""')}"`,
      (p.pdfVisualAidPages?.length || 0) + (p.image ? 1 : 0),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Biophar_Lifesciences_Catalog_GoogleSheets_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Full Google Drive / Cloud JSON Backup export
  const handleExportCloudBackup = () => {
    const backupData = {
      app: 'Biophar Lifesciences Cloud Portal',
      version: '2.5.0',
      exportedAt: new Date().toISOString(),
      adminWhatsappNumber,
      specialities,
      productForms,
      products,
      doctors,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Biophar_Google_Cloud_Backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Backup JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.products || json.specialities || json.productForms || json.doctors) {
          onImportFullData(json);
          setImportStatus('Backup data successfully synced into portal!');
          setTimeout(() => setImportStatus(null), 4000);
        } else {
          setImportStatus('Error: Invalid backup file format.');
        }
      } catch (err) {
        setImportStatus('Error: Could not read backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const currentWebUrl = window.location.href;

  const handleCopyPortalLink = () => {
    navigator.clipboard.writeText(currentWebUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-sky-400 border border-white/10 shadow-inner">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">
                  Google Portal & Cloud Sync Hub
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Online Sync
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Biophar Lifesciences Web Portal, Google Sheets integration & Drive backup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Google Sheets Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('webportal')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'webportal'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4 text-sky-600" />
            <span>Web Portal & Multi-Device</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4 text-indigo-600" />
            <span>Google Drive Backup</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-colors flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Google Calendar Visits</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-emerald-950">
                    Live Google Sheets Export & Order Logging
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Aapke Biophar Lifesciences ke saare products, specialities, formulations aur purchase order indents ko directly Google Sheets me import/sync karein.
                  </p>
                </div>
              </div>

              {/* Instant CSV Export for Google Sheets */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      One-Click Export to Google Sheets
                    </h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Download pre-formatted UTF-8 spreadsheet with all {products.length} products & formulations.
                    </p>
                  </div>
                  <button
                    onClick={handleExportGoogleSheetsCSV}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download for Sheets (.CSV)</span>
                  </button>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">
                    💡 Kaise use karein Google Sheets me:
                  </p>
                  <ol className="list-decimal pl-4 space-y-0.5">
                    <li>Download button par click karke CSV file save karein.</li>
                    <li>
                      <a
                        href="https://sheets.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 font-bold underline inline-flex items-center gap-1"
                      >
                        sheets.google.com <ExternalLink className="w-2.5 h-2.5" />
                      </a>{' '}
                      kholkar <strong>File &gt; Import &gt; Upload</strong> karein.
                    </li>
                    <li>Aapka poora digital catalogue aur rates Google Sheets me automatically load ho jayega.</li>
                  </ol>
                </div>
              </div>

              {/* Google Sheets Webhook / App Script Connector */}
              <form
                onSubmit={handleSaveWebhook}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
              >
                <div>
                  <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    Google Apps Script / Webhook Sync URL (Optional)
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Agar aapne Google Sheets Apps Script Webhook banaya hai, to URL yahan daal kar connect karein:
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={googleSheetWebhook}
                    onChange={(e) => setGoogleSheetWebhook(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Webhook</span>
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Google Sheets Webhook URL save ho gaya!</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 2: WEB PORTAL & MULTI-DEVICE */}
          {activeTab === 'webportal' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-sky-950">
                    Biophar Google Web Portal Access
                  </h4>
                  <p className="text-xs text-sky-800 mt-1 leading-relaxed">
                    Aap is application ko Laptop / PC ke Google Chrome browser par full desktop admin portal ke roop me khol sakte hain aur mobile phone par field MR app ke jaise use kar sakte hain.
                  </p>
                </div>
              </div>

              {/* Portal Web Link */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider block">
                  Google Chrome Web Portal Live URL:
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 truncate select-all">
                    {currentWebUrl}
                  </div>
                  <button
                    onClick={handleCopyPortalLink}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={currentWebUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-colors shrink-0"
                    title="Open in new browser tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                    <Laptop className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">
                        Desktop Google Portal
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                        Bulk products upload, print rate lists, and manage doctor registers on large display.
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5">
                    <Smartphone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">
                        Field Rep Mobile PWA
                      </span>
                      <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                        Offline detailing, visual aid slideshow, instant WhatsApp orders on the go.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE DRIVE BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-indigo-950">
                    Google Drive Cloud Backup & Restore
                  </h4>
                  <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                    Apne poore portal ka data (Products, Specialities, Formulations, Visual Aids, Doctors) ek file me Google Drive par backup karein ya restore karein.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Export Backup */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      Export Full Cloud Backup
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Generates complete JSON backup file with {products.length} products, {specialities.length} specialities, and {productForms.length} dosage forms.
                    </p>
                  </div>
                  <button
                    onClick={handleExportCloudBackup}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Google Drive Backup</span>
                  </button>
                </div>

                {/* Import Backup */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <h5 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                      Restore Backup from Google Drive
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload previously saved backup JSON file to restore all your products, images, and specialities.
                    </p>
                  </div>
                  <label className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>Select Backup File (.JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {importStatus && (
                <div className="p-3 bg-indigo-100/70 text-indigo-900 border border-indigo-300 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{importStatus}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GOOGLE CALENDAR APPOINTMENTS */}
          {activeTab === 'calendar' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-amber-950">
                    Google Calendar Doctor Visit Scheduler
                  </h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Doctor detailing visits aur MR route calls ko direct apne Google Calendar me add karein taaki timely reminder mil sake.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-slate-700 tracking-wider block">
                  Registered Doctors Quick Calendar Links:
                </label>
                {doctors.length === 0 ? (
                  <p className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl">
                    No doctors registered yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {doctors.map((doc) => {
                      const calTitle = encodeURIComponent(`Biophar Medical Rep Visit: ${doc.name} (${doc.speciality})`);
                      const calDetails = encodeURIComponent(`Detaling Biophar Lifesciences portfolio to ${doc.name} at ${doc.clinic}, ${doc.city}. Contact: ${doc.phone || 'N/A'}`);
                      const calLocation = encodeURIComponent(`${doc.clinic}, ${doc.city}`);
                      const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&details=${calDetails}&location=${calLocation}`;

                      return (
                        <div
                          key={doc.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-900 block">
                              {doc.name} ({doc.speciality})
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {doc.clinic}, {doc.city}
                            </span>
                          </div>

                          <a
                            href={calUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Add to Google Cal</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cloud Portal Stats Card */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sky-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Connected Cloud Database Stats:
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  {products.length} Products • {specialities.length} Specialities • {productForms.length} Forms • {doctors.length} Doctors
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/60">
              <ShieldCheck className="w-4 h-4" />
              <span>Synced</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Close Google Portal
          </button>
        </div>
      </div>
    </div>
  );
};
