import { getClassesList } from '../../../api/classes';
import AttendanceComponent from '../../../components/attendance/Report';
import { cookies } from 'next/headers';
// ==================================================================================================
export default async function AttendancePage({ params }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value


  // ==================================================================================================
  const classesListData = await getClassesList(resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId)

  // ==================================================================================================
  return (
    <AttendanceComponent
      profile={resolvedParams.profile}
      session={resolvedParams.session}
      cookyGuid={cookyGuid}
      cookyId={cookyId}
      classes={classesListData?.results?.class_rooms}
    />
  );
};
// ==================================================================================================