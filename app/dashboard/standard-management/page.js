
import StandardsClassesManagement from '../../../components/standardManagement/StandardManagement';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// ===========================================================================
export default async function StandardsClassesManagementScreen({ params }) {
  // ===========================================================================
  const cookieStore = cookies();

  const cookyGuid = cookieStore.get('guid')?.value;
  const cookyId = cookieStore.get('id')?.value;

  if (!cookyGuid || !cookyId) {
    redirect('/login');
  }


  // ===========================================================================
  return (
    // ===========================================================================
    < StandardsClassesManagement />

  )
}

// ===========================================================================