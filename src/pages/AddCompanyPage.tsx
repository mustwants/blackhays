import React, { useState } from 'react';
import { Building, MapPin, Link2, Mail, Phone, FileText, Check, Users, Beaker } from 'lucide-react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';
import { supabase } from '../lib/supabaseClient';

const AddCompanyPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    focus_areas: '',
    location: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    employee_count: '',
    founded_year: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

    const fillTestData = () => {
    setFormData({
      name: 'Test Defense Corp',
      website: 'https://example.com',
      industry: 'defense',
      focus_areas: 'AI, Cybersecurity',
      location: 'Arlington, VA',
      description: 'A test company working on defense technology.',
      contact_name: 'Jane Doe',
      contact_email: 'jane.doe@example.com',
      contact_phone: '555-123-4567',
      employee_count: '11-50',
      founded_year: '2010'
    });
  };

  const handleAdminClick = () => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = () => {
    setShowAdminPanel(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('company_submissions')
        .insert([
          {
            ...formData,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        name: '',
        website: '',
        industry: '',
        focus_areas: '',
        location: '',
        description: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        employee_count: '',
        founded_year: ''
      });
    } catch (err) {
      console.error('Error submitting company:', err);
      setError('Failed to submit company information. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Add Your Company
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Submit your defense or tech company information to be featured in our network
              </p>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Company Submitted Successfully!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Thank you for your submission. Your company information will be reviewed by our team.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-bhred hover:bg-red-700"
                >
                  Submit Another Company
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={fillTestData}
                    className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <Beaker className="w-4 h-4 mr-1" />
                    Use Test Data
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Your Company Name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link2 className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        placeholder="City, State, Country"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                      required
                    >
                      <option value="">Select Industry</option>
                      <option value="aerospace">Aerospace</option>
                      <option value="cybersecurity">Cybersecurity</option>
                      <option value="defense">Defense</option>
                      <option value="intelligence">Intelligence</option>
                      <option value="software">Software/IT</option>
                      <option value="hardware">Hardware</option>
                      <option value="ai">Artificial Intelligence</option>
                      <option value="robotics">Robotics</option>
                      <option value="communications">Communications</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee Count</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={formData.employee_count}
                        onChange={(e) => setFormData({ ...formData, employee_count: e.target.value })}
                        className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select Range</option>
                        <option value="1-10">1-10</option>
                        <option value="11-50">11-50</option>
                        <option value="51-200">51-200</option>
                        <option value="201-500">201-500</option>
                        <option value="501-1000">501-1000</option>
                        <option value="1000+">1000+</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Focus Areas</label>
                  <input
                    type="text"
                    value={formData.focus_areas}
                    onChange={(e) => setFormData({ ...formData, focus_areas: e.target.value })}
                    className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                    placeholder="e.g., Satellite Communications, Drone Technology, Cyber Defense"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Founded Year</label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.founded_year}
                    onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                    className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                    placeholder={new Date().getFullYear().toString()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Description</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Provide a brief description of your company and its capabilities..."
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                      <input
                        type="text"
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                        placeholder="Full Name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={formData.contact_email}
                          onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                          className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                          placeholder="email@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-bhred hover:bg-red-700 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Submit Company'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer onAdminClick={handleAdminClick} />
      {showAdminPanel && <AdminPanel onClose={handleCloseAdminPanel} />}
    </div>
  );
};

export default AddCompanyPage;
