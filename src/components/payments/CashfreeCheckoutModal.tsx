import React, { useState } from 'react';
import { ICreateOrderResponse } from '../../types';
import { paymentsApi } from '../../api/paymentsApi';
import { formatCurrency } from '../../utils/formatters';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Lock as LockIcon,
  CreditCard as CardIcon,
  AccountBalance as NetbankingIcon,
  QrCode2 as UpiIcon,
  AccountBalanceWallet as WalletIcon,
  CheckCircle as CheckIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import toast from 'react-hot-toast';

interface ICashfreeCheckoutModalProps {
  open: boolean;
  order: ICreateOrderResponse | null;
  eventTitle: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const CashfreeCheckoutModal: React.FC<ICashfreeCheckoutModalProps> = ({
  open,
  order,
  eventTitle,
  onClose,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState<string>('user@okaxis');
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvv, setCardCvv] = useState<string>('882');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!order) return null;

  const handlePayNow = async () => {
    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. name@upi)');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Verify Payment & Fulfill Order in Nest Backend
      const res = await paymentsApi.verifyPayment(order.cfOrderId);

      if (res.success) {
        toast.success(`Payment of ${formatCurrency(order.amount)} successful via Cashfree! 🎉`);
        onPaymentSuccess();
      } else {
        toast.error(res.message || 'Payment processing failed.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Payment transaction failed. Please retry.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isProcessing ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className: 'bg-slate-900/95 backdrop-blur-2xl border border-white/10 text-slate-100 rounded-3xl overflow-hidden shadow-2xl',
      }}
    >
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldIcon className="text-emerald-200" />
          <div>
            <Typography variant="subtitle2" className="font-extrabold leading-none">
              Cashfree Payments
            </Typography>
            <Typography variant="caption" className="text-emerald-100 text-[11px]">
              256-Bit Encrypted Secure Checkout
            </Typography>
          </div>
        </div>
        <IconButton onClick={onClose} disabled={isProcessing} size="small" className="text-white hover:bg-white/20">
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <DialogContent className="p-5 space-y-4">
        {/* Order Amount Summary */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex justify-between items-center">
          <div>
            <Typography variant="caption" className="text-slate-400 block">
              Event Ticket Order
            </Typography>
            <Typography variant="subtitle2" className="font-bold text-white truncate max-w-[200px]">
              {eventTitle}
            </Typography>
            <Chip
              label={`${order.ticketQuantity} Ticket(s)`}
              size="small"
              className="bg-purple-500/20 text-purple-300 font-bold text-[10px] mt-1"
            />
          </div>
          <div className="text-right">
            <Typography variant="caption" className="text-slate-400 block">
              Total Amount
            </Typography>
            <Typography variant="h5" className="font-extrabold text-emerald-400">
              {formatCurrency(order.amount)}
            </Typography>
          </div>
        </div>

        {/* Payment Options */}
        <div>
          <Typography variant="caption" className="font-bold text-slate-300 block mb-2">
            Select Payment Method
          </Typography>

          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            className="space-y-2"
          >
            {/* UPI Option */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                paymentMethod === 'upi'
                  ? 'bg-purple-500/15 border-purple-500 text-white'
                  : 'bg-slate-950/40 border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio value="upi" color="secondary" size="small" />
                <UpiIcon className="text-purple-400" />
                <div>
                  <Typography variant="body2" className="font-bold">
                    UPI (Google Pay, PhonePe, Paytm)
                  </Typography>
                  <Typography variant="caption" className="text-slate-400 block text-[11px]">
                    Instant 1-Click Payment
                  </Typography>
                </div>
              </div>
              <Chip label="Popular" size="small" className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold" />
            </label>

            {/* Card Option */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'bg-purple-500/15 border-purple-500 text-white'
                  : 'bg-slate-950/40 border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio value="card" color="secondary" size="small" />
                <CardIcon className="text-indigo-400" />
                <div>
                  <Typography variant="body2" className="font-bold">
                    Credit / Debit Card
                  </Typography>
                  <Typography variant="caption" className="text-slate-400 block text-[11px]">
                    Visa, Mastercard, RuPay, Amex
                  </Typography>
                </div>
              </div>
            </label>

            {/* Netbanking Option */}
            <label
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                paymentMethod === 'netbanking'
                  ? 'bg-purple-500/15 border-purple-500 text-white'
                  : 'bg-slate-950/40 border-white/10 text-slate-300 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio value="netbanking" color="secondary" size="small" />
                <NetbankingIcon className="text-teal-400" />
                <div>
                  <Typography variant="body2" className="font-bold">
                    Netbanking
                  </Typography>
                  <Typography variant="caption" className="text-slate-400 block text-[11px]">
                    HDFC, ICICI, SBI, Axis, Kotak
                  </Typography>
                </div>
              </div>
            </label>
          </RadioGroup>
        </div>

        {/* Inputs depending on payment method */}
        {paymentMethod === 'upi' && (
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <Typography variant="caption" className="text-slate-300 font-bold block">
              Enter Virtual Payment Address (VPA / UPI ID)
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="username@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UpiIcon className="text-purple-400" fontSize="small" />
                  </InputAdornment>
                ),
                className: 'bg-slate-900 rounded-xl text-white font-bold text-sm',
              }}
            />
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 space-y-3">
            <TextField
              fullWidth
              size="small"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CardIcon className="text-indigo-400" fontSize="small" />
                  </InputAdornment>
                ),
                className: 'bg-slate-900 rounded-xl text-white font-bold text-sm',
              }}
            />
            <div className="flex gap-2">
              <TextField
                fullWidth
                size="small"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                InputProps={{ className: 'bg-slate-900 rounded-xl text-white font-bold text-sm' }}
              />
              <TextField
                fullWidth
                size="small"
                placeholder="CVV"
                type="password"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                InputProps={{ className: 'bg-slate-900 rounded-xl text-white font-bold text-sm' }}
              />
            </div>
          </div>
        )}

        <Divider className="border-white/10" />

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={isProcessing}
          onClick={handlePayNow}
          className="py-3.5 font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl shadow-xl transition-all"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <CircularProgress size={20} className="text-white" />
              <span>Processing Payment with Cashfree...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LockIcon fontSize="small" />
              <span>Pay {formatCurrency(order.amount)} via Cashfree</span>
            </div>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
