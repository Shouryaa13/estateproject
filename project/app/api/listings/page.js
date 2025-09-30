'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";


export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listings');
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading listings...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Property Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((property) => (
          <div
            key={property.id}
            className="border rounded-xl shadow p-4 bg-white"
          >
           <Image
  src={property?.imageUrl || '/placeholder.png'}
  alt={property?.title || "Property Image"}
  width={400}
  height={250}
  className="w-full h-40 object-cover rounded-lg mb-3"
/>

            <h2 className="text-xl font-semibold">{property.title}</h2>
            <p className="text-gray-600">{property.location}</p>
            <p className="font-bold text-lg mt-2">₹ {property.price}</p>
            <button
              onClick={() => alert(`Book visit for ${property.title}`)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Book Visit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
