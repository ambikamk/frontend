import React, { useState, useEffect } from 'react';
import api from '../api';
import './JobList.css';
import { Link } from 'react-router-dom'; // Importing Link for routing

const getUniqueCompanies = (jobs) => {
    const companies = jobs.map(job => job.company);
    return [...new Set(companies)];
};

const getUniqueLocations = (jobs) => {
    const locations = jobs.map(job => job.location);
    return [...new Set(locations)];
};

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [companyFilter, setCompanyFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newJob, setNewJob] = useState(null);

    // Fetching the list of jobs
    useEffect(() => {
        api.get('/api/jobs/')
            .then(response => setJobs(response.data))
            .catch(error => console.error('Error fetching jobs:', error));
    }, []);

    // Filtering jobs based on the search term and filter options
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(job => 
        (companyFilter === '' || job.company === companyFilter) &&
        (locationFilter === '' || job.location === locationFilter)
    );

    // Handle job card click for showing details
    const handleJobClick = (job) => {
        setSelectedJob(job);
        setShowModal(true);
    };

    // Handle closing modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedJob(null);
        setNewJob(null);
    };

    // Handle adding a job
    const handleAddJob = () => {
        setNewJob({
            title: '',
            description: '',
            company: '',
            location: '',
            salary: '',
            deadline: ''
        });
        setShowModal(true);
    };

    // Handle saving a new job or editing an existing job
    // const handleSaveJob = async () => {
    //     if (newJob) {
    //         // Add new job
    //         try {
    //             const response = await api.post('/api/jobs/', newJob);
    //             setJobs(prevJobs => [...prevJobs, response.data]);
    //             setShowModal(false);
    //             setNewJob(null);
    //         } catch (error) {
    //             console.error('Error adding job:', error);
    //         }
    //     }
    // };

    // Handle editing a job
const handleEdit = (job) => {
    setNewJob(job); // Set the newJob state to the job being edited
    setShowModal(true);
};

// Handle saving a new job or editing an existing job
const handleSaveJob = async () => {
    try {
        if (newJob) {
            // Check if it's a new job or an existing one
            if (newJob.id) {
                // If it's an existing job, make a PUT request to update it
                const response = await api.put(`/api/jobs/${newJob.id}/`, newJob);
                if (response.status === 200) {
                    // Update the job in the jobs list
                    setJobs(prevJobs => prevJobs.map(job =>
                        job.id === newJob.id ? response.data : job
                    ));
                    setShowModal(false);
                    setNewJob(null);
                } else {
                    console.error('Failed to update job:', response.statusText);
                }
            } else {
                // If it's a new job, make a POST request to add it
                const response = await api.post('/api/jobs/', newJob);
                if (response.status === 201) {
                    // Add the new job to the jobs list
                    setJobs(prevJobs => [...prevJobs, response.data]);
                    setShowModal(false);
                    setNewJob(null);
                } else {
                    console.error('Failed to add job:', response.statusText);
                }
            }
        } else {
            console.error('New job data is not set');
        }
    } catch (err) {
        console.error('Error saving job:', err);
    }
};



    
    const handleDelete = async (jobId) => {
        try {
            await api.delete(`/api/jobs/${jobId}/`);
            setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };
    

    // Define Navbar as a separate function
    function Navbar() {
        return (
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        JobNest
                    </Link>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/" className="nav-links">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/logout" className="nav-links">
                                Logout
                            </Link>
                           
                        </li>
                        {/* Add more navigation items as needed */}
                    </ul>
                </div>
            </nav>
        );
    }

    return (
        <div className="job-list-container">
            <h1 className="heading">Job Portal</h1>
            <Navbar />
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="filter-container">
                <select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="filter-select">
                    <option value="">All Companies</option>
                    {getUniqueCompanies(jobs).map(company => (
                        <option key={company} value={company}>{company}</option>
                    ))}
                </select>

                <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="filter-select">
                    <option value="">All Locations</option>
                    {getUniqueLocations(jobs).map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
            </div>
            <ul className="job-list">
                {filteredJobs.map(job => (
                    <li key={job.id} className="job-item">
                        <div className="job-info" onClick={() => handleJobClick(job)}>
                            <h3 className="job-title">{job.title}</h3>
                            <p className="job-company">{job.company}</p>
                            <p className="job-location">{job.location}</p>
                        </div>
                        <div className="job-actions">
                            <button onClick={() => handleEdit(job)}>Edit</button>
                            <button onClick={() => handleDelete(job.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>

            {showModal && (selectedJob || newJob) && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>{newJob ? 'Add Job' : 'Edit Job'}</h2>
                        <input
                            type="text"
                            placeholder="Job Title"
                            value={(newJob && newJob.title) || (selectedJob && selectedJob.title) || ''}
                            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            value={(newJob && newJob.description) || (selectedJob && selectedJob.description) || ''}
                            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Company"
                            value={(newJob && newJob.company) || (selectedJob && selectedJob.company) || ''}
                            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={(newJob && newJob.location) || (selectedJob && selectedJob.location) || ''}
                            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Salary"
                            value={(newJob && newJob.salary) || (selectedJob && selectedJob.salary) || ''}
                            onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                        />
                        <input
                            type="date"
                            placeholder="Deadline"
                            value={(newJob && newJob.deadline) || (selectedJob && selectedJob.deadline) || ''}
                            onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                        />
                        <button onClick={handleSaveJob}>Save</button>
                        <button onClick={handleCloseModal}>Cancel</button>
                    </div>
                </div>
            )}

            <button className="add-job-button" onClick={handleAddJob}>Add Job</button>
        </div>
    );
};

export default JobList;