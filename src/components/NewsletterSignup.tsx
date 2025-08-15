import React, { useState } from 'react';
import { Mail, Check, X, Beaker } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface NewsletterSignupProps {
  onClose?: () => void;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

    const fillTestData = () => {
    setFormData({
      first_name: 'Test',
      last_name: 'User',
      email: 'test.user@example.com'
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setStatus('error');
      return;
    }

    try {
      console.log('Attempting to subscribe newsletter:', formData);
      
      const { data, error: dbError } = await supabase
        .from('newsletter_subscribers')
        .insert([{ 
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          email: formData.email.trim().toLowerCase(),
          status: 'pending'
        }]);

      if (dbError) {
        console.error('Database error:', dbError);
        if (dbError.code === '23505') {
          setError('This email address is already subscribed.');
        } else {
          setError(`Database error: ${dbError.message}`);
        }
        setStatus('error');
        return;
      }
      
      console.log('Successfully subscribed to newsletter');
      setStatus('success');
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: ''
      });
      
      setTimeout(() => {
        if (onClose) onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Failed to subscribe. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {status === 'success' ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Successfully subscribed!
            </h3>
            <p className="text-sm text-gray-500">
              Thank you for subscribing to our newsletter.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center mb-6">
              <Mail className="w-12 h-12 text-bhred" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Stay updated with the latest in defense technology and innovation
            </p>
                        <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={fillTestData}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <Beaker className="w-4 h-4 mr-1" />
                Use Test Data
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-bhred focus:ring-bhred px-3 py-2"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-bhred text-white rounded-md py-2 px-4 hover:bg-red-700 disabled:opacity-50"
              >
                {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default NewsletterSignup;
