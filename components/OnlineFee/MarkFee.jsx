'use client';
import React, { useState, useEffect } from 'react';
import { markStudentFee } from '../../api/fees';

export default function PayFeeModal({
  open,
  onClose,
  onSubmit,
  paymentModes = [],
  selectedFee,
  context,

}) {
  console.log('selectedFee----', selectedFee);

  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset fields when modal opens
  useEffect(() => {
    if (open) {
      setPaymentDate('');
      setPaymentMode('');
      setAmount('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);

    const payload = {
      fee_ids: selectedFee?.id,
      payment_mode_id: paymentMode,
      amount: Number(amount)
    };

    try {
      // Actual API call
      console.log('============================', context?.profileId, context?.session, payload);
      const resp = await markStudentFee(context?.profileId, context?.session, payload);
      console.log('resp==================', resp);

      // onSubmit?.(resp); // send response back to parent
      // onClose?.();

    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Try again.');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Pay Fee</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Date
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={e => setPaymentDate(e.target.value)}
              className="w-full rounded-lg border p-2 text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Mode of Payment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode of Payment
            </label>
            <select
              value={paymentMode}
              onChange={e => setPaymentMode(e.target.value)}
              className="w-full rounded-lg border p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select mode</option>
              {paymentModes.map(mode => (
                <option key={mode.id} value={mode.id}>
                  {mode.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full rounded-lg border p-2 text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              min={1}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full rounded-xl bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 shadow-sm disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}
