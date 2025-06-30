import React, { useState, useEffect } from 'react';
import { app, auth } from "../../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, push } from "firebase/database";
import { TextField, Button, Box, Typography, MenuItem, Alert } from '@mui/material';
import ResponsiveAppBar from "../Menu/ResponsiveAppBar";

function RenterCreate() {
    const [inputName, setInputName] = useState("");
    const [inputAssignedSex, setInputAssignedSex] = useState("");
    const [inputTelephone, setInputTelephone] = useState("");
    const [inputEmail, setInputEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(setUser);
    }, []);

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!inputName) newErrors.inputName = "Nome é obrigatório.";
        if (!inputAssignedSex) newErrors.inputAssignedSex = "Sexo Atribuído é obrigatório.";
        if (!inputTelephone) newErrors.inputTelephone = "Telefone é obrigatório.";
        if (!inputEmail) newErrors.inputEmail = "Email é obrigatório.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const saveData = async () => {
        if (!validateForm()) return;
        const db = getDatabase(app);
        const newDocRef = push(ref(db, "renters"));

        set(newDocRef, {
            name: inputName,
            assigned_sex: inputAssignedSex,
            telephone: inputTelephone,
            email: inputEmail
        })
            .then(() => {
                alert("Dados salvos com sucesso!");
                setInputName("");
                setInputAssignedSex("");
                setInputTelephone("");
                setInputEmail("");
            })
            .catch((error) => {
                alert("Erro: " + error.message);
            });
    };

    const handleBack = () => {
        navigate("/renter");
        window.location.reload();
    }

    const sexOptions = [
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Feminino', label: 'Feminino' },
        { value: 'Outro', label: 'Outro' },
    ];

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
                    Adicionar Locatário
                </Typography>
        
                <TextField
                    fullWidth
                    label="Nome do Locatário"
                    variant="outlined"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    margin="normal"
                />
        
                <TextField
                    fullWidth
                    select
                    label="Sexo Atribuído"
                    variant="outlined"
                    value={inputAssignedSex}
                    onChange={(e) => setInputAssignedSex(e.target.value)}
                    margin="normal"
                >
                    {sexOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    fullWidth
                    label="Telefone"
                    variant="outlined"
                    value={inputTelephone}
                    onChange={(e) => setInputTelephone(e.target.value)}
                    margin="normal"
                    type="tel"
                    placeholder="(99) 99999-9999"
                />

                <TextField
                    fullWidth
                    label="E-mail"
                    variant="outlined"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    margin="normal"
                    type="email"
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
                        Criar Locatário
                    </Button>
                </Box>
            </Box>
        </Box>        
    );
}

export default RenterCreate;