import React, { useState } from 'react';
import { Rocket, MapPin, Link2, Mail, Phone, FileText, Check, Briefcase, Clock } from 'lucide-react';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';
import { supabase } from '../lib/supabaseClient';

const AddConsortiumPage = () => {
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    focus_area: '',
    government_partner: '',
    established_year: '',
    eligibility_criteria: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    membership_fee: '',
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
        .from('consortium_submissions')
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
        focus_area: '',
        government_partner: '',
        established_year: '',
        eligibility_criteria: '',
        description: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        membership_fee: '',
        headquarters: ''
      });
    } catch (err) {
      console.error('Error submitting consortium:', err);
      setError('Failed to submit consortium information. Please try again.');
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
                Add a Consortium
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Submit information about a defense or technology consortium to our database
              </p>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Consortium Submitted Successfully!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Thank you for your submission. The consortium information will be reviewed by our team.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-bhred hover:bg-red-700"
                >
                  Submit Another Consortium
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
                  <label className="block text-sm font-medium text-gray-700">Consortium Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Rocket className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Consortium Name"
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
                    <label className="block text-sm font-medium text-gray-700">Government Partner</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={formData.government_partner}
                        onChange={(e) => setFormData({ ...formData, government_partner: e.target.value })}
                        className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                        placeholder="e.g., US Army, DARPA, DoD"
                        required
                      />
                    </div>
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
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Focus Area</label>
                  <input
                    type="text"
                    value={formData.focus_area}
                    onChange={(e) => setFormData({ ...formData, focus_area: e.target.value })}
                    className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                    placeholder="e.g., Cybersecurity, Space Technology, Medical Innovation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Membership Fee (if applicable)</label>
                  <input
                    type="text"
                    value={formData.membership_fee}
                    onChange={(e) => setFormData({ ...formData, membership_fee: e.target.value })}
                    className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                    placeholder="e.g., $500 annually, Varies by company size, N/A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Eligibility Criteria</label>
                  <textarea
                    value={formData.eligibility_criteria}
                    onChange={(e) => setFormData({ ...formData, eligibility_criteria: e.target.value })}
                    rows={3}
                    className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                    placeholder="Who can join this consortium? What are the requirements?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Consortium Description</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Provide a description of the consortium, its mission, and benefits of membership..."
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
                      {submitting ? 'Submitting...' : 'Submit Consortium'}
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

export default AddConsortiumPage;