'use client';
import dynamic from 'next/dynamic';

const ChatBot = dynamic(() => import('@/components/ChatBot'), { ssr: false });
const WhatsAppQuickQuote = dynamic(() => import('@/components/WhatsAppQuickQuote'), { ssr: false });

export default function GlobalWidgets() {
  return (
    <>
      <ChatBot />
      <WhatsAppQuickQuote />
    </>
  );
}
