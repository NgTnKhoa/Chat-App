export const login = (data: any) => {
    return {
        type: "Login",
        payload: data,
    }
}

export const checkUsername = (data: any) => {
    return {
        type: "Check_User",
        payload: data,
    }
}

export const getUser = (data: any) => {
    return {
        type: "Get_User",
        payload: data,
    }
}

