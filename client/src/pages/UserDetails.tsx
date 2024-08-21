import React from 'react'
import { useSelector } from 'react-redux'
import UserCard from '../components/user/UserCard'
import MainNav from '../components/navbars/MainNav'
export default function UserDetails() {
    const user = useSelector((state:any)=> state.user.user)
  return (
   <>
   <MainNav/>
   <div className="flex absolute top-14 m-10">
    <UserCard user={user}/>

   </div>
   </>
  )
}
