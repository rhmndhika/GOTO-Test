// import React from 'react';
// import { LOAD_CONTACT_DETAIL } from '../GraphQL/Queries';
// import { useQuery } from "@apollo/client";
// import { useParams } from 'react-router-dom';
// import { css } from '@emotion/css';


// interface Contact {
//   id: number;
//   first_name: string;
//   last_name: string;
//   phones: { number: string }[];
// }

// const ContactDetail = () => {

//     const { id } = useParams<{ id: string }>();
    
//     const { loading, error, data } = useQuery(LOAD_CONTACT_DETAIL, {
//         variables: { id }
//     });

//     console.log("id:", id);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error.message}</p>;

//     const contact: Contact = data.contact_by_pk;

//     console.log("contact:", contact); 

//     return (
//       <div className={css`display: flex;flex-direction: row;justify-content: center;flex-wrap: wrap;`}>
//         <div className={css`display: flex;justify-content: center;flex-direction: column;border: 1px solid;margin: 10px;
//         padding: 10px; width: 350px; cursor: pointer; &:hover{ background-color: black;}`} key={id}>
//             <h2>ID: {contact.id}</h2>
//             <h3>
//                 Fullname: {contact.first_name} {contact.last_name}
//             </h3>
//             <p>First Phone Number: {contact.phones[0]?.number}</p>
//         </div>
//     </div>
//     );
// };

// export default ContactDetail;
import React from 'react';
import { LOAD_CONTACT_DETAIL } from '../GraphQL/Queries';
import { useQuery } from "@apollo/client";
import { useParams } from 'react-router-dom';
import { css } from '@emotion/css';


interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  phones: { number: string }[];
}

const ContactDetail = () => {
    const { id } = useParams<{ id: string }>();
    
    const { loading, error, data } = useQuery(LOAD_CONTACT_DETAIL, {
        variables: { id }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const contact: Contact = data.contact_by_pk;

    return (
      <div className={css`
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f7f7f7;
      `}>
        <div className={css`
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        `}>
          <div className={css`
            background-image: url("https://bit.ly/dan-abramov");
            background-size: cover;
            height: 200px;
          `}></div>
          <div className={css`
            padding: 20px;
            color: #333;
          `}>
            <h2 className={css`
              font-size: 24px;
              margin-bottom: 8px;
            `}> ID: {contact.id}</h2>
            <h3 className={css`
              font-size: 20px;
              margin-bottom: 4px;
            `}>
              Fullname: {contact.first_name} {contact.last_name}
            </h3>
            <p className={css`
              font-size: 16px;
              margin-bottom: 0;
            `}>First Phone Number: {contact.phones[0]?.number}</p>
          </div>
        </div>
      </div>
    );
};

export default ContactDetail;
