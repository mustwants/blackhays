import React, { useState } from 'react';
import { Calendar, MapPin, Link2, FileText, Check } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import Footer from '../components/Footer';
import AdminPanel from '../components/AdminPanel';

const SubmitEventPage = () => {
  const { submitEvent } = useEvents();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    location: '',
    website: '',
    about: '',
    submitter_email: ''
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

  const validateForm = () => {
    if (!formData.name.trim()) {
      throw new Error('Event name is required');
    }
    if (!formData.start_date) {
      throw new Error('Start date is required');
    }
    if (!formData.end_date) {
      throw new Error('End date is required');
    }
    if (!formData.location.trim()) {
      throw new Error('Location is required');
    }
    if (!formData.submitter_email.trim()) {
      throw new Error('Email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.submitter_email)) {
      throw new Error('Please enter a valid email address');
    }

    // Validate dates
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new Error('Start date cannot be in the past');
    }
    if (endDate < startDate) {
      throw new Error('End date cannot be before start date');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Validate form data
      validateForm();

      // Submit event
      const { error } = await submitEvent(formData);
      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        name: '',
        start_date: '',
        end_date: '',
        location: '',
        website: '',
        about: '',
        submitter_email: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit event');
      console.error('Error submitting event:', err);
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
                Submit an Event
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Share a defense or intelligence community event with our network
              </p>
            </div>

            {success ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Event Submitted Successfully!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Thank you for your submission. Your event will be reviewed by our team.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-bhred hover:bg-red-700"
                >
                  Submit Another Event
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
                  <label className="block text-sm font-medium text-gray-700">Event Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Defense Innovation Summit 2025"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
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
                      placeholder="Washington, DC"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Website (Optional)</label>
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
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">About the Event</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.about}
                      onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      rows={4}
                      className="focus:ring-bhred focus:border-bhred block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Provide a brief description of the event..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Your Email</label>
                  <input
                    type="email"
                    value={formData.submitter_email}
                    onChange={(e) => setFormData({ ...formData, submitter_email: e.target.value })}
                    className="mt-1 focus:ring-bhred focus:border-bhred block w-full border border-gray-300 rounded-md py-2 px-3"
                    placeholder="you@example.com"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    We'll only use this to contact you about your event submission.
                  </p>
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
                      {submitting ? 'Submitting...' : 'Submit Event'}
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

export default SubmitEventPage;