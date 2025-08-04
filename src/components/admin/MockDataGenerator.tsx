import React, { useState } from 'react';
import { RefreshCw, Database, AlertCircle, Check,
  Briefcase, Users, Calendar, Rocket, Brain, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

type SubmissionType = 'event' | 'advisor' | 'newsletter' | 'company' | 'consortium' | 'innovation';

interface MockDataGeneratorProps {
  onDataGenerated?: (type: SubmissionType, data: unknown[]) => void;
}

const MockDataGenerator: React.FC<MockDataGeneratorProps> = ({ onDataGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateAllMockData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Generate 5 items for each type
      const types: SubmissionType[] = ['event', 'advisor', 'newsletter', 'company', 'consortium', 'innovation'];
      
      for (const type of types) {
        console.log(`Generating mock data for: ${type}`);
        const mockItems = generateMockData(type, 5);
        
        // Add unique IDs and timestamps
        const itemsWithIds = mockItems.map((item, index) => ({
          ...item,
          id: `mock-${type}-${Date.now()}-${index}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: type === 'newsletter' ? undefined : 'pending' // Don't add status to newsletter subscribers
        }));

        // Try to insert into Supabase
        const tableName = type === 'newsletter' ? 'newsletter_subscribers' : 
                         type === 'advisor' ? 'advisor_applications' :
                         `${type}_submissions`;
        
        console.log(`Inserting into table: ${tableName}`);
        
        for (const item of itemsWithIds) {
          try {
            // Remove mock ID and only remove status for newsletter subscribers
            const insertData: Record<string, unknown> = { ...item };
            delete insertData.id;
            if (type === 'newsletter') {
              delete insertData.status;
            }

            
            const { error: insertError } = await supabase
              .from(tableName)
              .insert([insertData]);
              
            if (insertError) {
              console.warn(`Failed to insert ${type} into Supabase:`, insertError);
            } else {
              console.log(`Successfully inserted ${type} record`);
            }
          } catch (insertErr) {
            console.warn(`Error inserting ${type} into Supabase:`, insertErr);
          }
        }

        // Update parent component with mock data
        if (onDataGenerated) {
          onDataGenerated(type, itemsWithIds);
        }
      }

      setSuccess('Successfully generated mock data for all categories');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error generating mock data:', err);
      setError('Failed to generate mock data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockEvents = (count: number) => {
    const events = [];
    const locations = ['Washington, DC', 'San Diego, CA', 'Norfolk, VA', 'Colorado Springs, CO', 'Huntsville, AL'];
    const titles = [
      'Defense Innovation Summit', 
      'Cyber Security Conference', 
      'Space Force Technology Expo',
      'Naval Systems Forum',
      'Military AI Symposium'
    ];
    
    for (let i = 0; i < count; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 90) + 30);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1);
      
      events.push({
        name: `${titles[i % titles.length]} ${new Date().getFullYear() + 1}`,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        location: locations[i % locations.length],
        website: `https://example.com/event-${i + 1}`,
        about: `This is a mock event for testing purposes. It showcases the latest advancements in defense technology and strategy.`,
        submitter_email: `submitter${i + 1}@example.com`
      });
    }
    
    return events;
  };

  const generateMockAdvisors = (count: number) => {
    const advisors = [];
    const locations = [
      { city: 'Arlington', state: 'VA', coords: [-77.1067, 38.8799] },
      { city: 'San Diego', state: 'CA', coords: [-117.1611, 32.7157] },
      { city: 'Colorado Springs', state: 'CO', coords: [-104.8214, 38.8339] },
      { city: 'Huntsville', state: 'AL', coords: [-86.5861, 34.7304] },
      { city: 'Boston', state: 'MA', coords: [-71.0589, 42.3601] }
    ];
    const militaryBranches = ['Army', 'Navy', 'Air Force', 'Marines', 'Coast Guard', 'Space Force'];
    const titles = [
      'Former General',
      'Defense Consultant', 
      'Intelligence Specialist',
      'Cybersecurity Expert',
      'Technology Integration Expert'
    ];
    
       for (let i = 0; i < count; i++) {
        const location = locations[i % locations.length];
        advisors.push({
          first_name: 'Test',
          last_name: `Advisor ${i + 1}`,
          email: `advisor${i + 1}-${Date.now()}@example.com`,
          phone: `555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
          professional_title: titles[i % titles.length],
          military_branch: militaryBranches[i % militaryBranches.length],
          years_of_mil_service: Math.floor(Math.random() * 25) + 5,
          about: `Mock advisor with extensive experience in defense and security.`,
          location: `(${location.coords[0]}, ${location.coords[1]})`,
          street_address: `${Math.floor(100 + Math.random() * 9900)} Main St`,
          city: location.city,
          state: location.state,
          zip_code: `${Math.floor(10000 + Math.random() * 90000)}`
        });
    }
    
    return advisors;
  };

  const generateMockNewsletterSubscribers = (count: number) => {
    const subscribers = [];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
    
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      
      subscribers.push({
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}-${Date.now()}@example.com`,
        notify_ceo: true
      });
    }
    
    return subscribers;
  };

  const generateMockCompanies = (count: number) => {
    const companies = [];
    const industries = ['Cybersecurity', 'Aerospace', 'Defense Technology', 'Unmanned Systems', 'AI/ML'];
    const locations = ['Arlington, VA', 'San Diego, CA', 'Boston, MA', 'Austin, TX', 'Seattle, WA'];
    
    for (let i = 0; i < count; i++) {
      companies.push({
        name: `Mock Defense Company ${i + 1}`,
        website: `https://example.com/company-${i + 1}`,
        industry: industries[i % industries.length],
        focus_areas: 'AI, Machine Learning, Cybersecurity',
        location: locations[i % locations.length],
        description: `This mock company develops cutting-edge technologies for defense applications.`,
        contact_name: `Contact Person ${i + 1}`,
        contact_email: `contact${i + 1}@example.com`,
        contact_phone: `555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        employee_count: ['1-10', '11-50', '51-200', '201-500'][Math.floor(Math.random() * 4)],
        founded_year: `${2000 + Math.floor(Math.random() * 23)}`
      });
    }
    
    return companies;
  };

  const generateMockConsortiums = (count: number) => {
    const consortiums = [];
    const focusAreas = ['Space', 'Cybersecurity', 'Artificial Intelligence', 'Maritime Defense', 'Advanced Materials'];
    const partners = ['US Army', 'US Navy', 'US Air Force', 'DARPA', 'Department of Defense'];
    
    for (let i = 0; i < count; i++) {
      consortiums.push({
        name: `Mock Defense Consortium ${i + 1}`,
        website: `https://example.com/consortium-${i + 1}`,
        focus_area: focusAreas[i % focusAreas.length],
        government_partner: partners[i % partners.length],
        established_year: `${2010 + Math.floor(Math.random() * 15)}`,
        description: `This mock consortium brings together industry leaders to solve critical defense challenges.`,
        contact_name: `Consortium Director ${i + 1}`,
        contact_email: `director${i + 1}@example.com`,
        contact_phone: `555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        membership_fee: `$${Math.floor(Math.random() * 10) * 1000 + 5000}/year`,
        headquarters: 'Washington, DC'
      });
    }
    
    return consortiums;
  };

  const generateMockInnovations = (count: number) => {
    const innovations = [];
    const types = ['Research Laboratory', 'Innovation Center', 'Technology Incubator', 'Government Lab', 'Advanced Research Facility'];
    const focusAreas = ['Quantum Computing', 'Advanced Materials', 'Biotechnology', 'Hypersonics', 'Artificial Intelligence'];
    const sponsors = ['DARPA', 'Office of Naval Research', 'Air Force Research Laboratory', 'Army Research Lab', 'Space Force'];
    
    for (let i = 0; i < count; i++) {
      innovations.push({
        name: `Mock Innovation Lab ${i + 1}`,
        website: `https://example.com/innovation-${i + 1}`,
        type: types[i % types.length],
        focus_areas: focusAreas[i % focusAreas.length],
        established_year: `${2005 + Math.floor(Math.random() * 18)}`,
        funding_source: 'Government',
        description: `This mock innovation lab focuses on developing cutting-edge technologies for defense and national security applications.`,
        contact_name: `Research Director ${i + 1}`,
        contact_email: `research${i + 1}@example.com`,
        contact_phone: `555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        primary_sponsor: sponsors[i % sponsors.length],
        headquarters: 'Arlington, VA'
      });
    }
    
    return innovations;
  };

  const generateMockData = (type: SubmissionType, count: number) => {
    switch (type) {
      case 'event':
        return generateMockEvents(count);
      case 'advisor':
        return generateMockAdvisors(count);
      case 'newsletter':
        return generateMockNewsletterSubscribers(count);
      case 'company':
        return generateMockCompanies(count);
      case 'consortium':
        return generateMockConsortiums(count);
      case 'innovation':
        return generateMockInnovations(count);
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Generate Mock Test Data</h3>
        <div className="text-sm text-gray-500">
          Create test data to experiment with admin features
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
          <div>{error}</div>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-start">
          <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
          <div>{success}</div>
        </div>
      )}
      
      <div className="bg-white p-6 border rounded-lg shadow-sm space-y-6">
        <div className="text-center">
          <button
            onClick={generateAllMockData}
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-bhred hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bhred disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Generate Test Data
              </>
            )}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            This will create 5 test entries for each category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium">Advisors</h4>
            <p className="text-sm text-gray-600">Military and defense experts</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <Calendar className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium">Events</h4>
            <p className="text-sm text-gray-600">Defense conferences and expos</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <Briefcase className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium">Companies</h4>
            <p className="text-sm text-gray-600">Defense contractors and vendors</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <Rocket className="w-6 h-6 text-red-600 mb-2" />
            <h4 className="font-medium">Consortiums</h4>
            <p className="text-sm text-gray-600">Defense industry groups</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <Brain className="w-6 h-6 text-amber-600 mb-2" />
            <h4 className="font-medium">Innovation</h4>
            <p className="text-sm text-gray-600">Research labs and centers</p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <Mail className="w-6 h-6 text-indigo-600 mb-2" />
            <h4 className="font-medium">Newsletter</h4>
            <p className="text-sm text-gray-600">Email subscribers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockDataGenerator;
