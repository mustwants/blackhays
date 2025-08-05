import React, { useState, useEffect } from 'react';
import { ExternalLink, Shield, Search, HelpCircle, Download, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  link?: string;
  value?: string;
  type?: 'text' | 'date' | 'password' | 'number';
  mask?: boolean;
    description?: string;
}

const DoDSmallBusinessPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
        {
      id: 'legalName',
      label: 'Legal Name of Company',
      completed: false,
      type: 'text',
      value: '',
      description: 'Official name of your business.'
    },
    {
      id: 'ein',
      label: 'EIN',
      completed: false,
      type: 'text',
      value: '',
      link: 'https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers',
      description: 'Employer Identification Number issued by the IRS.'
    },
    {
      id: 'duns',
      label: 'DUNS/UEI',
      completed: false,
      type: 'text',
      value: '',
      link: 'https://sam.gov/content/duns-uei',
      description: 'Unique identifier for your business used in federal systems.'
    },
    {
      id: 'bank',
      label: 'Bank Account (Last 4)',
      completed: false,
      type: 'text',
      value: '',
      mask: true,
      link: 'https://www.irs.gov/businesses/small-businesses-self-employed/opening-a-bank-account',
      description: 'Account used for federal payments; enter only the last four digits.'
    },
    {
      id: 'street',
      label: 'Street Address',
      completed: false,
      type: 'text',
      value: '',
      link: 'https://www.sba.gov/business-guide/plan-your-business/choose-your-business-location-equipment',
      description: 'Business physical street address.'
    },
    {
      id: 'city',
      label: 'City',
      completed: false,
      type: 'text',
      value: '',
      description: 'City where your business is located.'
    },
    {
      id: 'state',
      label: 'State',
      completed: false,
      type: 'text',
      value: '',
      description: 'State where your business is located.'
    },
    {
      id: 'zip',
      label: 'Zip Code',
      completed: false,
      type: 'text',
      value: '',
      description: 'Zip code of your business address.'
    },
    {
      id: 'incorp',
      label: 'Date of Incorporation',
      completed: false,
      type: 'date',
      value: '',
      link: 'https://www.sba.gov/business-guide/launch-your-business/choose-business-structure',
      description: 'Date your business was officially formed.'
    },
    {
      id: 'login',
      label: 'Create a Login.gov account',
      completed: false,
      link: 'https://login.gov/',
      description: 'Single sign-on for U.S. government services.'
    },
    { 
      id: 'cage',
      label: 'Acquire CAGE Code',
      completed: false,
      type: 'text',
      value: '',
      link: 'https://cage.dla.mil/',
      description: 'Commercial and Government Entity code used for federal contracting.'
    },
    {
      id: 'sam',
      label: 'Register in SAM',
      completed: false,
      link: 'https://sam.gov/content/home',
      description: 'System for Award Management registration.'
    },
    {
      id: 'sbir',
      label: 'Register in SBIR',
      completed: false,
      link: 'https://www.sbir.gov/registration',
      description: 'Small Business Innovation Research registration.'
    },
    {
      id: 'sbc',
      label: 'Register SBC',
      completed: false,
      link: 'https://certify.sba.gov/',
      description: 'Small Business Certification through the SBA.'
    },
        {
      id: 'certificate',
      label: 'Downloaded Certificate',
      completed: false,
      description: 'Confirmation of SBC registration download.'
    },
    {
      id: 'dsip',
      label: 'Set up your DSIP for submissions',
      completed: false,
      link: 'https://www.dodsbirsttr.mil/submissions/',
      description: 'Defense SBIR/STTR Innovation Portal for proposal submissions.'
    }
  ]);
  const [infoItem, setInfoItem] = useState<string | null>(null);
  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  useEffect(() => {
    const savedChecklist = localStorage.getItem('dodChecklist');
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dodChecklist', JSON.stringify(checklist));
  }, [checklist]);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const updateValue = (id: string, value: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, value } : item
    ));
  };

  const exportToPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
   const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = 20;

    const getItem = (id: string) => checklist.find(item => item.id === id);
    const getValue = (id: string) => getItem(id)?.value || '';

    const companyName = getValue('legalName');
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(companyName || 'Legal Name of Company', pageWidth / 2, y, { align: 'center' });
    y += 12;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    const fields = [
      { id: 'legalName', label: 'Legal Name of Company' },
      { id: 'ein', label: 'EIN' },
      { id: 'duns', label: 'DUNS/UEI' },
      { id: 'bank', label: 'Bank Account (Last 4)', mask: true },
      { id: 'street', label: 'Street Address' },
      { id: 'city', label: 'City' },
      { id: 'state', label: 'State' },
      { id: 'zip', label: 'Zip Code' },
      { id: 'incorp', label: 'Date of Incorporation' },
      { id: 'cage', label: 'Acquire CAGE Code' }
    ];

    fields.forEach(field => {
      let value = getValue(field.id);
      if (field.mask && value) {
        value = `x-${value}`;
      }
      if (field.id === 'incorp' && value) {
        value = new Date(value).toLocaleDateString('en-US');
      }
      pdf.text(`${field.label}: ${value}`, 20, y);
      y += 8;
    });

    y += 4;

    const checks = [
      { id: 'login', label: 'Create a Login.gov account' },
      { id: 'sam', label: 'Register in SAM' },
      { id: 'sbir', label: 'Register in SBIR' },
      { id: 'sbc', label: 'Register SBC' },
      { id: 'certificate', label: 'Downloaded Certificate' },
      { id: 'dsip', label: 'Set up your DSIP for submissions' }
    ];

    checks.forEach(check => {
      pdf.rect(20, y - 4, 4, 4);
      if (getItem(check.id)?.completed) {
        pdf.line(20, y - 4, 24, y);
        pdf.line(24, y - 4, 20, y);
      }
      pdf.text(check.label, 30, y);
      y += 8;
    });

    pdf.setFontSize(10);
    pdf.text('Powered by BlackHays Group', pageWidth / 2, pageHeight - 10, { align: 'center' });

    pdf.save('dod-small-business-checklist.pdf');
  };

  const resources = [
    {
      title: 'Who won that contract?',
      description: 'Track how federal money is spent in communities across America and beyond.',
      icon: Search,
      link: 'https://www.usaspending.gov/'
    },
    {
      title: 'Educational Links',
      description: 'SBIR/STTR Data protection and educational resources.',
      icon: Shield,
      link: 'https://www.sbir.gov/tutorials'
    },
    {
      title: 'Find a PTAC',
      description: 'Procurement Technical Assistance Centers can help with registrations.',
      icon: HelpCircle,
      link: 'https://www.aptac-us.org/find-a-ptac/'
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">DoD Small Business</h1>
          <p className="text-xl text-gray-300">
            Complete guide to registering and engaging with Department of Defense small business opportunities
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Registration Checklist */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">DoD Small Business Checklist</h2>
            <button
              onClick={exportToPDF}
              className="flex items-center px-4 py-2 bg-bhred text-white rounded-md hover:bg-red-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
          <div id="checklist-content" className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors relative"
                >
                  <div className="flex items-center mb-2">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`p-1 rounded-md transition-colors ${
                        item.completed ? 'bg-green-100' : 'hover:bg-gray-200'
                      }`}
                    >
                      <Check className={`w-5 h-5 ${
                        item.completed ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </button>
                    <span className="ml-2 text-gray-700 font-medium flex-grow">{item.label}</span>
                    {item.description && (
                      <button
                        onClick={() => setInfoItem(infoItem === item.id ? null : item.id)}
                        className="text-gray-400 hover:text-bhred"
                        aria-label={`Info about ${item.label}`}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {item.type && (
                    <input
                      type={item.type}
                      value={item.value || ''}
                      onChange={(e) => updateValue(item.id, e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred text-sm"
                    placeholder={`Enter ${item.label}`}
                  />
                )}
                  {infoItem === item.id && item.description && (
                    <div className="absolute top-full left-0 mt-2 p-4 bg-white border rounded shadow-lg z-10">
                      <p className="text-sm text-gray-600">{item.description}</p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-bhred hover:text-red-700 text-sm mt-2"
                        >
                          Learn more
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <resource.icon className="w-8 h-8 text-bhred" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{resource.title}</h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <a
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-bhred hover:text-red-700"
                  >
                    Learn more
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default DoDSmallBusinessPage;
