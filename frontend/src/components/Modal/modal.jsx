import { useState, useContext, useEffect } from 'react';
import './modal.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Modal = ({ id, latitude, longitude, description, isOpen, setIsOpen }) => {
    const [latitud, setLatitude] = useState(latitude);
    const [longitud, setLongitude] = useState(longitude);
    const [descriptio, setDescription] = useState(description);
    const [images, setImages] = useState([]);


    const token = localStorage.getItem('access_token')
    if (token) {
        const pay_load = jwtDecode(token)
        const current_id = pay_load.userid
        const payload = JSON.parse(atob(token.split('.')[1]));

    } else {
        console.log("token is null or undefined")
    }

    if (isOpen === false) {
        return null;
    }


    const handleSubmit = () => {
        fetch(`/incidents/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                latitude: latitud,
                longitude: longitud,
                description: descriptio,
            }),
        })
            .then((r) => {
                if (!r.ok) {
                    throw new Error(`Failed to patch message: ${r.statusText}`);
                }
                return r.json();
            })
            .then((updatedMessage) => {
                console.log(updatedMessage)
            })
            .catch((error) => {
                console.error('Error fetching message', error.message)
            });
    }

    return (
        <div className='overlay'>
            <div className='modal'>
                <button id='modalbutton' onClick={() => { setIsOpen(false) }} className='close'>X</button>
                <div className='modal__content'>
                    <form id='modal_form' onSubmit={handleSubmit}>
                        <div className='latsdivs'>
                            <div id='lat'>
                                <label>Latitude</label>
                                <input
                                    type='number'
                                    id='latitude'
                                    placeholder={latitude}
                                    value={latitud}
                                    onChange={(event) => setLatitude(event.target.value)}
                                />
                            </div>
                            <div id='long'>
                                <label>Longitude</label>
                                <input
                                    type='number'
                                    id='longitude'
                                    placeholder={longitude}
                                    value={longitud}
                                    onChange={(event) => setLongitude(event.target.value)}
                                />
                            </div>
                        </div>
                        <div className='imgdiv'>
                         <h2 style={{textDecoration: "none"}}>Edit your Report</h2>
                        </div>
                        <div>
                            <h4 style={{ color: "white", fontWeight: 300, marginBottom: ".2rem"}}>Description</h4>
                            <textarea
                                type='text'
                                id='description'
                                placeholder={description}
                                value={descriptio}
                                onChange={(event) => setDescription(event.target.value)}
                            ></textarea>
                        </div>
                        <div id='buttondiv'><button type='submit' className='reportbutton'>Finish</button></div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Modal;