import ReportCardPage from '../../../components/reportCard/ReportCardPage';
// import { getStandardList } from '../../../../../api/standards';
// import { getSubjectsList } from '../../../../../api/subjects';
import { getExamList } from '../../../api/exam';
import { getClassesList } from '../../../api/classes';
import { cookies } from 'next/headers';
import { getGradesList } from '../../../api/grades';
// ==================================================================================================
export default async function ReportCard({ params }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value


  // ==================================================================================================
  // const classesListData = await getClassesList(resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId)
  // const gradesListData = await getGradesList(resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId)

  // const getExamListData = await getExamList(resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId)
  // const uniqueStandards = [
  //   ...new Map(classesListData?.results?.class_rooms.map(cls => [cls.standard.id, cls.standard])).values()
  // ];



  // const subjectsListData = await getSubjectsList(uniqueStandards[0]?.id,resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId)

  // ==================================================================================================
  return (

    <ReportCardPage
      profile={resolvedParams.profile}
      session={resolvedParams.session}
      cookyGuid={cookyGuid}
      cookyId={cookyId}
      // classes={uniqueStandards}
      // grades={gradesListData?.results?.items}
      // subjects={subjectsListData?.results?.items}
      // exams={getExamListData?.results?.items}
    />
  );
};
// ==================================================================================================