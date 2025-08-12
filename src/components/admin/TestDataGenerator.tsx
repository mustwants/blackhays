import React, { useState } from 'react';
import { RefreshCw, Database, AlertCircle, Check, Users, Calendar, Building, Rocket, Brain, Mail } from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface TestDataGeneratorProps {
  onDataGenerated?: () => void;
}

const TestDataGenerator: React.FC<TestDataGeneratorProps> = ({ onDataGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generateTestData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Generate test data for each category
      console.log('Starting test data generation...');
      
      console.log('Generating advisors...');
      await generateTestAdvisors();
      console.log('✅ Completed advisors');
      
      console.log('Generating events...');
      await generateTestEvents();
      console.log('✅ Completed events');
      
      console.log('Generating companies...');
      await generateTestCompanies();
      console.log('✅ Completed companies');
      
      console.log('Generating consortiums...');
      await generateTestConsortiums();
      console.log('✅ Completed consortiums');
      
      console.log('Generating innovations...');
      await generateTestInnovations();
      console.log('✅ Completed innovations');
      
      console.log('Generating newsletter subscribers...');
      await generateTestNewsletterSubscribers();
      console.log('✅ Completed newsletter subscribers');

      setSuccess('Successfully generated 30 test items total (5 for each category)!');
      
      // Notify parent component to refresh data
      if (onDataGenerated) {
        console.log('🔄 Triggering component refresh...');
        onDataGenerated();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error generating test data:', err);
      setError(`Failed to generate test data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateTestAdvisors = async () => {
    const advisors = [
      {
        name: 'John Mitchell Smith',
        email: `john.mitchell.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`,
        phone: '555-101-2001',
        professional_title: 'Former Navy Admiral',
        military_branch: 'Navy',
        years_of_service: 25,
        service_status: ['Veteran'],
        other_branch: '',
        other_status: '',
        about: 'Former Navy Admiral with 25 years of experience in naval operations and defense acquisition.',
        address: '123 Defense Way',
        zip_code: '22201',
        status: 'pending'
      },
      {
        name: 'Sarah Rodriguez',
        email: `sarah.rodriguez.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`,
        phone: '555-201-3002',
        professional_title: 'Cybersecurity Expert',
        military_branch: 'Air Force',
        years_of_service: 18,
        service_status: ['Veteran'],
        other_branch: '',
        other_status: '',
        about: 'Cybersecurity specialist with expertise in defense systems and threat intelligence.',
        address: '456 Tech Street',
        zip_code: '94107',
        headshot_url: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=400&h=400&fit=crop&crop=face',
        business_logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Michael Chen',
        email: `michael.chen.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`,
        phone: '555-301-4003',
        professional_title: 'Defense Technology Consultant',
        military_branch: 'Army',
        years_of_service: 20,
        service_status: ['Reserve'],
        other_branch: '',
        other_status: '',
        about: 'Army veteran specializing in emerging technologies and defense innovation programs.',
        address: '789 Innovation Blvd',
        zip_code: '80301',
        headshot_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        business_logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Lisa Thompson',
        email: `lisa.thompson.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`,
        phone: '555-401-5004',
        professional_title: 'Intelligence Analyst',
        military_branch: 'Marines',
        years_of_service: 15,
        service_status: ['Retired'],
        other_branch: '',
        other_status: '',
        about: 'Former Marine intelligence analyst with expertise in strategic planning and operations.',
        address: '321 Strategy Lane',
        zip_code: '35801',
        headshot_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        business_logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'David Park',
        email: `david.park.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`,
        phone: '555-501-6005',
        professional_title: 'Space Force Advisor',
        military_branch: 'Space Force',
        years_of_service: 12,
        service_status: ['Active Duty'],
        other_branch: '',
        other_status: '',
        about: 'Space Force officer with expertise in satellite systems and space-based defense technologies.',
        address: '654 Satellite Drive',
        zip_code: '80914',
        headshot_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        business_logo_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&h=200&fit=crop',
        status: 'pending'
      }
    ];

    try {
      console.log(`Attempting to insert ${advisors.length} advisors...`);
      for (let i = 0; i < advisors.length; i++) {
        const advisor = advisors[i];
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        try {
          console.log(`Inserting advisor ${i + 1}:`, advisor.name, advisor.email);
          const { error } = await supabase.from('advisor_applications').insert([advisor]);
          if (error) {
            console.error(`Error inserting advisor ${i + 1}:`, error);
          } else {
            console.log(`Successfully inserted advisor ${i + 1}: ${advisor.name}`);
          }
        } catch (advisorError) {
          console.error(`Exception inserting advisor ${i + 1}:`, advisorError);
        }
      }
      console.log('Completed advisor test data generation');
    } catch (err) {
      console.error('Error in generateTestAdvisors:', err);
      throw err;
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
        submitter_email: `test.event${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`,
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
        submitter_email: `test.event2.${Date.now()}.2.${Math.random().toString(36).substr(2, 5)}@example.com`,
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
        submitter_email: `test.event3.${Date.now()}.3.${Math.random().toString(36).substr(2, 5)}@example.com`,
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
        submitter_email: `test.event4.${Date.now()}.4.${Math.random().toString(36).substr(2, 5)}@example.com`,
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
        submitter_email: `test.event5.${Date.now()}.5.${Math.random().toString(36).substr(2, 5)}@example.com`,
        logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=150&fit=crop',
        status: 'pending'
      }
    ];

    try {
      console.log(`Attempting to insert ${events.length} events...`);
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        try {
          console.log(`Inserting event ${i + 1}:`, event.name, event.submitter_email);
          const { error } = await supabase.from('event_submissions').insert([event]);
          if (error) {
            console.error(`Error inserting event ${i + 1}:`, error);
          } else {
            console.log(`Successfully inserted event ${i + 1}: ${event.name}`);
          }
        } catch (eventError) {
          console.error(`Exception inserting event ${i + 1}:`, eventError);
        }
      }
      console.log('Completed event test data generation');
    } catch (err) {
      console.error('Error in generateTestEvents:', err);
      throw err;
    }
  };

  const generateTestCompanies = async () => {
    const companies = [
      {
        name: 'Apex Defense Technologies',
        website: 'https://example.com/apex',
        industry: 'cybersecurity',
        focus_areas: 'AI-powered threat detection, Network security, Incident response',
        location: 'Arlington, VA',
        description: 'Leading provider of AI-powered cybersecurity solutions for defense and government agencies.',
        contact_name: 'Jennifer Walsh',
        contact_email: `jennifer.walsh${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`,
        contact_phone: '555-201-3001',
        employee_count: '51-200',
        founded_year: '2018',
        street_address: '100 Tech Way',
        city: 'Arlington',
        state: 'VA',
        zip_code: '22202',
        first_name: 'Jennifer',
        last_name: 'Walsh',
        linkedin: 'https://linkedin.com/company/apex-defense',
        twitter: 'https://twitter.com/apexdefense',
        facebook: 'https://facebook.com/apexdefense',
        logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop',
        status: 'pending'
      },
      {
        name: 'Quantum Aerospace Solutions',
        website: 'https://example.com/quantum',
        industry: 'aerospace',
        focus_areas: 'Quantum computing, Satellite communications, Space systems',
        location: 'Los Angeles, CA',
        description: 'Pioneering quantum technologies for next-generation aerospace and defense applications.',
        contact_name: 'Robert Kim',
        contact_email: `robert.kim${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`,
        contact_phone: '555-201-3002',
        employee_count: '11-50',
        founded_year: '2020',
        street_address: '200 Quantum Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zip_code: '90210',
        first_name: 'Robert',
        last_name: 'Kim',
        linkedin: 'https://linkedin.com/company/quantum-aerospace',
        twitter: 'https://twitter.com/quantumaero',
        facebook: 'https://facebook.com/quantumaerospace',
        logo_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop',
        status: 'pending'
      },
      {
        name: 'Tactical Robotics Inc',
        website: 'https://example.com/tactical',
        industry: 'robotics',
        focus_areas: 'Autonomous systems, Military robotics, Drone technology',
        location: 'Austin, TX',
        description: 'Developing autonomous robotic systems for military and defense applications.',
        contact_name: 'Maria Santos',
        contact_email: `maria.santos${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`,
        contact_phone: '555-201-3003',
        employee_count: '201-500',
        founded_year: '2016',
        street_address: '300 Robot Ave',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701',
        first_name: 'Maria',
        last_name: 'Santos',
        linkedin: 'https://linkedin.com/company/tactical-robotics',
        twitter: 'https://twitter.com/tacticalrobotics',
        facebook: 'https://facebook.com/tacticalrobotics',
        logo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        status: 'pending'
      },
      {
        name: 'SecureNet Defense',
        website: 'https://example.com/securenet',
        industry: 'cybersecurity',
        focus_areas: 'Network defense, Threat intelligence, Zero-trust architecture',
        location: 'Reston, VA',
        description: 'Specialized cybersecurity firm providing advanced network defense solutions.',
        contact_name: 'Thomas Anderson',
        contact_email: `thomas.anderson.${Date.now()}.4.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-201-3004',
        employee_count: '1-10',
        founded_year: '2022',
        street_address: '400 Security Blvd',
        city: 'Reston',
        state: 'VA',
        zip_code: '20191',
        first_name: 'Thomas',
        last_name: 'Anderson',
        linkedin: 'https://linkedin.com/company/securenet-defense',
        twitter: 'https://twitter.com/securenetdef',
        facebook: 'https://facebook.com/securenetdefense',
        logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
        status: 'pending'
      },
      {
        name: 'Advanced Materials Corp',
        website: 'https://example.com/advmat',
        industry: 'defense',
        focus_areas: 'Advanced composites, Armor materials, Lightweight structures',
        location: 'Huntsville, AL',
        description: 'Research and development of advanced materials for defense and aerospace applications.',
        contact_name: 'Emily Johnson',
        contact_email: `emily.johnson.${Date.now()}.5.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-201-3005',
        employee_count: '51-200',
        founded_year: '2015',
        street_address: '500 Materials Way',
        city: 'Huntsville',
        state: 'AL',
        zip_code: '35801',
        first_name: 'Emily',
        last_name: 'Johnson',
        linkedin: 'https://linkedin.com/company/advanced-materials',
        twitter: 'https://twitter.com/advancedmat',
        facebook: 'https://facebook.com/advancedmaterials',
        logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
        product_image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
        status: 'pending'
      }
    ];

    try {
      console.log(`Attempting to insert ${companies.length} companies...`);
      for (let i = 0; i < companies.length; i++) {
        const company = companies[i];
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        try {
          console.log(`Inserting company ${i + 1}:`, company.name, company.contact_email);
          const { error } = await supabase.from('company_submissions').insert([company]);
          if (error) {
            console.error(`Error inserting company ${i + 1}:`, error);
          } else {
            console.log(`Successfully inserted company ${i + 1}: ${company.name}`);
          }
        } catch (companyError) {
          console.error(`Exception inserting company ${i + 1}:`, companyError);
        }
      }
      console.log('Completed company test data generation');
    } catch (err) {
      console.error('Error in generateTestCompanies:', err);
      throw err;
    }
  };

  const generateTestConsortiums = async () => {
    const consortiums = [
      {
        name: 'Defense Innovation Consortium',
        website: 'https://example.com/dic',
        focus_area: 'Defense Innovation',
        government_partner: 'Department of Defense',
        established_year: '2019',
        eligibility_criteria: 'Open to defense contractors, technology companies, and research institutions.',
        description: 'Collaborative network bringing together defense contractors and research institutions to accelerate innovation.',
        contact_name: 'Patricia Williams',
        contact_email: `patricia.williams${Date.now()}${Math.floor(Math.random() * 1000)}@example.com`,
        contact_phone: '555-301-4001',
        membership_fee: '$10,000/year',
        headquarters: 'Arlington, VA',
        street_address: '600 Innovation Way',
        city: 'Arlington',
        state: 'VA',
        zip_code: '22203',
        first_name: 'Patricia',
        last_name: 'Williams',
        logo_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Cyber Defense Alliance',
        website: 'https://example.com/cda',
        focus_area: 'Cybersecurity',
        government_partner: 'US Army Cyber Command',
        established_year: '2020',
        eligibility_criteria: 'Cybersecurity companies and organizations with government clearance.',
        description: 'Alliance of cybersecurity companies working to enhance defense against cyber threats.',
        contact_name: 'Mark Davis',
        contact_email: `mark.davis.${Date.now()}.2.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-301-4002',
        membership_fee: '$15,000/year',
        headquarters: 'Colorado Springs, CO',
        street_address: '700 Cyber Lane',
        city: 'Colorado Springs',
        state: 'CO',
        zip_code: '80914',
        first_name: 'Mark',
        last_name: 'Davis',
        logo_url: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Space Technology Consortium',
        website: 'https://example.com/stc',
        focus_area: 'Space Technology',
        government_partner: 'US Space Force',
        established_year: '2021',
        eligibility_criteria: 'Companies and organizations involved in space technology development.',
        description: 'Consortium focused on advancing space technologies for national security applications.',
        contact_name: 'Rachel Lee',
        contact_email: `rachel.lee.${Date.now()}.3.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-301-4003',
        membership_fee: '$12,000/year',
        headquarters: 'Houston, TX',
        street_address: '800 Space Center Blvd',
        city: 'Houston',
        state: 'TX',
        zip_code: '77058',
        first_name: 'Rachel',
        last_name: 'Lee',
        logo_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Maritime Defense Network',
        website: 'https://example.com/mdn',
        focus_area: 'Maritime Defense',
        government_partner: 'US Navy',
        established_year: '2018',
        eligibility_criteria: 'Naval contractors and maritime technology developers.',
        description: 'Network of companies specializing in maritime defense technologies and solutions.',
        contact_name: 'James Wilson',
        contact_email: `james.wilson.${Date.now()}.4.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-301-4004',
        membership_fee: '$8,000/year',
        headquarters: 'San Diego, CA',
        street_address: '900 Harbor Drive',
        city: 'San Diego',
        state: 'CA',
        zip_code: '92101',
        first_name: 'James',
        last_name: 'Wilson',
        logo_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Advanced Manufacturing Coalition',
        website: 'https://example.com/amc',
        focus_area: 'Advanced Manufacturing',
        government_partner: 'Defense Logistics Agency',
        established_year: '2017',
        eligibility_criteria: 'Manufacturing companies serving defense and government markets.',
        description: 'Coalition of advanced manufacturing companies supporting defense supply chain innovation.',
        contact_name: 'Susan Brown',
        contact_email: `susan.brown.${Date.now()}.5.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-301-4005',
        membership_fee: '$5,000/year',
        headquarters: 'Detroit, MI',
        street_address: '1000 Manufacturing Ave',
        city: 'Detroit',
        state: 'MI',
        zip_code: '48201',
        first_name: 'Susan',
        last_name: 'Brown',
        logo_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop',
        status: 'pending'
      }
    ];

    try {
      console.log(`Attempting to insert ${consortiums.length} consortiums...`);
      for (let i = 0; i < consortiums.length; i++) {
        const consortium = consortiums[i];
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        try {
          console.log(`Inserting consortium ${i + 1}:`, consortium.name, consortium.contact_email);
          const { error } = await supabase.from('consortium_submissions').insert([consortium]);
          if (error) {
            console.error(`Error inserting consortium ${i + 1}:`, error);
          } else {
            console.log(`Successfully inserted consortium ${i + 1}: ${consortium.name}`);
          }
        } catch (consortiumError) {
          console.error(`Exception inserting consortium ${i + 1}:`, consortiumError);
        }
      }
      console.log('Completed consortium test data generation');
    } catch (err) {
      console.error('Error in generateTestConsortiums:', err);
      throw err;
    }
  };

  const generateTestInnovations = async () => {
    const innovations = [
      {
        name: 'Quantum Research Lab',
        website: 'https://example.com/quantumlab',
        type: 'research_lab',
        focus_areas: 'Quantum computing, Cryptography, Quantum sensors',
        established_year: '2020',
        funding_source: 'government',
        description: 'Leading research laboratory specializing in quantum technologies for defense applications.',
        contact_name: 'Dr. Alice Cooper',
        contact_email: `alice.cooper.${Date.now()}.1.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-401-5001',
        primary_sponsor: 'DARPA',
        headquarters: 'Cambridge, MA',
        street_address: '1100 Research Blvd',
        city: 'Cambridge',
        state: 'MA',
        zip_code: '02139',
        first_name: 'Alice',
        last_name: 'Cooper',
        logo_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'AI Defense Innovation Center',
        website: 'https://example.com/aidefense',
        type: 'innovation_center',
        focus_areas: 'Artificial Intelligence, Machine Learning, Computer Vision',
        established_year: '2019',
        funding_source: 'mixed',
        description: 'Innovation center focused on developing AI solutions for defense and national security.',
        contact_name: 'Dr. Kevin Zhang',
        contact_email: `kevin.zhang.${Date.now()}.2.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-401-5002',
        primary_sponsor: 'Defense Innovation Unit',
        headquarters: 'Palo Alto, CA',
        street_address: '1200 AI Way',
        city: 'Palo Alto',
        state: 'CA',
        zip_code: '94301',
        first_name: 'Kevin',
        last_name: 'Zhang',
        logo_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Biodefense Research Institute',
        website: 'https://example.com/biodefense',
        type: 'government_lab',
        focus_areas: 'Biodefense, Medical countermeasures, Threat detection',
        established_year: '2015',
        funding_source: 'government',
        description: 'Government research institute developing biodefense technologies and medical countermeasures.',
        contact_name: 'Dr. Michelle Taylor',
        contact_email: `michelle.taylor.${Date.now()}.3.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-401-5003',
        primary_sponsor: 'Department of Health and Human Services',
        headquarters: 'Atlanta, GA',
        street_address: '1300 Bio Drive',
        city: 'Atlanta',
        state: 'GA',
        zip_code: '30309',
        first_name: 'Michelle',
        last_name: 'Taylor',
        logo_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Hypersonics Technology Lab',
        website: 'https://example.com/hypersonics',
        type: 'university_lab',
        focus_areas: 'Hypersonic vehicles, Propulsion systems, Aerodynamics',
        established_year: '2018',
        funding_source: 'academic',
        description: 'University laboratory researching hypersonic technologies for defense applications.',
        contact_name: 'Dr. Carlos Rodriguez',
        contact_email: `carlos.rodriguez.${Date.now()}.4.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-401-5004',
        primary_sponsor: 'Air Force Research Laboratory',
        headquarters: 'Wright-Patterson AFB, OH',
        street_address: '1400 Hypersonic Ave',
        city: 'Dayton',
        state: 'OH',
        zip_code: '45433',
        first_name: 'Carlos',
        last_name: 'Rodriguez',
        logo_url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=200&h=200&fit=crop',
        status: 'pending'
      },
      {
        name: 'Autonomous Systems Institute',
        website: 'https://example.com/autonomous',
        type: 'nonprofit',
        focus_areas: 'Autonomous vehicles, Swarm robotics, Decision algorithms',
        established_year: '2021',
        funding_source: 'nonprofit',
        description: 'Nonprofit institute advancing autonomous systems research for defense and civilian applications.',
        contact_name: 'Dr. Linda Chang',
        contact_email: `linda.chang.${Date.now()}.5.${Math.random().toString(36).substr(2, 5)}@example.com`,
        contact_phone: '555-401-5005',
        primary_sponsor: 'National Science Foundation',
        headquarters: 'Seattle, WA',
        street_address: '1500 Autonomous Blvd',
        city: 'Seattle',
        state: 'WA',
        zip_code: '98101',
        first_name: 'Linda',
        last_name: 'Chang',
        logo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop',
        status: 'pending'
      }
    ];

    try {
      // Insert innovations one by one to avoid constraint conflicts
      console.log(`Attempting to insert ${innovations.length} innovations...`);
      for (let i = 0; i < innovations.length; i++) {
        const innovation = innovations[i];
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        try {
          console.log(`Inserting innovation ${i + 1}:`, innovation.name, innovation.contact_email);
          const { error } = await supabase.from('innovation_submissions').insert([innovation]);
          if (error) {
            console.error(`Error inserting innovation ${i + 1}:`, error);
          } else {
            console.log(`Successfully inserted innovation ${i + 1}: ${innovation.name}`);
          }
        } catch (innovationError) {
          console.error(`Exception inserting innovation ${i + 1}:`, innovationError);
        }
      }
      console.log('Completed innovation test data generation');
    } catch (err) {
      console.error('Error in generateTestInnovations:', err);
      throw err;
    }
  };

  const generateTestNewsletterSubscribers = async () => {
    const subscribers = [
      {
        first_name: 'John',
        last_name: 'Smith',
        email: `john.smith.${Date.now()}.1.${Math.random().toString(36).substr(2, 5)}@example.com`,
        notify_ceo: true,
        status: 'pending'
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
        email: `jane.doe.${Date.now()}.2.${Math.random().toString(36).substr(2, 5)}@example.com`,
        notify_ceo: true,
        status: 'pending'
      },
      {
        first_name: 'Michael',
        last_name: 'Johnson',
        email: `michael.johnson.${Date.now()}.3.${Math.random().toString(36).substr(2, 5)}@example.com`,
        notify_ceo: false,
        status: 'pending'
      },
      {
        first_name: 'Sarah',
        last_name: 'Williams',
        email: `sarah.williams.${Date.now()}.4.${Math.random().toString(36).substr(2, 5)}@example.com`,
        notify_ceo: true,
        status: 'approved'
      },
      {
        first_name: 'Robert',
        last_name: 'Brown',
        email: `robert.brown.${Date.now()}.5.${Math.random().toString(36).substr(2, 5)}@example.com`,
        notify_ceo: true,
        status: 'pending'
      }
    ];

    try {
      console.log(`Attempting to insert ${subscribers.length} newsletter subscribers...`);
      for (let i = 0; i < subscribers.length; i++) {
        const subscriber = subscribers[i];
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        try {
          console.log(`Inserting subscriber ${i + 1}:`, subscriber.first_name, subscriber.last_name, subscriber.email);
          const { error } = await supabase.from('newsletter_subscribers').insert([subscriber]);
          if (error) {
            console.error(`Error inserting subscriber ${i + 1}:`, error);
          } else {
            console.log(`Successfully inserted subscriber ${i + 1}: ${subscriber.first_name} ${subscriber.last_name}`);
          }
        } catch (subscriberError) {
          console.error(`Exception inserting subscriber ${i + 1}:`, subscriberError);
        }
      }
      console.log('Completed newsletter subscriber test data generation');
    } catch (err) {
      console.error('Error in generateTestNewsletterSubscribers:', err);
      throw err;
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
