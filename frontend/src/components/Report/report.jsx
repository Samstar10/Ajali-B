import { useEffect, useRef, useState } from 'react';
import './report.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from '../Modal/modal';

const Report = () => {
    const [title, setTitle] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [files, setFiles] = useState("");
    const [error, setError] = useState("")
    const [display, setDisplay] = useState("")
    const [message, setMessage] = useState("");
    const [progress, setProgress] = useState({ started: false, pc: 0 });
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const handleButtonClick = (e) => {
        e.preventDefault();
        fileInputRef.current.click();
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('location', location);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);
        formData.append('description', description);
        setMessage("Uploading...")
        setProgress(prevState => { return { ...prevState, started: true } })


        try {
            const token = localStorage.getItem('access_token');
            if(!token) {
                throw new Error('Token not found')
            }
            const response = await axios.post('/incidents', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 201) {
                throw new Error("Error while posting data");
            }

            const data = response.data.id;
            console.log(`data id isss: ${data.id}`)
            setLatitude("");
            setLongitude("");
            setDescription("");
            setTitle("");
            setLocation("");
            setFiles("")
            setDisplay("Accident reported successfully!")
            uploadImages(data);
            setTimeout(() => {
                navigate("/dashboard/myreports")
            }, 2000)
        } catch (error) {
            console.error("Posting failed", error.message);
            setError(error.message)
        }
    };

    const uploadImages = async (data) => {
        const fd = new FormData();
        for (let i = 0; i < files.length; i++) {
            fd.append('files', files[i])
        }

        try {
            const token = localStorage.getItem('access_token');
            if(!token) {
                throw new Error('Token not found')
            }            
            const response = await axios.post(`/incidents/${data}/media`, fd, {
                onUploadProgress: (ProgressEvent => {
                    setProgress(prevState => { return { ...prevState, pc: ProgressEvent.progress * 100 } })
                }),
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status !== 201) {
                throw new Error("Error while posting images");
            }
        } catch (error) {
            setMessage("Image upload failed!")
            console.error("Image upload failed!", error.message);
        }
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files)
    }

    return (
        <div className='main__div'>
            <div className='main__div-text'>
                <h4>Please provide details by filling in the form below</h4>
            </div>
            <form onSubmit={handleSubmit}>
                {error && <div style={{ color: "red" }}>{error}</div>}
                <div className='title_loc'>
                    <div className='title' style={{width: "40%"}}>
                        <input
                            type='text'
                            id='title'
                            placeholder='Enter name for report'
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                    </div>
                    <div className='location' style={{width: "40%"}}>
                        <input
                            type='text'
                            id='location'
                            placeholder='Enter location'
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                        />
                    </div>
                </div>
                <div className='latsdiv'>
                    <div id='lat'>
                        <input
                            type='number'
                            id='latitude'
                            placeholder='88'
                            value={latitude}
                            onChange={(event) => setLatitude(event.target.value)}
                        />
                        <label>Latitude</label>
                    </div>
                    <div id='long'>
                        <input
                            type='number'
                            id='longitude'
                            placeholder='-180 to 180'
                            value={longitude}
                            onChange={(event) => setLongitude(event.target.value)}
                        />
                        <label>Longitude</label>
                    </div>
                </div>
                <div>
                    <div id='fileinput'>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            multiple
                        />
                        <button onClick={handleButtonClick} className='filebutton'>Add Images</button>
                        {files && <div style={{ color: "white" }}>{files.length} images selected</div>}
                        {progress.started && <progress max="100" value={progress.pc}></progress>}
                        {message && <span>{message}</span>}
                    </div>
                    <textarea
                        type='text'
                        id='description'
                        placeholder='Briefly describe the accident in less than 1000 words'
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    ></textarea>
                </div>
                <div id='buttondiv'><button className='reportbutton'>Report Accident</button></div>
                {display && <div style={{ color: "green" }}>{display}</div>}
            </form>
        </div>
    )
}

export default Report;
