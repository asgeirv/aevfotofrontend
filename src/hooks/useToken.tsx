import {useState} from "react";
import {jwtDecode, type JwtPayload} from "jwt-decode";

export default function useToken() {
    const getToken: () => (null | any) = () => {
        const tokenString: string | null = localStorage.getItem("token");
        if (!tokenString) {
            return null;
        }

        const userToken = JSON.parse(tokenString);
        const token = userToken?.token;

        if (!token) {
            return null;
        }

        try {
            const payload: JwtPayload = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (payload.exp < currentTime) {
                localStorage.removeItem("token");
                return null;
            }

            return token;
        } catch (err) {
            localStorage.removeItem("token");
            return null;
        }
    };

    const [token, setToken] = useState(getToken());

    const saveToken: (userToken) => void = userToken => {
        localStorage.setItem("token", JSON.stringify(userToken));
        setToken(userToken.token);
    };

    const removeToken: () => void = () => {
        localStorage.removeItem("token");
        setToken(null);
    }

    return {
        setToken: saveToken,
        token,
        removeToken
    }
}