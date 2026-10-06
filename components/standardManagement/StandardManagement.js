'use client'
import React, { useState, useMemo, useEffect } from 'react';
import Layout from '../../layouts/Layout';
import StandardsClassesManagementDashboard from './dashboard';
import { useRouter } from 'next/navigation';
import { getSessionCache, setSessionCache, } from '../../utils/sessionCache';

// ==================================================================

const StandardsClassesManagement = ({ }) => {
    const router = useRouter();
  const Context = getSessionCache("dashboardContext");

    const [reloadKey, setReloadKey] = useState(0);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const guid = localStorage.getItem('guid');
            if (!guid || Context == null) {
                router.replace('/login');
            }
        }
    }, [router]);


    // ==================================================================
    return (
        <>
            <Layout
                stateChanged={reloadKey}
            // reloadKey={reloadKey} 
            >
                <StandardsClassesManagementDashboard
                    setReloadKey={setReloadKey}
                />

            </Layout>
        </>
    );
};
// ==================================================================
export default StandardsClassesManagement;
// ==================================================================