import React, { useRef, useState } from 'react'

const AddJob = () => {

    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('Bangalore');
    const [category, setCategory] = useState('Programming');
    const [level, setLevel] = useState('Beginner level');
    const [salary, setSalary] = useState(0);

    const editorRef = useRef(null)

  return (
    <form>
        
        <div>
          <p>Job Title</p>
          <input type="text" placeholder='Type here'
            onChange={e => setTitle(e.target.value)} value={title}
            required
            />
        </div>

         <div>
          <p>Job Description</p>
          <div>

          </div>
         </div>

    </form>
  )
}

export default AddJob