import { supabase } from './supabase';

export const getEvents = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(e => ({ ...e, image: e.image_url }));
};

export const getEventBySlug = async (slug) => {
    const { data, error } = await supabase
        .from('events')
        .select('*, batches(*)')
        .eq('slug', slug)
        .single();

    if (error) throw error;
    if (data) data.image = data.image_url;
    return data;
};

export const getInstitutes = async () => {
    const { data, error } = await supabase
        .from('institutes')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.warn("Could not fetch institutes:", error);
        return [];
    }
    return data;
};

export const registerStudent = async (studentData, registrationData) => {
    const { data, error } = await supabase.rpc('register_student_transaction', {
        p_full_name: studentData.full_name,
        p_phone: studentData.phone,
        p_email: studentData.email,
        p_institute_code: studentData.institute_code,
        p_student_class: studentData.student_class || null,
        p_event_id: registrationData.event_id,
        p_batch_id: registrationData.batch_id
    });

    if (error) throw error;
    return data;
};

export const createPayment = async (paymentData) => {
    const { error } = await supabase
        .from('payments')
        .insert(paymentData);

    if (error) throw error;
};

