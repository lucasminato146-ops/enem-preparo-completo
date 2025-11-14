// NOTE: This is a mock authentication service using localStorage.
// In a real application, this would be replaced with API calls to a secure backend.
// Passwords are stored in plaintext for simplicity, which is NOT secure.

const USERS_KEY = 'enem_users';
const CURRENT_USER_KEY = 'enem_current_user';

interface User {
    username: string;
    email: string;
}

interface UserWithPassword extends User {
    password?: string;
}

export const authService = {
    register: (username: string, email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const users: UserWithPassword[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
                const existingUser = users.find(u => u.email === email);

                if (existingUser) {
                    reject(new Error('Um usuário com este e-mail já existe.'));
                    return;
                }

                const newUser: UserWithPassword = { username, email, password };
                users.push(newUser);
                localStorage.setItem(USERS_KEY, JSON.stringify(users));

                const sessionUser = { username, email };
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
                resolve(sessionUser);
            }, 500);
        });
    },

    login: (email: string, password: string): Promise<User> => {
         return new Promise((resolve, reject) => {
            setTimeout(() => { // Simulate network delay
                const users: UserWithPassword[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
                const user = users.find(u => u.email === email && u.password === password);

                if (user) {
                    const sessionUser = { username: user.username, email: user.email };
                    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
                    resolve(sessionUser);
                } else {
                    reject(new Error('Credenciais inválidas. Verifique seu e-mail e senha.'));
                }
            }, 500);
        });
    },

    logout: (): void => {
        localStorage.removeItem(CURRENT_USER_KEY);
    },

    getCurrentUser: (): User | null => {
        const userJson = localStorage.getItem(CURRENT_USER_KEY);
        if (userJson) {
            try {
                return JSON.parse(userJson);
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                return null;
            }
        }
        return null;
    }
};