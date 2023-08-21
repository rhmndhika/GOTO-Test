import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { css } from '@emotion/css';
import { LOAD_CONTACT_LIST, SEARCH_CONTACTS } from '../GraphQL/Queries.tsx';
import {  DELETE_CONTACT } from '../GraphQL/Mutation.tsx';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { addToFavorite, removeFromFavorite } from '../redux/favoriteRedux.tsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import './swiperStyle.css'
import { AiOutlinePhone, AiOutlineContacts } from 'react-icons/ai';
import { StarIcon, DeleteIcon, InfoIcon, EditIcon } from '@chakra-ui/icons';
import EditForm from './EditForm.tsx'
import ReactPaginate from 'react-paginate';

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  phones: { number: string }[];
}

const paginationStyles = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  list-style: none;
  margin-bottom: 30px;
`;

const pageNumberStyles = css`
  margin: 0 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  list-style: none;
  &:hover {
    border: 1px solid;
  }
`;

const GetContactList = () => {

  const [searchTerm, setSearchTerm] = useState<string>("");
  const dispatch = useDispatch()
  const [contacts, setContacts] = useState<any[]>([]);
  const [ deleteContact ] = useMutation(DELETE_CONTACT);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [modalStates, setModalStates] = useState<{ [key: number]: boolean }>({});


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const favoriteContacts = useSelector(
    (state:any) => state.favorite.favoriteContacts
  );
    
  const { loading, error, data } = useQuery(LOAD_CONTACT_LIST);

  const { loading: searchLoading, error: searchError, data: searchData } = useQuery(SEARCH_CONTACTS, {
    variables: {
      searchTerm: `%${searchTerm}%`,
    },
    skip: !searchTerm, 
  });

  const searchContacts = searchData ? searchData.contact : [];
  
  // useEffect(() => {
  //   if (data) {
  //     setContacts(data.contact);
  //     localStorage.setItem("contacts", JSON.stringify(data));
  //   }
  // }, [data])

  useEffect(() => {
    if (data) {
      setContacts(data.contact);
      localStorage.setItem("contacts", JSON.stringify(data));
      const initialModalStates = data.contact.reduce(
        (acc: { [key: number]: boolean }, contact: Contact) => ({ ...acc, [contact.id]: false }),
        {}
      );
      setModalStates(initialModalStates);
    }
    
  }, [data])

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentContacts = contacts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = ({ selected }: any) => {
    setCurrentPage(selected + 1);
  };

  // const handleDelete = async (id: number) => {
  //   try {
  //     await deleteContact({
  //       variables: { id },
  //       refetchQueries: [{ query: LOAD_CONTACT_LIST, variables: { id } }]
  //     });
  //     const removedContact = favoriteContacts.find((contact: any) => contact.id === id);
  //     if (removedContact) {
  //       dispatch(removeFromFavorite(id));
  //       setContacts((prevContacts) => [...prevContacts, removedContact]);
  //     }
  //     console.log("Contact deleted successfully");
  //     alert("Contact deleted successfully")
  //   } catch (error) {
  //     console.error("Error deleting contact");
  //     // console.error("Error deleting contact:", error.message);
  //   }
  // };
  const handleDelete = async (id: number) => {
    try {
      await deleteContact({
        variables: { id },
        refetchQueries: [{ query: LOAD_CONTACT_LIST }],
      });
      dispatch(removeFromFavorite(id));  
      console.log("Contact deleted successfully");
      alert("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };
  

  const handleFavoriteClick = (contact: any) => {
    dispatch(addToFavorite(contact));
    setContacts((prevContacts) => prevContacts.filter((c) => c.id !== contact.id));
  };

  // const handleRemoveFavorite = (contactId: number) => {
  //   const removedContact = favoriteContacts.find((contact: any) => contact.id === contactId);
  //   if (removedContact) {
  //     dispatch(removeFromFavorite(contactId));
  //     setContacts((prevContacts) => [...prevContacts, removedContact]);
  //   }
  // };

  const handleRemoveFavorite = (contactId: number) => {
    const removedContact = favoriteContacts.find((contact: any) => contact.id === contactId);
    if (removedContact) {
      dispatch(removeFromFavorite(contactId));
      if (!contacts.some((contact: any) => contact.id === contactId)) {
        setContacts((prevContacts) => [...prevContacts, removedContact]);
      }
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;


  // const filteredContacts = contacts.filter(contact =>
  //   !favoriteContacts.some((favorite: any) => favorite.id === contact.id) && 
  //   (contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
  // );

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  //   console.log("Modal opened");
  // }

  const handleOpenModal = (contactId: number) => {
    setModalStates((prevModalStates) => ({
      ...prevModalStates,
      [contactId]: true
    }));
    console.log("Modal opened for contact ID:", contactId);
    console.log("modalStates after update:", modalStates);
  };
  


  return (
    <div>
        <div>
            <div className={css`display: flex; justify-content: center; align-items: center;`}>
              <h1 className={css`font-weight: bold; font-size: 20px; color: #141E46;`}>Favorites Contact :</h1>
            </div>
          <Swiper
           slidesPerView={isSmallScreen ? 1 : 3} 
           spaceBetween={10}
           pagination={{
             clickable: true,
           }}
           modules={[Pagination]}
           className="mySwiper"
          >
            {favoriteContacts.length > 0 ? (
              favoriteContacts.map((value: any) => (
              <SwiperSlide key={value.id}>
              <div className={css`display: flex;justify-content: center; flex-wrap:wrap; flex-direction: column;  align-items: center; border: 1px solid transparent; border-radius: 10px; margin: 10px; padding: 10px; width: 350px; box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset; &:hover{border: 1px solid;}`} key={value.id} >
                <div className={css`display:flex; flex-direction: row; align-items: center;`}>
                  <div>
                    <AiOutlineContacts /> 
                  </div>
                  <div className={css`margin-left: 20px;`}>
                    <p>{value.first_name} {value.last_name}</p>
                  </div>
                </div>
                {value.phones.map((valuePhone: any) => (
                <div className={css`display:flex; flex-direction: row; align-items: center;`}>
                  <div>
                      <AiOutlinePhone /> 
                  </div>
                  <div className={css`margin-left: 20px;`}>
                      <p>{valuePhone.number}</p>
                  </div>
                </div>
                ))}
                <div className={css`display: flex; justify-content: flex-end; flex-direction: row; margin: 10px;`}>
                  <div className={css`margin-left: 10px;`}>
                    <button onClick={() => handleRemoveFavorite(value.id)}>
                      <StarIcon /> 
                    </button>
                  </div>
                  <div className={css`margin-left: 10px;`}>
                  <Link to={`/detail/${value.id}`}>
                    <button>
                      <InfoIcon /> 
                    </button>
                  </Link>
                  </div>
                  <button className={css`margin-left: 10px;`} onClick={() => {handleOpenModal(value.id)}}>
                    <EditIcon />
                  </button>
                  <div className={css`margin-left: 10px;`}>
                    <button onClick={() => {handleDelete(value.id)}}>
                      <DeleteIcon /> 
                    </button>
                  </div>
                </div>
              </div>
              </SwiperSlide>
              ))
            ) : (
              <div className={css`display: flex; justify-content: center; align-items: center;`}>
                <p className={css`font-weight: bold; color: #141E46;`}>No favorite contacts yet.</p>
              </div>
            )}
          </Swiper>
        </div>
        <div className={css`display: flex; justify-content: center; align-items: center; margin: 20px;`}>
            <input
              type="text"
              placeholder="Search By First/Last Name"
              value={searchTerm}
              className={css`  
                width: 250px;
                height: 100%;
                border: 1px solid;
                padding: 10px 40px 10px 20px; 
                background: white;
                border-radius: 5px;
                &:not(:focus) {
                  border: 1px solid; 
                }`}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            <div className={css`
              position: absolute;
              top: 50%;
              right: 10px;
              transform: translateY(-50%);
            `}>
            </div>
        </div>
      <div className={css`display: flex;flex-direction: row;justify-content: center;flex-wrap: wrap; margin: 10px;`}>
      {(searchTerm ? searchContacts : currentContacts).filter((contact: Contact) => !favoriteContacts.some((favorite: any) => favorite.id === contact.id))?.length === 0 ? (
          <p>No matching contacts found.</p>
        ) : (
          (searchTerm ? searchContacts : currentContacts).filter((contact: Contact) => !favoriteContacts.some((favorite: any) => favorite.id === contact.id)).map(({ id, first_name, last_name, phones }: Contact) => (
          <div className={css`display: flex;justify-content: center;flex-direction: column;  border: 1px solid transparent; border-radius: 10px; margin: 10px; padding: 10px; width: 350px; box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset; &:hover{border: 1px solid;}`} key={id} >
              <div className={css`display:flex; flex-direction: row; align-items: center;`}>
                <div>
                  <AiOutlineContacts /> 
                </div>
                <div className={css`margin-left: 20px;`}>
                  <p>{first_name} {last_name}</p>
                </div>
              </div>
              {phones.map((value) => (
                <div className={css`display:flex; flex-direction: row; align-items: center;`}>
                  <div>
                      <AiOutlinePhone /> 
                  </div>
                  <div className={css`margin-left: 20px;`}>
                      <p>{value.number}</p>
                  </div>
                </div>
              ))}
              <div className={css`display: flex; justify-content: flex-end; flex-direction: row; margin: 10px;`}>
                <div className={css`margin-left: 10px;`}>
                  <button onClick={() => handleFavoriteClick({ id, first_name, last_name, phones })}>
                    <StarIcon /> 
                  </button>
                </div>
                <div className={css`margin-left: 10px;`}>
                <Link to={`/detail/${id}`}>
                  <button>
                    <InfoIcon /> 
                  </button>
                </Link>
                </div>
                <div>
                  {/* <button className={css`margin-left: 10px;`} onClick={handleOpenModal}>
                    <EditIcon />
                  </button>
                  <EditForm contactId={id} currentFirstName={first_name} currentLastName={last_name} isModalOpen={isModalOpen} closeModal={setIsModalOpen}  /> */}
                  <button className={css`margin-left: 10px;`} onClick={() => handleOpenModal(id)}>
                    <EditIcon />
                  </button>
                  <EditForm
                    contactId={id}
                    currentFirstName={first_name}
                    currentLastName={last_name}
                    isModalOpen={modalStates[id] || false}
                    closeModal={() => setModalStates((prevModalStates) => ({ ...prevModalStates, [id]: false }))}
                  />
                    {/* <button
                    className={css`margin-left: 10px;`}
                    onClick={() => openModal(id)}
                  >
                    <EditIcon />
                  </button>
                  <EditForm
                    contactId={id}
                    currentFirstName={first_name}
                    currentLastName={last_name}
                    isModalOpen={modalStates[id] || false}
                    closeModal={() => closeModal(id)}
                  /> */}
                </div>
                <div className={css`margin-left: 10px;`}>
                  <button onClick={() => {handleDelete(id)}}>
                    <DeleteIcon /> 
                  </button>
                </div>
              </div>
          </div>
          ))
        )}
      </div>
      <div className={css`display: flex; flex-direction: column; justify-content: center; align-items: center;`}>
      {currentPage}
      <ReactPaginate
          onPageChange={paginate}
          pageCount={Math.ceil(contacts.length / postsPerPage)}
          previousLabel={'Prev'}
          nextLabel={'Next'}
          containerClassName={paginationStyles}
          pageLinkClassName={pageNumberStyles}
          previousLinkClassName={pageNumberStyles}
          nextLinkClassName={pageNumberStyles}
        />
      </div>
    </div>
  )
}

export default GetContactList