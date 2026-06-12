import React from 'react';
import { MapPin, Eye, Mail, CheckCircle2 } from 'lucide-react';
import { Property, ListingStatus } from '../types';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="w-full bg-white border border-surface-container-highest rounded-xl overflow-hidden hover:shadow-xl transition-all group flex flex-col"
  >
    <div className="h-48 w-full bg-surface-dim relative overflow-hidden">
      <img 
        src={property.image} 
        alt={property.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className={`absolute top-4 left-4 ${property.status === ListingStatus.ACTIVE ? 'bg-secondary' : 'bg-surface-tint'} text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider`}>
        {property.status}
      </div>
      {property.tenant && (
        <div className="absolute bottom-0 left-0 w-full bg-primary/60 backdrop-blur-md py-1.5 px-3">
          <span className="text-[11px] text-white font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> Loué à {property.tenant}
          </span>
        </div>
      )}
    </div>
    
    <div className="p-5 flex-1 flex flex-col justify-between">
      <div>
        <h4 className="text-lg font-bold text-primary mb-1 truncate">{property.title}</h4>
        <p className="text-sm text-on-surface-variant flex items-center gap-1">
          <MapPin size={14} className="text-secondary" /> {property.location}
        </p>
      </div>
      
      <div className="flex gap-6 mt-5 pt-4 border-t border-surface-container">
        <div className="flex flex-col">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Vues (30j)</span>
          <span className="text-lg font-bold text-primary flex items-center gap-1">
            <Eye size={16} className="text-secondary" /> {property.views}
          </span>
        </div>
        <div className="flex flex-col border-l border-surface-container pl-6">
          <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Demandes</span>
          <span className="text-lg font-bold text-primary flex items-center gap-1">
            <Mail size={16} className="text-secondary" /> {property.requests}
          </span>
        </div>
      </div>
      
      <Link 
        to={`/edit/${property.id}`}
        className="mt-4 text-center py-2 text-secondary font-bold text-sm border border-secondary/20 rounded-lg hover:bg-secondary/5 transition-colors"
      >
        Modifier l'annonce
      </Link>
    </div>
  </motion.div>
);
