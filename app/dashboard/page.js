import DashboardMenus from '../../components/dashboard/menus';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const cookieStore = cookies();

  const cookyGuid = cookieStore.get('guid')?.value;
  const cookyId = cookieStore.get('id')?.value;

  if (!cookyGuid || !cookyId) {
    redirect('/login');
  }

  return (
    <DashboardMenus
      cookyGuid={cookyGuid}
      cookyId={cookyId}
    />
  );
}
