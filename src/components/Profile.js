import React ,{useState}from 'react'

export const Profile = () => {

const [empId, setEmpId] = useState("");

  const handleSearch = () => {
    // Later this will call backend API
    console.log("Searching for ID:", empId);
  };

  return (
    <div className="container mt-5 col-12 col-sm-8 col-md-6 col-lg-4 " >
      <div className="card p-4 shadow">
        <h3>Search Employee by ID</h3>

        <div className="mb-3">
          <label className="form-label">Employee ID</label>
          <input
            type="text"
            className="form-control"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
         
      </div>
    </div>
  )
}
