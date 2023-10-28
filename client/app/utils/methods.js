export const isValidObjField = (obj) => {
    return Object.values(obj).every((value) => value.trim());
}

export const updateError = (error, setError) => {
    setError(error);
    setTimeout(() => {
        setError("");
    }
    , 3000);
};

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} 