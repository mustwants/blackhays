import React from 'react';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <div className="bg-black py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Transform Your Defense Strategy?
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Schedule a consultation with our experts and discover how we can help you navigate the defense landscape.
        </p>
        <a
          href="https://calendly.com/blackhaysgroup"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-8 py-3 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Schedule Your Consultation
          <ArrowRight className="ml-2 w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default CallToAction;