'use client'
import Layout from '../../../layouts/Layout';
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import { LibraryBig } from 'lucide-react';
import LibraryExplorerView from '../../../components/LibraryExplorerView';

// ========================================================================================
const OnlineClasses = () => {
  // ========================================================================================
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "View Inventory" },
  ];

  // ========================================================================================
  const onlineClassesData = [
    {
      _id: "class_001",
      createdBy: "Dr. Anjali Sharma",
      subject: "Mathematics",
      titleDescription: {
        title: "Advanced Calculus: Integration Techniques",
        description: "A deep dive into various integration methods and their applications."
      },
      timings: {
        date: "2025-07-25",
        time: "10:00 AM - 11:30 AM IST"
      },
      info: {
        duration: "90 mins",
        platform: "Google Meet"
      },
      startJoinLink: "https://meet.google.com/abc-defg-hij", // Example join link
      action: "view_details" // Placeholder for actions like edit/delete
    },
    {
      _id: "class_002",
      createdBy: "Prof. Rahul Verma",
      subject: "Computer Science",
      titleDescription: {
        title: "Introduction to Python Programming",
        description: "Learn the fundamentals of Python, from basics to data structures."
      },
      timings: {
        date: "2025-07-26",
        time: "02:00 PM - 03:30 PM IST"
      },
      info: {
        duration: "90 mins",
        platform: "Zoom"
      },
      startJoinLink: "https://zoom.us/j/1234567890",
      action: "edit_class"
    },
    {
      _id: "class_003",
      createdBy: "Ms. Priyanka Das",
      subject: "Science",
      titleDescription: {
        title: "Biology: Cell Structure and Function",
        description: "An interactive session on the basic unit of life and its processes."
      },
      timings: {
        date: "2025-07-27",
        time: "09:00 AM - 10:00 AM IST"
      },
      info: {
        duration: "60 mins",
        platform: "Microsoft Teams"
      },
      startJoinLink: "https://teams.microsoft.com/l/meetup/",
      action: "manage_class"
    },
    {
      _id: "class_004",
      createdBy: "Mr. Alok Singh",
      subject: "History",
      titleDescription: {
        title: "World History: Ancient Civilizations",
        description: "Exploring the rise and fall of ancient empires and their legacy."
      },
      timings: {
        date: "2025-07-28",
        time: "04:00 PM - 05:30 PM IST"
      },
      info: {
        duration: "90 mins",
        platform: "Google Meet"
      },
      startJoinLink: "https://meet.google.com/klm-nopq-rst",
      action: "view_recording"
    },
    {
      _id: "class_005",
      createdBy: "Dr. Kavita Rao",
      subject: "English Literature",
      titleDescription: {
        title: "Shakespearean Tragedies: Hamlet Analysis",
        description: "A critical analysis of Hamlet, focusing on themes and characters."
      },
      timings: {
        date: "2025-07-29",
        time: "11:00 AM - 12:30 PM IST"
      },
      info: {
        duration: "90 mins",
        platform: "Zoom"
      },
      startJoinLink: "https://zoom.us/j/0987654321",
      action: "edit_class"
    }
  ];

  return (
    <Layout
    // dashboardData={dashboardData?.results}
    >

      <div
        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="min-h-[calc(100vh-100px)] p-6 space-y-6">

        <Breadcrumbs items={breadcrumbs} />

        <LibraryExplorerView
          headerTitle='Online Library'
          headerIcon={<LibraryBig />}
          data={onlineClassesData} // Pass the generated ordersData here
          columns={['Created By', 'Subject', 'Title & Description', 'Timings', 'Info', 'Start/join', 'Action']}
          tableType='Library'
        />
      </div>
    </Layout>
  );
};

// ========================================================================================
export default OnlineClasses;
// ========================================================================================