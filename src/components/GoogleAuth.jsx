import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router';

const GoogleAuth = () => {
    const navigate = useNavigate();
    const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
    const handleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;

        try {
            const response = await toast.promise(axios.post(`${import.meta.env.VITE_SERVER}/auth/googleAuth`, { token }), {
                pending: 'Getting In!'
            })

            if (response) {
                toast.success('Logged In!')
                console.log('Response', response)
                sessionStorage.setItem('acTk', response.data.token.access)
                navigate('/dashboard')
            }
        } catch (error) {
            console.error("Error", error)
        }
    };

    const handleFailure = (error) => {
        console.error('Google Sign-In Failed:', error);
        alert('Google Sign-In failed. Please try again.');
    };

    return (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
            <div>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleFailure}
                    useOneTap
                />
            </div>
            <ToastContainer />
        </GoogleOAuthProvider>
    );
};

export default GoogleAuth;