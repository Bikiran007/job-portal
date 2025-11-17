import React, { useContext, useEffect, useState } from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'

const ManageJobs = ({ setActiveTab }) => {

  const navigate = useNavigate()

  const [jobs,setJobs] = useState(false)

  const { backendUrl, companyToken } = useContext(AppContext)

  // Function to fetch company Job Applicaton data
  const fetchCompanyJobs = async () => {

    try {

      const {data} = await axios.get(backendUrl+'/api/company/list-jobs',
        {headers:{token:companyToken}}
      )

      if (data.success) {
        const jobsData = Array.isArray(data.jobsData) ? data.jobsData.reverse() : []
        setJobs(jobsData)
        console.log('Fetched company jobs:', jobsData)
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
      
    }

  }

  // Function to change job Visibility
  const changeJobVisibility = async (id) => {
    try {

      const {data} = await axios.post(backendUrl+'/api/company/change-visibility',
        {id},
        { headers:{token: companyToken}}
      )

      if (data.success) {
        toast.success(data.message)
        fetchCompanyJobs()
        
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
      
    }
  }

  // Optimistic toggle with revert on failure
  const toggleVisibility = async (job, idx) => {
    // If this is a local/fallback job (no _id), just toggle locally
    if (!job._id) {
      // ensure jobs state uses a local copy
      if (jobs.length === 0) {
        setJobs(manageJobsData.map((j,i)=> ({ ...j, _id: j._id || `local-${i}` })))
      }
      setJobs(prev => prev.map((j,i) => i === idx ? { ...j, visible: !j.visible } : j))
      return
    }

    // optimistic update
    const original = jobs
    setJobs(prev => prev.map(j => j._id === job._id ? { ...j, visible: !j.visible } : j))

    try {
      const { data } = await axios.post(backendUrl + '/api/company/change-visibility', { id: job._id }, { headers: { token: companyToken } })
      if (data.success) {
        toast.success(data.message)
        // refresh to get authoritative data
        fetchCompanyJobs()
      } else {
        toast.error(data.message)
        // revert
        setJobs(original)
      }
    } catch (error) {
      toast.error(error.message)
      setJobs(original)
    }
  }

  useEffect(()=>{
    if (companyToken) {
      fetchCompanyJobs()
    }
  }, [companyToken])

  return jobs ? jobs.length === 0 ? ( <div></div> ) : (
    <div className='container p-4 max-w-5xl'>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
              <th className='py-2 px-4 border-b text-left'>Job Title</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
              <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 border-b text-center'>Applicants</th>
              <th className='py-2 px-4 border-b text-left'>Visible</th>
            </tr>
          </thead>
          <tbody>
            {(jobs.length ? jobs : manageJobsData).map((job,index)=>(
              <tr key={job._id || index} className='text-gray-700'>
                <td className='py-2 px-4 border-b max-sm:hidden'>{index+1}</td>
                <td className='py-2 px-4 border-b'>{job.title}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{job.date ? moment(job.date).format('ll') : ''}</td>
                <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                <td className='py-2 px-4 border-b text-center'>{job.applicants}</td>
                <td className='py-2 px-4 border-b'>
                  <input onChange={()=>toggleVisibility(job, index)} className='scale-125 ml-4' type="checkbox" checked={Boolean(job.visible)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-4 flex justify-end'>
        <button onClick={()=>navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'>Add new job</button>
      </div>
    </div>
  ) : <Loading />
}

export default ManageJobs