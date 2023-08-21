import React, { useState, useEffect } from 'react'
import { ADD_CONTACT } from '../GraphQL/Mutation.tsx';
import { useMutation, useQuery  } from '@apollo/client';
import { css } from '@emotion/css';
import { LOAD_CONTACT_LIST } from '../GraphQL/Queries.tsx';
import { CgRemove } from 'react-icons/cg'

const addPhoneNumberButtonStyles = css`
  background-color: #141E46;
  color: white;
  border: 1px solid;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 5px;
`;

const removePhoneNumberButtonStyles = css`
  background-color: #FF6969;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
`;

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




const Form = () => {

    const [contacts, setContacts] = useState<any[]>([]);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>([""]);

    const handlePhoneNumberChange = (value: string, index: number) => {
      const newPhoneNumbers = [...phoneNumbers];
      newPhoneNumbers[index] = value;
      setPhoneNumbers(newPhoneNumbers);
    };
    
    const addPhoneNumberInput = () => {
      setPhoneNumbers([...phoneNumbers, ""]);
    };
    
    const removePhoneNumberInput = (index: number) => {
      const newPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
      setPhoneNumbers(newPhoneNumbers);
    };

    const [ isOpen, setIsOpen ] = useState(false);

    const { loading, error, data } = useQuery(LOAD_CONTACT_LIST, {  
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (data) {
          setContacts(data.contact);
        }
    }, [data])


  
    const [addContact] = useMutation(ADD_CONTACT);

    const handleAddContact = async () => {

        if (!firstName || !lastName || !phoneNumbers) {
            alert("All fields are required.");
            return;
          }

          const hasEmptyPhoneNumbers = phoneNumbers.some(number => !number.trim());
          if (hasEmptyPhoneNumbers) {
            alert("Phone numbers must not be empty.");
            return;
          }

        const contactExists = contacts.some(
            contact =>
              contact.first_name.toLowerCase() === firstName.toLowerCase() ||
              contact.last_name.toLowerCase() === lastName.toLowerCase()
          );
      
          if (contactExists) {
            alert("Contact with the same first name or last name already exists.");
            return;
          }
      
          const nameRegex = /^[a-zA-Z0-9 ]*$/;
          if (!firstName.match(nameRegex) || !lastName.match(nameRegex)) {
            alert("Contact names must only contain letters, numbers, and spaces.");
            return;
          }

        try {
            await addContact({
              variables: {
                first_name: firstName,
                last_name: lastName,
                phones: phoneNumbers.map((number) => ({ number })),
              },
              refetchQueries: [{ query: LOAD_CONTACT_LIST }]
            });
            alert("Contact added successfully");
            setFirstName("");
            setLastName("");
            setPhoneNumbers([""]);
          } catch (error) {
            console.error("Error adding contact");
          }
    }

  return (
    <div className={css`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 10px 35px 10px 10px;
    `}>
    {isOpen ?
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
                <h2>Add New Contact</h2>
                <div className={css`
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                `}>
                  <input
                    className={css`
                      height: 2.5rem;
                      width: 100%;
                      padding: 0 1.25rem;
                      border: 1px solid #ccc;
                      border-radius: 5px;
                      margin: 0.625rem auto;
                    `}
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    className={css`
                      height: 2.5rem;
                      width: 100%;
                      padding: 0 1.25rem;
                      border: 1px solid #ccc;
                      border-radius: 5px;
                      margin: 0.625rem auto;
                    `}
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  {phoneNumbers?.map((number, index) => (
                    <div key={index} className={css`
                      display: flex;
                      align-items: center;
                      width: 100%;
                    `}>
                      <input
                        key={index}
                        className={css`
                          height: 2.5rem;
                          flex: 1;
                          padding: 0 1.25rem;
                          border: 1px solid #ccc;
                          border-radius: 5px;
                          margin: 0.625rem auto;
                        `}
                        type="text"
                        placeholder={`Phone Number ${index + 1}`}
                        value={number}
                        onChange={(e) => handlePhoneNumberChange(e.target.value, index)}
                      />
                      {index > 0 && (
                        <button
                          className={removePhoneNumberButtonStyles}
                          onClick={() => removePhoneNumberInput(index)}
                        >
                          <CgRemove />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className={addPhoneNumberButtonStyles}
                    onClick={addPhoneNumberInput}
                  >
                    Add Phone Number
                  </button>
                </div>
                <div className={css`
                    display: flex;
                    justify-content: right;
                    align-items: center;
                    margin-top: 10px;
                `}>
                    <button onClick={handleAddContact} className={buttonSave}>Create</button>
                    <button onClick={() => setIsOpen(false)} className={buttonCancel}>Close</button>
                </div>
            </div>
        </div>
        :
        <button
            className={css`
            appearance: none;
            background-color: #F56565;
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
            &:hover {
            background-color: #E53E3E;
            }`}
            onClick={() => {
                setIsOpen(true);
            }}
         >
            Add Contact
        </button>
    }
    </div>
  )
}

export default Form