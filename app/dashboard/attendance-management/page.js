import { getClassesList } from '../../../api/classes';
import AttendanceDashboard from '../../../components/attendance/Dashboard';
import { cookies } from 'next/headers';
// ==================================================================================================
export default async function AttendancePage({ params }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value

  if (!cookyGuid || !cookyId) {
    redirect('/login');
  }
  // ==================================================================================================
  const classesListData = await getClassesList(resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId)

  // ==================================================================================================
  return (
    <AttendanceDashboard
      profile={resolvedParams.profile}
      session={resolvedParams.session}
      cookyGuid={cookyGuid}
      cookyId={cookyId}
      classes={classesListData?.results?.class_rooms}
    />
  );
};
// ==================================================================================================