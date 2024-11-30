import React from 'react'
import Navbar from '../Navbar/Navbar'
import './Rules.css'

export default function Rules() {
    return (
        <>
        <Navbar/>
      <div className='maindiv'>
      <h1 className='rules'>Rules</h1>
        <div className='rulesbox'>
            <ul>
                <li className='li'><p className='p'>Update any leave or absence requests in advance using this application.</p></li>
                <li className='li3'><h3>Allowed Leaves:</h3>
                <ul className='li1'>
                    <li className='li'><p className='p'> <span>Casual Leaves:</span>10 per year.</p></li>
                    <li><p className='p'><span>Sick Leaves:</span>10 per year.</p></li>
                    </ul>
                    <p className='p'>If the total leave exceeds the allowed limit, the extra days will result in a salary deduction.</p>
                    </li>
                    <li className='li'><p className='p'>All leaves must be recorded in the application to be considered valid.</p></li>
                    <li className='li'><p className='p'>Leaves beyond the allowed limit without prior approval may also impact performance reviews.</p></li>
                <li className='li'><p className='p'>Do not share your login credentials with others.
                </p></li>
            </ul>
        </div>
      </div>
        </>
    )
}
