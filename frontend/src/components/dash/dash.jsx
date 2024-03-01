import { useEffect, useState } from 'react';
import './dash.css';
import Map from '../Maps/maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Mode from '../Mode/mode';

const Dash = () => {

    const [allIncidents, setAllIncidents] = useState([]);
    const [unoReport, setUnoReport] = useState(true);
    const [inc, setInc] = useState({});
    const [mode, setMode] = useState({});
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {

        fetch('/all_incidents', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Couldn't get reports");
                }
                return response.json();
            })
            .then((data) => {
                console.log(`all reports ${data.incident_reports}`)
                setAllIncidents(data.incident_reports);
                console.log(data.incident_reports)
            })
            .catch((error) => { console.error("Error fetching reports", error.message) });
    }, [refresh]);

    const setToggleMode = (incidentId) => {
        setMode(prevModes => ({
            ...prevModes,
            [incidentId]: !prevModes[incidentId]
        }))
    }

    return (
        <div className='main__dashdiv'>
            {unoReport ? (
                <div className='main__dashdiv-content'>
                    {allIncidents.map((incident) => (
                        <div
                            onClick={() => {
                                setInc(incident);
                            }}
                            id='descp'
                            className='descr'>
                            <p><span style={{ fontWeight: "800", color: "black", textTransform: "uppercase" }}>{incident.title}</span></p>
                            <div id='statusdiv' className={incident.status === 'resolved' ? "green" : (incident.status === 'rejected' ? "red": "blue")} >{incident.status}</div>
                            <div className='buttdiv'>
                                <button style={{ zIndex: 8 }} id='divbutt' onClick={() => setToggleMode(incident.id)}>
                                    <span role='img' aria-label='edit'>
                                        ✏️
                                    </span>
                                </button>
                                <p className='explainer'>Edit</p>
                            </div>
                            {mode[incident.id] && (
                                  <div className={mode ? "overlay__div" : ""}>
                                    <button onClick={() => setMode({})} className='xbutton'>X</button>
                                      <div className='modediv'>
                                        <Mode setUnoReport={setUnoReport} incident={incident} refresh={refresh} setRefresh={setRefresh} setMode={setMode} />
                                    </div>
                                  </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className='OneReport'>
                    <div className='divmap1'>
                        <div className='divmap1__button'><button onClick={() => setUnoReport(true)}><FontAwesomeIcon icon={faArrowLeft} /></button></div>
                        <div className='divmap1__button2'><button>User id: {inc.user_id}</button></div>
                    </div>
                    <div className='divmap__textmap'>
                        <div className='divmap__textmap-text'>
                            <h1 style={{ textDecoration: "underline" }}>Report Name:</h1>
                            <h1><span style={{ WebkitTextFillColor: "red" }}>{inc.title}</span>, {inc.location}</h1>
                            <h3>📍 {inc.latitude}, {inc.longitude} {inc.location}</h3>
                            <h4 style={{ textDecoration: "underline" }}>Description</h4>
                            <p>{inc.description}</p>
                        </div>
                        <div className='mappy'>
                            <Map location={inc.location} longitude={inc.longitude} latitude={inc.latitude} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dash;


