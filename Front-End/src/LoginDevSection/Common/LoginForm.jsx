import { useState } from "react";
import UsersService from "../../Services/UserServices";
import UsernameInput from "./UsernameInput";
import PasswordInput from "./PasswordInput";
import SubmitButton from "./SubmitButton";
import { setGlobalVariable } from "../../Cookies/cookieManager";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const usersService = new UsersService();

        try {
            const response = await usersService.getAllUser(username, password);
            if (response.data.loginStatus) {
                setGlobalVariable("loginStatus", true);
            }
        } catch {
            console.error("Error al intentar iniciar sesión");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="px-8 pt-6 pb-8 mb-4 bg-gray-800 rounded-lg shadow-md select-none">
            <h2 className="mb-6 text-3xl font-bold text-center text-purple-400">Login</h2>
            <UsernameInput username={username} setUsername={setUsername} />
            <PasswordInput password={password} setPassword={setPassword} />
            <SubmitButton />
        </form>
    );
}
