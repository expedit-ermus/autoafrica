'use client';

import React, { useState } from 'react';
import Modal from '@/components/Modal';
import { useToast } from '@/contexts/ToastContext';

interface StockAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  productReference?: string;
}

export default function StockAlertModal({
  isOpen,
  onClose,
  productTitle,
  productReference,
}: StockAlertModalProps) {
  const { addToast } = useToast();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      addToast('error', 'Veuillez saisir votre numéro de téléphone ou email.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      addToast('success', `Alerte réassort enregistrée pour "${productTitle}" ! Vous recevrez une notification dès sa disponibilité.`);
      setPhoneOrEmail('');
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔔 Alerte Réassort / Stock" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-3.5">
          <p className="text-xs font-bold text-orange-900">{productTitle}</p>
          {productReference && <p className="text-[11px] text-orange-700 mt-0.5">Réf : {productReference}</p>}
          <p className="text-xs text-orange-800 mt-2">
            Soyez averti en priorité dès que ce produit est remis en stock ou disponible chez un fournisseur partenaire.
          </p>
        </div>

        <div>
          <label htmlFor="contactInfo" className="block text-xs font-bold text-gray-700 uppercase mb-1">
            Votre Numéro Téléphone (SMS / WhatsApp) ou Email :
          </label>
          <input
            id="contactInfo"
            type="text"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
            placeholder="+225 07 08 09 10 11 ou email@exemple.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
        >
          {submitting ? 'Enregistrement...' : '🔔 M\'alerter dès disponibilité'}
        </button>
      </form>
    </Modal>
  );
}
