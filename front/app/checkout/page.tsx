'use client';

import { Header } from '@/components/header';
import { PaymentSection } from '@/components/payment-section';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface OrderSummary {
  shopName: string;
  shopAddress: string;
  totalCost: number;
  email: string;
  fileInfo: {
    name: string;
    pages: number;
  };
  printConfig: {
    quantity: number;
    copies: number;
    isColor: boolean;
    isDoubleSided: boolean;
    paperSize: string; // e.g. 'a4'
    binding: string; // e.g. 'staple'
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  useEffect(() => {
    // In a real app, this would come from state management or URL params

    const mockOrderSummary: OrderSummary = {
      shopName: 'Copy Centar Beograd',
      shopAddress: 'Knez Mihailova 15, Beograd',
      totalCost: 240,
      email: 'test@example.com',
      fileInfo: {
        name: 'dokument.pdf',
        pages: 5,
      },
      printConfig: {
        quantity: 2,
        copies: 1,
        isColor: true,
        isDoubleSided: false,
        paperSize: 'a4',
        binding: 'staple',
      },
    };
    setOrderSummary(mockOrderSummary);
  }, []);

  const handlePaymentComplete = () => {
    // Redirect to success page or back to home
    setTimeout(() => {
      router.push('/');
    }, 3000);
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (!orderSummary) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center">Učitava se...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <PaymentSection
          orderSummary={orderSummary}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handleCancel}
        />
      </main>
    </div>
  );
}
