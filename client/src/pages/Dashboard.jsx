import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import AddJob from './AddJob'
import ManageJobs from './ManageJobs'
import ViewApplications from './ViewApplications'

const Dashboard = () => {
     const navigate = useNavigate()
     const [activeTab, setActiveTab] = useState('add-job')

     const renderContent = () => {
        switch(activeTab) {
            case 'add-job':
                return <AddJob />
            case 'manage-jobs':
                return <ManageJobs />
            case 'view-applications':
                return <ViewApplications />
            default:
                return <AddJob />
        }
     }

  return (
    <div className='min-h-screen'>

        {/* Navbar for Recuriter Panel */}
        <div className='border-b'>
            <div className='px-5 flex justify-between items-center py-4'>
                <img onClick={e => navigate('/')} className='max-sm:w-32 cursor-pointer' src={assets.logo} alt="" />
                <div className='flex items-center gap-3'>
                    <p className='max-sm:hidden'>Welcome, Bikiran</p>
                    <div className='relative group'>
                        <img className='w-8 border rounded-full' src={assets.company_icon} alt="" />
                        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12'>
                            <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm'>
                                <li className='py-1 px-2 cursor-pointer pr-10'>Logout</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='flex'>
             
             {/* Left Sidebar with option to add job,manage job,view applications */}
             <div className='inline-block min-h-screen border-r-2'>
                <ul className='flex flex-col items-start pt-5 text-gray-800'>
                    <button 
                        onClick={() => setActiveTab('add-job')}
                        className={`flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${activeTab === 'add-job' ? 'bg-blue-100 border-r-4 border-blue-500' : ''}`}>
                        <img className='min-w-4' src={assets.add_icon} alt="" />
                        <p className='max-sm:hidden'>Add Job</p>
                    </button>

                    <button 
                        onClick={() => setActiveTab('manage-jobs')}
                        className={`flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${activeTab === 'manage-jobs' ? 'bg-blue-100 border-r-4 border-blue-500' : ''}`}>
                        <img className='min-w-4' src={assets.home_icon} alt="" />
                        <p className='max-sm:hidden'>Manage Jobs</p>
                    </button>

                    <button 
                        onClick={() => setActiveTab('view-applications')}
                        className={`flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${activeTab === 'view-applications' ? 'bg-blue-100 border-r-4 border-blue-500' : ''}`}>
                        <img className='min-w-4' src={assets.person_tick_icon} alt="" />
                        <p className='max-sm:hidden'>View Applications</p>
                    </button>
                </ul>
             </div>

            <div className='flex-1 p-5 mt-0'>
                {renderContent()}
            </div>

        </div>
       
    </div>
  )
}

export default Dashboard