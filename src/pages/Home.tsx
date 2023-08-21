import React from 'react'
import Navbar from '../components/Navbar.tsx';
import GetContactList from '../components/GetContactList.tsx';
import Form from '../components/Form.tsx';

const Home = () => {
  return (
    <>
    <Navbar />
    <Form />
    <GetContactList />
    </>
  )
}

export default Home