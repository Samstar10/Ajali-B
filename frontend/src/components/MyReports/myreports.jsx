import './myreports.css';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import SingleReport from '../SingleReport/singlereport';
import Modal from '../Modal/modal';
import Map from '../Maps/maps';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const MyReports = ({ setIsAuthenticated }) => {

    const [reportMedia, setReportMedia] = useState([]);
    const [media, setMedia] = useState(false);
    const [displayReports, setDisplayReports] = useState([])
    const [location, setLocation] = useState("")
    const [userName, setUserName] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [desc, setDesc] = useState("");
    const [ed, setEd] = useState("")
    const [displayOneReport, setDisplayOneReport] = useState(true);
    const [report, setReport] = useState("");
    const MAPBOX_TOKEN = 'pk.eyJ1IjoiemFjbXV0dXJpNDUiLCJhIjoiY2x0M2Zlc2VmMWswaTJrcGw1aHRwdTA4aiJ9.2_UIX3ZDsWv60F_lQE5_rg'
    const token = localStorage.getItem('access_token')
    const [refr, setRefr] = useState(false);


    useEffect(() => {

        if (token) {
            console.log(token)
            const pay_load = jwtDecode(token)
            const current_id = pay_load.userid
            const payload = JSON.parse(atob(token.split('.')[1]));

            const name = payload.username;
            setUserName(name)
        } else {
            console.log("token is null or undefined")
        }

        fetch('/incidents', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Couldn't get reports");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data)
                setDisplayReports(data.incident_reports);
                console.log(data)
            })
            .catch((error) => { console.error("Error fetching reports", error.message) });
    }, [refr]);

    const fetchImages = () => {
        fetch(`/incidents/media/${report.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error fetching images', response.statusText)
                }
                return response.json()
            })
            .then((data) => {
                console.log(data.media_attachments)
                setReportMedia(data.media_attachments)
            })
            .catch((error) => {
                console.error(error)
            })
    }

    const handleBack = () => {
        setDisplayOneReport(true)
    }

    return (
        <div className='maindiv__myreports'>
            {<Modal setIsOpen={setIsOpen} isOpen={isOpen} latitude={lat} longitude={long} description={desc} id={ed} />}
            {displayOneReport && (
                <div>
                    <div className='textdiv'>
                        <h4>Welcome Back,</h4>
                        <h2 style={{ textTransform: "capitalize" }}>{userName}</h2>
                    </div>
                </div>
            )}
            {displayOneReport && (
                <div className='header_div'>
                    <h3>Report Name</h3>
                    <div style={{ alignSelf: "center" }}><h4>Status</h4></div>
                    <h3>Edit</h3>
                </div>
            )}
            <div className='uldiv'>
                {displayOneReport ? (
                    <ul className='ul'>
                        {displayReports && displayReports.map((report) => (
                            < SingleReport
                                key={report.id}
                                setEd={setEd}
                                setLat={setLat}
                                setLong={setLong}
                                setDesc={setDesc}
                                setIsOpen={setIsOpen}
                                report={report}
                                setReport={setReport}
                                setDisplayOneReport={setDisplayOneReport}
                                setLocation={setLocation}
                                refr={refr}
                                setRefr={setRefr}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className='OneReport'>
                        <div className='divmap1'>
                            <div className='divmap1__button'><button onClick={handleBack}><FontAwesomeIcon icon={faArrowLeft} /></button></div>
                            <div className='divmap1__button2'><button onClick={() => {
                                setIsOpen(true)
                                setLat(report.latitude)
                                setLong(report.longitude)
                                setDesc(report.description)
                            }}>Edit Report</button></div>
                        </div>
                        <div className='divmap__textmap'>
                            <div className='divmap__textmap-text'>
                                <h1><span style={{ WebkitTextFillColor: "red" }}>{report.title}</span>, {location}</h1>
                                <h3>📍 {lat}, {long} {location}</h3>
                                <h4 style={{ textDecoration: "underline" }}>Description</h4>
                                <p>{report.description}</p>
                                <button onClick={() => {
                                    setMedia(!media)
                                    fetchImages();
                                }} id='report__media-button'>Media</button>
                                {media && (
                                    <div className={media ? "overlay__div-media" : ""}>
                                        <button onClick={() => {
                                            setMedia(!media)
                                            setReportMedia("")
                                        }} id='xbutton1'>X</button>
                                        <div className='image__div'>
                                            {reportMedia && reportMedia.map((image) => (
                                                <div className='image__div-div'>
                                                    <img key={image.id} src={`data:image/jpeg;base64,${image.file_url}`} alt='image' />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='mappy'>
                                <Map location={location} longitude={long} latitude={lat} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyReports;