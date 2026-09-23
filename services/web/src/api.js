export const API_BASE = "http://127.0.0.1:8000";

const handleResponse = async (res) => {
    if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('hidewin_token');
        window.location.href = '/login';
        throw new Error("Session expired. Redirecting to login...");
    }
    if (!res.ok) throw new Error(`API Request failed with status ${res.status}`);
    return { data: await res.json() };
};

const api = {
    get: async (url) => {
        const token = localStorage.getItem('hidewin_token');
        const res = await fetch(API_BASE + url, {
            headers: { 'Authorization': token ? 'Bearer ' + token : '' }
        });
        return handleResponse(res);
    },
    post: async (url, data) => {
        const token = localStorage.getItem('hidewin_token');
        const res = await fetch(API_BASE + url, {
            method: 'POST',
            headers: { 
                'Authorization': token ? 'Bearer ' + token : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data || {})
        });
        return handleResponse(res);
    },
    put: async (url, data) => {
        const token = localStorage.getItem('hidewin_token');
        const res = await fetch(API_BASE + url, {
            method: 'PUT',
            headers: { 
                'Authorization': token ? 'Bearer ' + token : '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data || {})
        });
        return handleResponse(res);
    },
    getBaseUrl: () => API_BASE,
    delete: async (url) => {
        const token = localStorage.getItem('hidewin_token');
        const res = await fetch(API_BASE + url, {
            method: 'DELETE',
            headers: { 
                'Authorization': token ? 'Bearer ' + token : ''
            }
        });
        return handleResponse(res);
    }
};

export default api;
