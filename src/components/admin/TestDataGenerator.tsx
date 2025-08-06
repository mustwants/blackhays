import React, { useState } from 'react';
import { RefreshCw, Database, AlertCircle, Check, Users, Calendar, Building, Rocket, Brain, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const TestDataGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateTestData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Generate test data for each category
      await Promise.all([
        generateTestAdvisors(),
        generateTestEvents(),
        generateTestCompanies(),
        generateTestConsortiums(),
        generateTestInnovations(),
        generateTestNewsletterSubscribers()
      ]);

      setSuccess('Successfully generated 5 test items for each category!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error generating test data:', err);
      setError('Failed to generate test data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateTestAdvisors = async () => {
    const advisors = [
      {
        name: 'John Mitchell',
        email: `john.mitchell.test.${Date.now()}@example.com`,
        phone: '555-101-2001',
        professional_title: 'Former Navy Admiral',
        military_branch: 'navy',
        years_of_service: '25',
        service_status: ['veteran'],
        about: 'Former Navy Admiral with 25 years of experience in naval operations and defense acquisition.',
        address: '123 Defense Way',
        zip_code: '22201',
        location: [-77.0864, 38.8799],
        headshot_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        business_logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Sarah Rodriguez',
        email: `sarah.rodriguez.test.${Date.now()}@example.com`,
        phone: '555-101-2002',
        professional_title: 'Cybersecurity Expert',
        military_branch: 'air_force',
        years_of_service: '18',
        service_status: ['veteran'],
        about: 'Cybersecurity specialist with expertise in defense systems and threat intelligence.',
        address: '456 Tech Street',
        zip_code: '94107',
        location: [-122.4194, 37.7749],
        headshot_url: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=400&h=400&fit=crop&crop=face',
        business_logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Michael Chen',
        email: `michael.chen.test.${Date.now()}@example.com`,
        phone: '555-101-2003',
        professional_title: 'Defense Technology Consultant',
        military_branch: 'army',
        years_of_service: '20',
        service_status: ['veteran'],
        about: 'Army veteran specializing in emerging technologies and defense innovation programs.',
        address: '789 Innovation Blvd',
        zip_code: '80301',
        location: [-104.9903, 39.7392],
        headshot_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        business_logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Lisa Thompson',
        email: `lisa.thompson.test.${Date.now()}@example.com`,
        phone: '555-101-2004',
        professional_title: 'Intelligence Analyst',
        military_branch: 'marines',
        years_of_service: '15',
        service_status: ['veteran'],
        about: 'Former Marine intelligence analyst with expertise in strategic planning and operations.',
        address: '321 Strategy Lane',
        zip_code: '35801',
        location: [-86.5861, 34.7304],
        headshot_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        business_logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'David Park',
        email: `david.park.test.${Date.now()}@example.com`,
        phone: '555-101-2005',
        professional_title: 'Space Force Advisor',
        military_branch: 'space_force',
        years_of_service: '12',
        service_status: ['active'],
        about: 'Space Force officer with expertise in satellite systems and space-based defense technologies.',
        address: '654 Satellite Drive',
        zip_code: '80914',
        location: [-104.8214, 38.8339],
        headshot_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        business_logo_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&h=200&fit=crop',
        status: 'pending'
      }
    ];

    for (const advisor of advisors) {
      await supabase.from('advisor_applications').insert([advisor]);
    }
  };

  const generateTestEvents = async () => {
    const events = [
      {
        name: 'Defense Innovation Summit 2025',
        start_date: '2025-06-15T09:00:00.000Z',
        end_date: '2025-06-17T17:00:00.000Z',
        location: 'Washington, DC',
        website: 'https://example.com/dis2025',
        about: 'Annual summit bringing together defense innovators, contractors, and government officials.',
        submitter_email: `test.event1.${Date.now()}@example.com`,
        logo_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=150&fit=crop',
        status: 'pending'
      },
      {
        name: 'Cybersecurity Excellence Conference',
        start_date: '2025-08-22T08:00:00.000Z',
        end_date: '2025-08-24T18:00:00.000Z',
        location: 'San Diego, CA',
        website: 'https://example.com/cyberconf2025',
        about: 'Leading cybersecurity conference focused on defense and government applications.',
        submitter_email: `test.event2.${Date.now()}@example.com`,
        logo_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=300&h=150&fit=crop',
        status: 'pending'
      },
      {
        name: 'Space Technology Expo',
        start_date: '2025-09-10T09:00:00.000Z',
        end_date: '2025-09-12T17:00:00.000Z',
        location: 'Colorado Springs, CO',
        website: 'https://example.com/spacetech2025',
        about: 'Exhibition showcasing the latest in space and satellite technologies.',
        submitter_email: `test.event3.${Date.now()}@example.com`,
        logo_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=150&fit=crop',
        status: 'pending'
      },
      {
        name: 'AI in Defense Symposium',
        start_date: '2025-10-05T08:30:00.000Z',
        end_date: '2025-10-07T16:30:00.000Z',
        location: 'Boston, MA',
        website: 'https://example.com/aidefense2025',
        about: 'Symposium exploring artificial intelligence applications in defense and security.',
        submitter_email: `test.event4.${Date.now()}@example.com`,
        logo_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=300&h=150&fit=crop',
        status: 'pending'
      },
      {
        name: 'Maritime Defense Forum',
        start_date: '2025-11-18T09:00:00.000Z',
        end_date: '2025-11-20T17:00:00.000Z',
        location: 'Norfolk, VA',
        website: 'https://example.com/maritime2025',
        about: 'Forum dedicated to naval and maritime defense technologies and strategies.',
        submitter_email: `test.event5.${Date.now()}@example.com`,
        logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=150&fit=crop',
        status: 'pending'
      }
    ];

    for (const event of events) {
      await supabase.from('event_submissions').insert([event]);
    }
  };

  const generateTestCompanies = async () => {
    const companies = [
      {
        name: 'Apex Defense Technologies',
        first_name: 'Jennifer',
        last_name: 'Walsh',
        website: 'https://example.com/apex',
        industry: 'cybersecurity',
        focus_areas: 'AI-powered threat detection, Network security, Incident response',
        location: 'Arlington, VA',
        description: 'Leading provider of AI-powered cybersecurity solutions for defense and government agencies.',
        contact_name: 'Jennifer Walsh',
        contact_email: `jennifer.walsh.test.${Date.now()}@example.com`,
        contact_phone: '555-201-3001',
        employee_count: '51-200',
        founded_year: '2018',
        linkedin: 'https://linkedin.com/company/apex-defense',
        twitter: 'https://twitter.com/apexdefense',
        facebook: 'https://facebook.com/apexdefense',
        logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop',
        status: 'pending'
      },
      {
        name: 'Quantum Aerospace Solutions',
        first_name: 'Robert',
        last_name: 'Kim',
        website: 'https://example.com/quantum',
        industry: 'aerospace',
        focus_areas: 'Quantum computing, Satellite communications, Space systems',
        location: 'Los Angeles, CA',
        description: 'Pioneering quantum technologies for next-generation aerospace and defense applications.',
        contact_name: 'Robert Kim',
        contact_email: `robert.kim.test.${Date.now()}@example.com`,
        contact_phone: '555-201-3002',
        employee_count: '11-50',
        founded_year: '2020',
        linkedin: 'https://linkedin.com/company/quantum-aerospace',
        twitter: 'https://twitter.com/quantumaero',
        facebook: 'https://facebook.com/quantumaerospace',
        logo_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
        status: 'pending'
      },
      {
        name: 'Tactical Robotics Inc',
        first_name: 'Maria',
        last_name: 'Santos',
        website: 'https://example.com/tactical',
        industry: 'robotics',
        focus_areas: 'Autonomous systems, Military robotics, Drone technology',
        location: 'Austin, TX',
        description: 'Developing autonomous robotic systems for military and defense applications.',
        contact_name: 'Maria Santos',
        contact_email: `maria.santos.test.${Date.now()}@example.com`,
        contact_phone: '555-201-3003',
        employee_count: '201-500',
        founded_year: '2016',
        linkedin: 'https://linkedin.com/company/tactical-robotics',
        twitter: 'https://twitter.com/tacticalrobotics',
        facebook: 'https://facebook.com/tacticalrobotics',
        logo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        status: 'pending'
      },
      {
        name: 'SecureNet Defense',
        first_name: 'Thomas',
        last_name: 'Anderson',
        website: 'https://example.com/securenet',
        industry: 'cybersecurity',
        focus_areas: 'Network defense, Threat intelligence, Zero-trust architecture',
        location: 'Reston, VA',
        description: 'Specialized cybersecurity firm providing advanced network defense solutions.',
        contact_name: 'Thomas Anderson',
        contact_email: `thomas.anderson.test.${Date.now()}@example.com`,
        contact_phone: '555-201-3004',
        employee_count: '1-10',
        founded_year: '2022',
        linkedin: 'https://linkedin.com/company/securenet-defense',
        twitter: 'https://twitter.com/securenetdef',
        facebook: 'https://facebook.com/securenetdefense',
        logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
        status: 'pending'
      },
      {
        name: 'Advanced Materials Corp',
        first_name: 'Emily',
        last_name: 'Johnson',
        website: 'https://example.com/advmat',
        industry: 'defense',
        focus_areas: 'Advanced composites, Armor materials, Lightweight structures',
        location: 'Huntsville, AL',
        description: 'Research and development of advanced materials for defense and aerospace applications.',
        contact_name: 'Emily Johnson',
        contact_email: `emily.johnson.test.${Date.now()}@example.com`,
        contact_phone: '555-201-3005',
        employee_count: '51-200',
        founded_year: '2015',
        linkedin: 'https://linkedin.com/company/advanced-materials',
        twitter: 'https://twitter.com/advancedmat',
        facebook: 'https://facebook.com/advancedmaterials',
        logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
        status: 'pending'
      }
    ];

    for (const company of companies) {
      await supabase.from('company_submissions').insert([company]);
    }
  };

  const generateTestConsortiums = async () => {
    const consortiums = [
      {
        name: 'Defense Innovation Consortium',
        first_name: 'Patricia',
        last_name: 'Williams',
        website: 'https://example.com/dic',
        focus_area: 'Defense Innovation',
        government_partner: 'Department of Defense',
        established_year: '2019',
        eligibility_criteria: 'Open to defense contractors, technology companies, and research institutions.',
        description: 'Collaborative network bringing together defense contractors and research institutions to accelerate innovation.',
        contact_name: 'Patricia Williams',
        contact_email: `patricia.williams.test.${Date.now()}@example.com`,
        contact_phone: '555-301-4001',
        membership_fee: '$10,000/year',
        headquarters: 'Washington, DC',
        logo_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Cyber Defense Alliance',
        first_name: 'Mark',
        last_name: 'Davis',
        website: 'https://example.com/cda',
        focus_area: 'Cybersecurity',
        government_partner: 'US Army Cyber Command',
        established_year: '2020',
        eligibility_criteria: 'Cybersecurity firms and defense contractors with active security clearances.',
        description: 'Alliance of cybersecurity companies working to enhance defense against cyber threats.',
        contact_name: 'Mark Davis',
        contact_email: `mark.davis.test.${Date.now()}@example.com`,
        contact_phone: '555-301-4002',
        membership_fee: '$15,000/year',
        headquarters: 'Colorado Springs, CO',
        logo_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Space Technology Consortium',
        first_name: 'Rachel',
        last_name: 'Lee',
        website: 'https://example.com/stc',
        focus_area: 'Space Technology',
        government_partner: 'Space Force',
        established_year: '2021',
        eligibility_criteria: 'Companies and organizations involved in space technology development.',
        description: 'Consortium focused on advancing space technologies for national security applications.',
        contact_name: 'Rachel Lee',
        contact_email: `rachel.lee.test.${Date.now()}@example.com`,
        contact_phone: '555-301-4003',
        membership_fee: '$12,000/year',
        headquarters: 'Houston, TX',
        logo_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Maritime Defense Network',
        first_name: 'James',
        last_name: 'Wilson',
        website: 'https://example.com/mdn',
        focus_area: 'Maritime Defense',
        government_partner: 'US Navy',
        established_year: '2018',
        eligibility_criteria: 'Naval contractors and maritime technology developers.',
        description: 'Network of companies specializing in naval and maritime defense technologies.',
        contact_name: 'James Wilson',
        contact_email: `james.wilson.test.${Date.now()}@example.com`,
        contact_phone: '555-301-4004',
        membership_fee: '$8,000/year',
        headquarters: 'San Diego, CA',
        logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Advanced Manufacturing Coalition',
        first_name: 'Susan',
        last_name: 'Brown',
        website: 'https://example.com/amc',
        focus_area: 'Advanced Manufacturing',
        government_partner: 'Defense Logistics Agency',
        established_year: '2017',
        eligibility_criteria: 'Manufacturing companies serving defense and government markets.',
        description: 'Coalition of advanced manufacturing companies supporting defense supply chain innovation.',
        contact_name: 'Susan Brown',
        contact_email: `susan.brown.test.${Date.now()}@example.com`,
        contact_phone: '555-301-4005',
        membership_fee: '$5,000/year',
        headquarters: 'Detroit, MI',
        logo_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
        status: 'pending'
      }
    ];

    for (const consortium of consortiums) {
      await supabase.from('consortium_submissions').insert([consortium]);
    }
  };

  const generateTestInnovations = async () => {
    const innovations = [
      {
        name: 'Quantum Research Lab',
        first_name: 'Dr. Alice',
        last_name: 'Cooper',
        website: 'https://example.com/quantumlab',
        type: 'research_lab',
        focus_areas: 'Quantum computing, Cryptography, Quantum sensors',
        established_year: '2020',
        funding_source: 'government',
        description: 'Leading research laboratory specializing in quantum technologies for defense applications.',
        contact_name: 'Dr. Alice Cooper',
        contact_email: `alice.cooper.test.${Date.now()}@example.com`,
        contact_phone: '555-401-5001',
        primary_sponsor: 'DARPA',
        headquarters: 'Cambridge, MA',
        location: [-71.0942, 42.3601],
        logo_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'AI Defense Innovation Center',
        first_name: 'Dr. Kevin',
        last_name: 'Zhang',
        website: 'https://example.com/aidefense',
        type: 'innovation_center',
        focus_areas: 'Artificial Intelligence, Machine Learning, Computer Vision',
        established_year: '2019',
        funding_source: 'mixed',
        description: 'Innovation center focused on developing AI solutions for defense and national security.',
        contact_name: 'Dr. Kevin Zhang',
        contact_email: `kevin.zhang.test.${Date.now()}@example.com`,
        contact_phone: '555-401-5002',
        primary_sponsor: 'Defense Innovation Unit',
        headquarters: 'Palo Alto, CA',
        location: [-122.1430, 37.4419],
        logo_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Biodefense Research Institute',
        first_name: 'Dr. Michelle',
        last_name: 'Taylor',
        website: 'https://example.com/biodefense',
        type: 'government_lab',
        focus_areas: 'Biodefense, Medical countermeasures, Threat detection',
        established_year: '2015',
        funding_source: 'government',
        description: 'Government research institute developing biodefense technologies and medical countermeasures.',
        contact_name: 'Dr. Michelle Taylor',
        contact_email: `michelle.taylor.test.${Date.now()}@example.com`,
        contact_phone: '555-401-5003',
        primary_sponsor: 'Department of Health and Human Services',
        headquarters: 'Atlanta, GA',
        location: [-84.3880, 33.7490],
        logo_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Hypersonics Technology Lab',
        first_name: 'Dr. Carlos',
        last_name: 'Rodriguez',
        website: 'https://example.com/hypersonics',
        type: 'university_lab',
        focus_areas: 'Hypersonic vehicles, Propulsion systems, Aerodynamics',
        established_year: '2018',
        funding_source: 'academic',
        description: 'University laboratory researching hypersonic technologies for defense applications.',
        contact_name: 'Dr. Carlos Rodriguez',
        contact_email: `carlos.rodriguez.test.${Date.now()}@example.com`,
        contact_phone: '555-401-5004',
        primary_sponsor: 'Air Force Research Laboratory',
        headquarters: 'Wright-Patterson AFB, OH',
        location: [-84.0467, 39.8283],
        logo_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Autonomous Systems Institute',
        first_name: 'Dr. Linda',
        last_name: 'Chang',
        website: 'https://example.com/autonomous',
        type: 'nonprofit',
        focus_areas: 'Autonomous vehicles, Swarm robotics, Decision algorithms',
        established_year: '2021',
        funding_source: 'nonprofit',
        description: 'Nonprofit institute advancing autonomous systems research for defense and civilian applications.',
        contact_name: 'Dr. Linda Chang',
        contact_email: `linda.chang.test.${Date.now()}@example.com`,
        contact_phone: '555-401-5005',
        primary_sponsor: 'National Science Foundation',
        headquarters: 'Seattle, WA',
        location: [-122.3321, 47.6062],
        logo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop',
        status: 'pending'
      }
    ];

    for (const innovation of innovations) {
      await supabase.from('innovation_submissions').insert([innovation]);
    }
  };

  const generateTestNewsletterSubscribers = async () => {
    const subscribers = [
      {
        first_name: 'John',
        last_name: 'Smith',
        email: `john.smith.newsletter.${Date.now()}@example.com`,
        notify_ceo: true,
        status: 'pending'
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
        email: `jane.doe.newsletter.${Date.now()}@example.com`,
        notify_ceo: true,
        status: 'approved'
      },
      {
        first_name: 'Michael',
        last_name: 'Johnson',
        email: `michael.johnson.newsletter.${Date.now()}@example.com`,
        notify_ceo: false,
        status: 'pending'
      },
      {
        first_name: 'Sarah',
        last_name: 'Williams',
        email: `sarah.williams.newsletter.${Date.now()}@example.com`,
        notify_ceo: true,
        status: 'approved'
      },
      {
        first_name: 'Robert',
        last_name: 'Brown',
        email: `robert.brown.newsletter.${Date.now()}@example.com`,
        notify_ceo: true,
        status: 'pending'
      }
    ];

    for (const subscriber of subscribers) {
      await supabase.from('newsletter_subscribers').insert([subscriber]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold">Generate Test Data</h3>
        <div className="text-sm text-gray-500">
          Create realistic test data to experiment with admin features
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
            onClick={generateTestData}
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-bhred hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bhred disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generating Test Data...
              </>
            ) : (
              <>
                <Database className="w-5 h-5 mr-2" />
                Generate 5 Test Items for Each Category
              </>
            )}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            This will create 5 realistic test entries for each category with test images
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium">Advisors</h4>
            <p className="text-sm text-gray-600">Military experts with headshots & business logos</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <Calendar className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium">Events</h4>
            <p className="text-sm text-gray-600">Defense conferences with event logos</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <Building className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium">Companies</h4>
            <p className="text-sm text-gray-600">Defense contractors with logos & product images</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <Rocket className="w-6 h-6 text-red-600 mb-2" />
            <h4 className="font-medium">Consortiums</h4>
            <p className="text-sm text-gray-600">Industry groups with consortium logos</p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <Brain className="w-6 h-6 text-amber-600 mb-2" />
            <h4 className="font-medium">Innovation Labs</h4>
            <p className="text-sm text-gray-600">Research centers with organization logos</p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <Mail className="w-6 h-6 text-indigo-600 mb-2" />
            <h4 className="font-medium">Newsletter</h4>
            <p className="text-sm text-gray-600">Email subscribers for testing</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Test Data Features:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Realistic company names, contact info, and descriptions</li>
            <li>• Test images for logos, product photos, and headshots</li>
            <li>• Complete address information for mapping testing</li>
            <li>• Variety of industries, focus areas, and organization types</li>
            <li>• All submissions start as "pending" for approval testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestDataGenerator;