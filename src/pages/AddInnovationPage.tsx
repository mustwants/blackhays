import React, { useState } from 'react';
import { Brain, MapPin, Link2, Mail, Phone, FileText, Check, Briefcase, Clock, Beaker, Lightbulb } from 'lucide-react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';
import { supabase } from '../lib/supabaseClient';

const AddInnovationPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    type: '',
    focus_areas: '',
    established_year: '',
    funding_source: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    primary_sponsor: '',
    headquarters: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
        .from('innovation_submissions')
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
        type: '',
        focus_areas: '',
        established_year: '',
        funding_source: '',
        description: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        primary_sponsor: '',
        headquarters: ''
      });
    } catch (err) {
      console.error('Error submitting innovation organization:', err);
      setError('Failed to submit innovation organization information. Please try again.');
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
                Add Innovation Organization/Lab
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Submit information about a research lab, innovation center, or technology incubator
              </p>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Organization Submitted Successfully!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Thank you for your submission. The organization information will be reviewed by our team.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-bhred hover:bg-red-700"
                >
                  Submit Another Organization
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Brain className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Organization Name"
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
                        placeholder="https://example.org"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Headquarters</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.headquarters}
                        onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
                        className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        placeholder="City, State"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type of Organization</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="research_lab">Research Laboratory</option>
                      <option value="innovation_center">Innovation Center</option>
                      <option value="incubator">Startup Incubator</option>
                      <option value="accelerator">Accelerator</option>
                      <option value="government_lab">Government Laboratory</option>
                      <option value="university_lab">University Research Department</option>
                      <option value="nonprofit">Nonprofit Research Organization</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Established Year</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.established_year}
                        onChange={(e) => setFormData({ ...formData, established_year: e.target.value })}
                        className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        placeholder={new Date().getFullYear().toString()}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary Research/Focus Areas</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Beaker className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.focus_areas}
                      onChange={(e) => setFormData({ ...formData, focus_areas: e.target.value })}
                      className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., Quantum Computing, AI, Advanced Materials, Biotech"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Primary Sponsor/Partner</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.primary_sponsor}
                        onChange={(e) => setFormData({ ...formData, primary_sponsor: e.target.value })}
                        className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        placeholder="e.g., DARPA, NSF, MIT, Private Industry"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Funding Source</label>
                    <select
                      value={formData.funding_source}
                      onChange={(e) => setFormData({ ...formData, funding_source: e.target.value })}
                      className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                    >
                      <option value="">Select Funding Source</option>
                      <option value="government">Government</option>
                      <option value="private">Private Industry</option>
                      <option value="academic">Academic Institution</option>
                      <option value="nonprofit">Nonprofit Organization</option>
                      <option value="venture">Venture Capital</option>
                      <option value="mixed">Mixed Funding</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Organization Description</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <Lightbulb className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Provide a description of the organization, its mission, research focus, and any notable achievements..."
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
                      {submitting ? 'Submitting...' : 'Submit Organization'}
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

export default AddInnovationPage;