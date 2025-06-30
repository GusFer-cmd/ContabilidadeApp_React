import { app, auth } from "../../firebaseConfig";
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set, get } from "firebase/database";
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useParams, useNavigate  } from 'react-router-dom';
import ResponsiveAppBar from "../Menu/ResponsiveAppBar";

function Update() {
    const {firebaseId} = useParams();
    const navigate = useNavigate();

    const [inputTitle, setInputTitle] = useState("");
    const [inputDescription, setInputDescription] = useState("");
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(setUser);
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            const db = getDatabase(app);
            const dbRef = ref(db, "cards/" + firebaseId);
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const targetObject = snapshot.val();
                setInputTitle(targetObject.title);
                setInputDescription(targetObject.description);
            } else {
            alert("Nenhum dado encontrado.");
            }
        }
    fetchData();
    }, [firebaseId])

    const validateForm = () => {
        const newErrors = {};

        if (!inputTitle) newErrors.inputTitle = "Nome do Imóvel é obrigatório.";
        if (!inputDescription) newErrors.inputDescription = "Endereço é obrigatório.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const overwriteData = async () => {
        if (!validateForm()) return;
        const db = getDatabase(app);
        const newDocRef = ref(db, "cards/" + firebaseId);
        set(newDocRef, {
            title: inputTitle,
            description: inputDescription
        }).then(() => {
            alert("Dados salvos com sucesso!");
            navigate("/card");
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
                    Atualizar Imóvel
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
                        onClick={overwriteData}
                        sx={{ mt: 2 }}
                    >
                        Atualizar Imóvel
                    </Button>
                </Box>
            </Box>
        </Box>        
    );
}

export default Update;