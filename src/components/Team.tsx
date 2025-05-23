import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import ConsultantMap from './ConsultantMap';

const Team = () => {
  return (
    <div id="our-team" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-black sm:text-4xl">Our Team</h2>
          <p className="mt-4 text-xl text-bhgray-600">
            Join our network of experienced defense and intelligence professionals
          </p>
        </div>

        {/* Advisor Map */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Our Advisors Across the Nation</h3>
          <ConsultantMap />
        </div>

        <div className="bg-black rounded-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <Users className="w-16 h-16 text-bhred" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Become an Advisor
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Are you a veteran or experienced professional in defense, intelligence, or technology? 
            Join our network of advisors and help shape the future of defense technology.
          </p>
          <a
            href="/apply"
            className="inline-flex items-center px-8 py-3 bg-bhred text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Apply Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Team;