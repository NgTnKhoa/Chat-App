import {PayloadAction} from "@reduxjs/toolkit";
import {sendLogin, checkUser} from "../api/api";

const initialState: any = {
    messages: [],
    contacts: [],
}

const loadContacts = () => {
    return [];
}

export const Reducer = (state = initialState, action: PayloadAction<any>) => {
    switch (action.type) {
        case "Login": {
            sendLogin(action.payload)
            return {
                ...state,
            }
        }

        case "Check_User": {
            checkUser(action.payload)
            return {
                ...state,
            }
        }

        default: {
            return {
                ...state
            };
        }
    }
}
