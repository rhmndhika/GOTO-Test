import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_CONTACT } from '../GraphQL/Mutation.tsx';
import { css } from '@emotion/css';


interface EditFormProps {
  contactId: number;
  currentFirstName: string;
  currentLastName: string;
  isModalOpen: boolean;
  closeModal: (flag: boolean) => void;
}



const buttonSave = css`
  appearance: none;
  background-color: #141E46;
  border: 1px solid rgba(27, 31, 35, .15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  padding: 6px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;

  &:focus {
    box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
    outline: none;
  }
`;

const buttonCancel = css`
  appearance: none;
  background-color: #FF6969;
  border: 1px solid rgba(27, 31, 35, .15);
  border-radius: 6px;
  box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
  box-sizing: border-box;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  padding: 6px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
  white-space: nowrap;
  margin-left: 10px;

  &:focus {
    box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
    outline: none;
  }
`;


const EditForm = ({ contactId, currentFirstName, currentLastName, isModalOpen,  closeModal }:EditFormProps) => {


  const [newFirstName, setNewFirstName] = useState(currentFirstName);
  const [newLastName, setNewLastName] = useState(currentLastName);
  const [editContact] = useMutation(EDIT_CONTACT);

  
  const handleEdit = async () => {
    try {
      await editContact({
        variables: {
          id: contactId,
          _set: {
            first_name: newFirstName,
            last_name: newLastName
          }
        }
      });
      console.log('Contact updated successfully');
    } catch (error) {
      console.error('Error updating contact');
    }
  };

  console.log(isModalOpen)

  return (
    <div>
      { isModalOpen &&  
        <div className={css`
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `}>
        <div className={css`
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            padding: 20px;
            width: 350px;
        `}>
            <h2>Edit Contact</h2>
            <div className={css`display:flex; flex-direction: column; justify-content: center; align-items: center;`}>
            <input
                className={css`
                height: 2.5rem;
                padding: 0 1.25rem;
                border: 1px solid;
                width: 100%;
                border-radius: 5px;
                margin: 0.625rem auto;
                `}
                type="text"
                placeholder="First Name"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                />
                <input
                className={css`
                height: 2.5rem;
                padding: 0 1.25rem;
                border: 1px solid;
                width: 100%;
                border-radius: 5px;
                margin: 0.625rem auto;
                `}
                type="text"
                placeholder="Last Name"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                />
            </div>
            <div className={css`
                display: flex;
                justify-content: right;
                align-items: center;
                margin-top: 10px;
            `}>
                <button onClick={handleEdit} className={buttonSave}>Save</button>
                <button onClick={() => closeModal(false)} className={buttonCancel}>Close</button>
            </div>
        </div>
      </div> 
      }
    </div>
  );
};

export default EditForm;
