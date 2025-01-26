import React, { useEffect } from "react"
import { useNavigate } from "react-router"

export default function Ssv({ element: Element }) {
    const nav = useNavigate()
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                if (sessionStorage.getItem('acTk')) {
                    return;
                }
                else {
                    nav('/')
                }

            } catch (error) {
                nav('/') 
                console.log("Routing Error - Auth", error)
            }
        }

        verifyAuth()
    }, [nav])

    return (
        <>
            <Element />
        </>
    )
}