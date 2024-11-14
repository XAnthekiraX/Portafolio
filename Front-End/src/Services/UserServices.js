import axios from "axios"

const CLIENTE_BASE_REST_API_URL = 'http://localhost:8080/api/users';

class UsersService{
    
    getAllUser(username, password){
        return axios.get(`${CLIENTE_BASE_REST_API_URL}/login?username=${username}&password=${password}`);
    }
}


export default UsersService;