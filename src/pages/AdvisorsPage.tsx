import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface Advisor {
  id: string;
  first_name: string;
  last_name: string;
  about: string;
  professional_title: string;
  military_branch: string;
}

const AdvisorsPage = () => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const { data, error } = await supabase
          .from('advisors')
          .select('id, first_name, last_name, about, professional_title, military_branch')
          .eq('status', 'approved')
          .order('last_name', { ascending: true });

        if (error) throw error;
        setAdvisors(data || []);
      } catch (err: any) {
        console.error('Error occurred:', err);
        setError(err.message);
        setAdvisors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvisors();
  }, []);

  if (loading) return <p>Loading advisors...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Approved Advisors</h1>
      {advisors.map((advisor) => (
        <div key={advisor.id} className="mb-3 p-4 border rounded">
          <h2 className="text-lg font-semibold">{advisor.first_name} {advisor.last_name}</h2>
          <p className="italic">{advisor.professional_title} — {advisor.military_branch}</p>
          <p className="mt-1">{advisor.about}</p>
        </div>
      ))}
    </div>
  );
};

export default AdvisorsPage;
