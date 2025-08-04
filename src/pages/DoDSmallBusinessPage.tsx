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
}

const DoDSmallBusinessPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
       {
      id: 'ein',
      label: 'EIN',
      completed: false,
      type: 'text',
      value: '',
      link: 'https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers'
    },
    {
      id: 'duns',
      label: 'DUNS/UEI',
      completed: false,
      type: 'text',
      value: '',
      link: 'https://sam.gov/content/duns-uei'
    },
    {
      id: 'bank',
      label: 'Bank Account (Last 4)',
      completed: false,
      type: 'text',
      value: '',
      mask: true,
      link: 'https://www.irs.gov/businesses/small-businesses-self-employed/opening-a-bank-account'
    },
    {
      id: 'address',
      label: 'Physical Address',
      completed: false,
      type: 'text',
      value: '',
      link: 'https://www.sba.gov/business-guide/plan-your-business/choose-your-business-location-equipment'
    },
    {
      id: 'incorp',
      label: 'Date of Incorporation',
      completed: false,
      type: 'date',
      value: '',
      link: 'https://www.sba.gov/business-guide/launch-your-business/choose-business-structure'
    },
    {
      id: 'login',
      label: 'Create a Login.gov account',
      completed: false,
      link: 'https://login.gov/'
    },
    { 
      id: 'cage',
      label: 'Acquire CAGE Code',
      completed: false,
      type: 'text',
      value: '',
      link: 'https://cage.dla.mil/'
    },
    {
      id: 'sam',
      label: 'Register in SAM',
      completed: false,
      link: 'https://sam.gov/content/home'
    },
    {
      id: 'sbir',
      label: 'Register in SBIR',
      completed: false,
      link: 'https://www.sbir.gov/registration'
    },
    {
      id: 'sbc',
      label: 'Register SBC and get Certificate',
      completed: false,
      link: 'https://certify.sba.gov/'
    },
    {
      id: 'dsip',
      label: 'Set up your DSIP for submissions',
      completed: false,
      link: 'https://www.dodsbirsttr.mil/submissions/'
    }
  ]);

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
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text('DoD Small Business Checklist', 10, 20);

    let y = 30;
    const pageHeight = pdf.internal.pageSize.getHeight();

    checklist.forEach(item => {
      let display = item.label;
      if (item.value) {
        const masked = item.mask
          ? `${'*'.repeat(Math.max(0, item.value.length - 4))}${item.value.slice(-4)}`
          : item.value;
        display += `: ${masked}`;
      }

      if (item.link) {
        pdf.textWithLink(display, 10, y, { url: item.link });
      } else {
        pdf.text(display, 10, y);
      }

      y += 10;
      if (y > pageHeight - 10) {
        pdf.addPage();
        y = 20;
      }
    });

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
                  className="flex flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
                    <span className="ml-2 text-gray-700 font-medium">{item.label}</span>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto text-bhred hover:text-red-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
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
