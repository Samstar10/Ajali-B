import './singlereport.css';

const SingleReport = ({ setEd, setLat, setLong, setDesc, setIsOpen, report, setReport, setDisplayOneReport, setLocation, refr, setRefr }) => {
    const { id, latitude, longitude, description, location, status, title } = report;

    const handleDelete = () => {
        const token = localStorage.getItem('access_token');
        if(!token) {
            throw new Error('Token not found')
        }      

        fetch(`/incidents/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            if(!response.ok) {
                throw new Error(`Failed to delete request, ${response.statusText}`)
            }
            console.log(response)
            setRefr(!refr)
        })
        .catch((error) => {
            console.error(error)
        });
    };

    const handleDisplayOneReport = () => {
        setReport(report);
        setDisplayOneReport(false);
        setLat(latitude);
        setLong(longitude);
        setLocation(location);
    }

    return (
        <li className='main__reportdiv'>
            <div
               id='descp'
                className='descr'>
                <p><span style={{fontWeight: "800", color: "black", textTransform: "uppercase"}}>{title}</span></p>
                <div id='statusdiv' className={report.status === 'resolved' ? "green" : (report.status === 'rejected' ? "red": "blue")} >{report.status}</div>
                <div className='buttdiv'>
                    <button onClick={() => {
                        setEd(id)
                        setLat(latitude)
                        setLong(longitude)
                        setDesc(description)
                        setIsOpen(true)
                        handleDisplayOneReport()
                    }} id='divbutt'>
                        <span role='img' aria-label='edit'>
                            ✏️
                        </span>
                    </button>
                    <p className='explainer'>Edit</p>
                    <button onClick={handleDelete} id='divbutt2'>
                        <span role="img" aria-label="delete">
                            🗑
                        </span>
                    </button>
                    <p className='explainer2'>Delete</p>
                </div>
            </div>
        </li>
    )
}

export default SingleReport;