import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Administration & Back-Office Vendeur | AutoAfrique',
  robots: { index: false, follow: false },
};

export default function AdminRouteAlias() {
  redirect('/dashboard/admin');
}
