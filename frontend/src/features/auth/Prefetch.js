import { store } from '../../app/store'
import { materialsApiSlice } from '../materials/materialsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        const materials = store.dispatch(materialsApiSlice.endpoints.getMaterials.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())
    }, [])

    return <Outlet />
}
export default Prefetch