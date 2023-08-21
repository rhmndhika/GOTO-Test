import { gql } from "@apollo/client";

export const LOAD_CONTACT_LIST = gql`
  query GetContactList {
    contact {
      id
      first_name
      last_name
      created_at
      phones {
        number
      }
    }
  }
`;

export const SEARCH_CONTACTS = gql`
  query SearchContacts($searchTerm: String!) {
    contact(where: {
      _or: [
        { first_name: { _ilike: $searchTerm } },
        { last_name: { _ilike: $searchTerm } }
      ]
    }) {
      id
      first_name
      last_name
      created_at
      phones {
        number
      }
    }
  }
`;


export const LOAD_CONTACT_DETAIL = gql`
  query GetContactDetail($id: Int!){
    contact_by_pk(id: $id) {
    last_name
    id
    first_name
    created_at
    phones {
      number
    }
  }
  }
`;

