import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { getProducts } from '../../services/adminService';

export default function ProductInfo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getProducts().then((data) => {
      if (!cancelled) { setProducts(data.products || []); setLoading(false); }
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (<div key={n} className="h-24 bg-gray-100 rounded-xl animate-pulse" />))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 font-medium">No hay informacion de productos disponible.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} hover>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 mt-1.5 mb-2 tracking-wide uppercase">
                {product.category}
              </span>
              <p className="text-xs text-gray-500 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
