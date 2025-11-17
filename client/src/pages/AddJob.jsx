import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const AddJob = () => {

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Bangalore');
    const [category, setCategory] = useState('Programming');
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(0);

    const editorRef = useRef(null)
    const quillRef = useRef(null)

    const { backendUrl, companyToken } = useContext(AppContext)

    const onSubmitHandler = async (e) => {
      e.preventDefault()

      try {

        const description = quillRef.current.root.innerHTML

        const {data} = await axios.post(backendUrl+'/api/company/post-job',
          {title,description,location,salary,category,level},
          {headers: {token:companyToken}}
        )

        if (data.success) {
          toast.success(data.message)
          setTitle('')
          setSalary(0)
          quillRef.current.root.innerHTML = ""
          
        } else {
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error.message)
        
      }

    }


    useEffect(()=>{
        // Initiate Quill only once
        if(!quillRef.current && editorRef.current) {
          quillRef.current = new Quill(editorRef.current,{
            theme:'snow',
          })
        }
         
    },[])

  return (
    <form onSubmit={onSubmitHandler} className='w-full max-w-2xl'>
        
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Job Title</label>
          <input type="text" placeholder='Type here'
            onChange={e => setTitle(e.target.value)} value={title}
            required
            className='w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
            />
        </div>

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Job Description</label>
          <div ref={editorRef} className='border border-gray-300 rounded'></div>
        </div>

        <div className='grid grid-cols-3 gap-4 mb-6'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Job Category</label>
            <select 
              onChange={e => setCategory(e.target.value)}
              value={category}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white'
            >
              {JobCategories.map((category,index)=>(
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Job Location</label>
            <select 
              onChange={e => setLocation(e.target.value)}
              value={location}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white'
            >
              {JobLocations.map((location,index)=>(
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Job Level</label>
            <select 
              onChange={e => setLevel(e.target.value)}
              value={level}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white'
            >
              <option value="Beginner level">Beginner level</option>
              <option value="Intermediate level">Intermediate level</option>
              <option value="Senior level">Senior level</option>
            </select>
          </div>
        </div>

        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Job Salary</label>
          <input min={0} 
            onChange={e => setSalary(e.target.value)} 
            type="number" 
            placeholder='2500' 
            value={salary}
            className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]'
          />
        </div>

        <button 
          type='submit'
          className='w-28 py-3 my-4 bg-black text-white rounded'
        >
          ADD
        </button>

    </form>
  )
}

export default AddJob