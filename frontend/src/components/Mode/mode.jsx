import './mode.css';


const Mode = ({ setUnoReport, incident, refresh, setRefresh}) => {

    const token = localStorage.getItem('access_token')

    const investigate = (incident, stat) => {
        fetch('/all_incidents', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify ({
                status: stat,
                user_id: incident.user_id,
                id: incident.id
            })
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Error updating data', response.statusText)
            }
            console.log(`modepatch: ${response}`)
            setRefresh(!refresh)
        })
        .catch((error) => {
            console.error(error)
        });
    }
    return (
        <div className='mode__div'>
            <button id='button0' onClick={() => setUnoReport(false)}>Report Details</button>
            <button onClick={() => investigate(incident, 'resolved')} id='mode__div-button1'>
                Resolved
            </button>
            <button onClick={() => investigate(incident, 'rejected')} id='mode__div-button2'>
                Reject Claim
            </button>
        </div>
    )
}

export default Mode;