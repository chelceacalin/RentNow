import React, { useContext, useEffect } from 'react'
import { UserLoginContext } from "../context/LoginProvider";
import { Outlet } from 'react-router-dom';
import axios from 'axios';

function Sessionchecker() {

    const { email, role, setRole, setIsAdmin, set_isActive } = useContext(UserLoginContext);

    useEffect(() => {
        const interval = setInterval(() => {
            axios.get(`/users?email=${email}`)
                .then((response) => {
                    const data = response.data;
                    if (data?.content?.length > 0) {
                        const user = data.content[0];
                       
                        //Deactivated account
                        if (user.is_active === false) {
                            set_isActive(false);
                            window.location.reload();
                        }

                        //Changed role
                        if (role !== user.role) {
                            setRole(user.role);
                            setIsAdmin(user.role === "ADMIN");
                            window.location.reload();
                        }

                    }

                })
                .catch((err) => console.error("Polling error:", err));
        }, 15000);

        return () => clearInterval(interval);
    }, [email]);

    return <Outlet />
}

export default Sessionchecker