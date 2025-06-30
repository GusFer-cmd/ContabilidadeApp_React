import React, { useState, useEffect } from 'react';
import { app, auth } from "../../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, push } from "firebase/database";
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import ResponsiveAppBar from "../Menu/ResponsiveAppBar";

function Create() {
    const [inputTitle, setInputTitle] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(setUser);
    }, []);

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!inputTitle) newErrors.inputTitle = "Nome do Imóvel é obrigatório.";
        if (!inputDescription) newErrors.inputDescription = "Endereço é obrigatório.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveData = async () => {
        if (!validateForm()) return;
        const db = getDatabase(app);
        const newDocRef = push(ref(db, "cards"));

        const currentDate = new Date().toISOString();

        set(newDocRef, {
            title: inputTitle,
            description: inputDescription,
            create_date: currentDate
        })
            .then(() => {
                alert("Dados salvos com sucesso!");
                setInputTitle("");
                setInputDescription("");
            })
            .catch((error) => {
                alert("Erro: " + error.message);
            });
    };

    const handleBack = () => {
        navigate("/card");
        window.location.reload();
    }

    return (
        <Box>
            <ResponsiveAppBar user={user} />
            <Box sx={{ p: 4, maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
            
            {Object.keys(errors).length > 0 && (
                <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                    {Object.values(errors).map((error, index) => (
                        <div key={index}>• {error}</div>
                    ))}
                    </Alert>
            )}

                <Typography variant="h4" gutterBottom>
                    Adicionar Imóvel
                </Typography>

                <TextField
                    fullWidth
                    label="Imóvel"
                    variant="outlined"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Endereço"
                    variant="outlined"
                    value={inputDescription}
                    onChange={(e) => setInputDescription(e.target.value)}
                    margin="normal"
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBack}
                        sx={{ mt: 2 }}
                    >
                        Voltar
                    </Button>
                
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={saveData}
                        sx={{ mt: 2 }}
                    >
                        Criar Imóvel
                    </Button>
                </Box>
            </Box> 
        </Box>       
    );
}

export default Create;