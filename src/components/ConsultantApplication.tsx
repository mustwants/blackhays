import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdvisors } from '../hooks/useAdvisors';
import { FileText, Upload, Check, Beaker } from 'lucide-react';

interface AdvisorApplicationForm {
  first_name: string;
  last_name: string;
  email: string;
  state: string;
  zip_code: string;
  phone?: string;
  street_address?: string;
  city?: string;
  webpage?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  bluesky?: string;
  instagram?: string;
  professional_title?: string;
  military_branch?: string;
  years_of_mil_service?: string;
  years_of_us_civil_service?: string;
  about?: string;
  resume_url?: string;
  headshot_url?: string;
  business_logo_url?: string;
}

const ConsultantApplication = () => {
  const navigate = useNavigate();
  const { submitApplication } = useAdvisors();
  const [formData, setFormData] = useState<AdvisorApplicationForm>({
    first_name: '',
    last_name: '',
    email: '',
    state: '',
    zip_code: '',
        phone: '',
    street_address: '',
    city: '',
    webpage: '',
    facebook: '',
    x: '',
    linkedin: '',
    bluesky: '',
    instagram: '',
    professional_title: '',
    military_branch: '',
    years_of_mil_service: '',
    years_of_us_civil_service: '',
    about: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fillTestData = () => {
    setFormData({
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      state: 'VA',
      zip_code: '22202',
            phone: '555-123-4567',
      street_address: '123 Defense St',
      city: 'Arlington',
      webpage: 'https://example.com',
      facebook: 'https://facebook.com/janedoe',
      x: 'https://x.com/janedoe',
      linkedin: 'https://linkedin.com/in/janedoe',
      bluesky: '',
      instagram: '',
      professional_title: 'Defense Consultant',
      military_branch: 'army',
      years_of_mil_service: '10',
      years_of_us_civil_service: '5',
      about: 'Experienced military advisor with a decade of service.'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const { error } = await submitApplication(formData);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Application Submitted!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your interest. We'll review your application and get back to you soon.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to the homepage...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Advisor Application
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Join our network of defense and intelligence professionals
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
              
              <div className="grid grid-cols-1 gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">First Name</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                     />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Street Address</label>
                    <input
                      type="text"
                       value={formData.street_address}
                      onChange={e => setFormData({ ...formData, street_address: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                      placeholder="Street address"
                    />
                  </div>
                                    <div>
                    <label className="block text-sm font-medium text-bhgray-700">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                      placeholder="City"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={e => setFormData({ ...formData, state: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zip_code}
                      onChange={e => setFormData({ ...formData, zip_code: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-bhgray-700">Webpage</label>
                  <input
                    type="url"
                    value={formData.webpage}
                    onChange={e => setFormData({ ...formData, webpage: e.target.value })}
                    className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Facebook</label>
                    <input
                      type="url"
                      value={formData.facebook}
                      onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">X</label>
                    <input
                      type="url"
                      value={formData.x}
                      onChange={e => setFormData({ ...formData, x: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">BlueSky</label>
                    <input
                      type="url"
                      value={formData.bluesky}
                      onChange={e => setFormData({ ...formData, bluesky: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                    />
                  </div>
                </div>

                                <div>
                  <label className="block text-sm font-medium text-bhgray-700">Instagram</label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                    className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-bhgray-700">Professional Title</label>
                  <input
                    type="text"
                    value={formData.professional_title}
                    onChange={e => setFormData({ ...formData, professional_title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                    placeholder="e.g., Senior Defense Consultant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-bhgray-700">Military Branch</label>
                  <select
                    value={formData.military_branch}
                    onChange={e => setFormData({ ...formData, military_branch: e.target.value })}
                    className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                  >
                    <option value="">Select Branch</option>
                    <option value="army">Army</option>
                    <option value="navy">Navy</option>
                    <option value="air_force">Air Force</option>
                    <option value="marines">Marines</option>
                    <option value="coast_guard">Coast Guard</option>
                    <option value="space_force">Space Force</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Years of Military Service</label>
                    <input
                      type="text"
                      value={formData.years_of_mil_service}
                      onChange={e => setFormData({ ...formData, years_of_mil_service: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                                            placeholder="e.g., 10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Years of US Civil Service</label>
                    <input
                      type="text"
                      value={formData.years_of_us_civil_service}
                      onChange={e => setFormData({ ...formData, years_of_us_civil_service: e.target.value })}
                      className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                      placeholder="e.g., 5"
                    />
                  </div>
                 </div>

                <div>
                  <label className="block text-sm font-medium text-bhgray-700">About You</label>
                  <textarea
                    value={formData.about}
                    onChange={e => setFormData({ ...formData, about: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-bhgray-300 shadow-sm focus:border-bhred focus:ring-bhred"
                    placeholder="Tell us about your experience and expertise..."
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Resume (Optional)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-bhgray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <FileText className="mx-auto h-12 w-12 text-bhgray-400" />
                        <div className="flex text-sm text-bhgray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-bhred hover:text-red-700">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-bhgray-500">PDF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Headshot (Optional)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-bhgray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-bhgray-400" />
                        <div className="flex text-sm text-bhgray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-bhred hover:text-red-700">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-bhgray-500">Image up to 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-bhgray-700">Business Logo (Optional)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-bhgray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-bhgray-400" />
                        <div className="flex text-sm text-bhgray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-bhred hover:text-red-700">
                            <span>Upload a file</span>
                            <input type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-bhgray-500">Image up to 5MB</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="bg-white py-2 px-4 border border-bhgray-300 rounded-md shadow-sm text-sm font-medium text-bhgray-700 hover:bg-bhgray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-bhred hover:bg-red-700 disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultantApplication;
