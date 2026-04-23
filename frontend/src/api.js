const BASE_URL = 'https://api.bawpets.online/api';

async function request(endpoint, { method = 'GET', body, token } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json();
    if (!res.ok) throw data;
    return data;
}

const token = () => localStorage.getItem('access');

export const authAPI = {
    register: (body) => request('/auth/register/', { method: 'POST', body }),
    login:    (body) => request('/auth/login/',    { method: 'POST', body }),
    logout:   (refresh) => request('/auth/logout/', { method: 'POST', body: { refresh }, token: token() }),
    me:       () => request('/auth/me/', { token: token() }),
};

export const petAPI = {
    list:   ()     => request('/pets/', { token: token() }),
    create: (body) => request('/pets/', { method: 'POST', body, token: token() }),
    update: (id, body) => request(`/pets/${id}/`, { method: 'PUT', body, token: token() }),
    remove: (id)   => request(`/pets/${id}/`, { method: 'DELETE', token: token() }),
};

export const appointmentAPI = {
    list:   ()     => request('/appointments/', { token: token() }),
    create: (body) => request('/appointments/', { method: 'POST', body, token: token() }),
};

export const dashboardAPI = {
    get: () => request('/dashboard/', { token: token() }),
};

export const staffAPI = {
    appointments:      ()         => request('/staff/appointments/',        { token: token() }),
    updateAppointment: (id, body) => request(`/staff/appointments/${id}/`,  { method: 'PUT', body, token: token() }),
    invoices:          ()         => request('/staff/invoices/',            { token: token() }),
    createInvoice:     (body)     => request('/staff/invoices/create/',     { method: 'POST', body, token: token() }),
    updateInvoice:     (id, body) => request(`/staff/invoices/${id}/`,      { method: 'PUT', body, token: token() }),
    // doctors
    doctors:           ()         => request('/staff/doctors/',             { token: token() }),
    createDoctor:      (body)     => request('/staff/doctors/create/',      { method: 'POST', body, token: token() }),
    updateDoctor:      (id, body) => request(`/staff/doctors/${id}/`,       { method: 'PUT', body, token: token() }),
    deleteDoctor:      (id)       => request(`/staff/doctors/${id}/`,       { method: 'DELETE', token: token() }),
    // earnings
    earnings:          ()         => request('/staff/earnings/',            { token: token() }),
    createEarning:     (body)     => request('/staff/earnings/',            { method: 'POST', body, token: token() }),
    updateEarning:     (id, body) => request(`/staff/earnings/${id}/`,      { method: 'PUT', body, token: token() }),
    deleteEarning:     (id)       => request(`/staff/earnings/${id}/`,      { method: 'DELETE', token: token() }),
};

export const doctorAPI = {
    dashboard: () => request('/doctor/dashboard/', { token: token() }),
};
