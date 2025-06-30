import { app, auth } from "../../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import { NumericFormat } from 'react-number-format';
import {
  Button,
  Box,
  Alert,
  TextField 
} from '@mui/material';
import ResponsiveAppBar from "../Menu/ResponsiveAppBar";

function InfoUpdate() {
    const { cardId, firebaseId } = useParams();

    const navigate = useNavigate();

    const [renters, setRenters] = useState([]);
    const [cardTitle, setCardTitle] = useState("");
    const [inputRenterId, setInputRenterId] = useState("");
    const [inputCardId, setInputCardId] = useState(cardId || "");
    const [inputPaymentDate, setInputPaymentDate] = useState("");
    const [inputPaymentValue, setInputPaymentValue] = useState("");
    const [errors, setErrors] = useState({});
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        auth.onAuthStateChanged(setUser);
    }, []);

    useEffect(() => {
        const db = getDatabase(app);
        const rentersRef = ref(db, "renters");
    
        onValue(rentersRef, (snapshot) => {
            const data = snapshot.val();
                if (data) {
                    const rentersArray = Object.entries(data).map(([id, value]) => ({
                        id,
                        ...value,
                    }));
                    setRenters(rentersArray);
                    }
                });
    }, []);

    useEffect(() => {
        if (!cardId) return;
    
        const db = getDatabase(app);
        const cardRef = ref(db, `cards/${cardId}`);
    
        onValue(cardRef, (snapshot) => {
            const data = snapshot.val();
                if (data && data.title) {
                    setCardTitle(data.title);
                    setInputCardId(cardId);
                }
            });
    }, [cardId]);


      useEffect(() => {
            const fetchData = async () => {
                const db = getDatabase(app);
                const dbRef = ref(db, "infos/" + firebaseId);
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const targetObject = snapshot.val();
                    setInputRenterId(targetObject.renter_id);
                    setInputCardId(targetObject.card_id);
                    setInputPaymentDate(targetObject.payment_date);
                    setInputPaymentValue(targetObject.payment_value);
                } else {
                alert("Nenhum dado encontrado.");
                }
            }
        fetchData();
    }, [firebaseId])


    const validateForm = () => {
        const newErrors = {};

        if (!inputRenterId) newErrors.inputRenterId = "Locatário é obrigatório.";
        if (!inputPaymentDate) newErrors.inputPaymentDate = "Data do pagamento é obrigatória.";
        if (!inputPaymentValue || parseFloat(inputPaymentValue) <= 0) {
            newErrors.inputPaymentValue = "Valor do pagamento é obrigatório.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const overwriteData = async () => {
        if (!validateForm()) return;
            const db = getDatabase(app);
            const newDocRef = ref(db, "infos/" + firebaseId);
            set(newDocRef, {
                renter_id: inputRenterId,
                card_id: inputCardId,
                payment_date: inputPaymentDate,
                payment_value: inputPaymentValue
            }).then(() => {
                alert("Dados salvos com sucesso!");
            })
            .catch((error) => {
                alert("Erro: " + error.message);
            });
    };

    const handleBack = () => {
        navigate(`/info/index/${cardId}`);
    };

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
                    <TextField
                        fullWidth
                        select
                        label="Selecione Locatário"
                        variant="outlined"
                        value={inputRenterId}
                        onChange={(e) => setInputRenterId(e.target.value)}
                        error={Boolean(errors.inputRenterId)}
                        margin="normal"
                            slotProps={{
                                select: { native: true },
                            }}
                    >
                        <option value="" disabled hidden></option>
                        {renters.map((renter) => (
                            <option key={renter.id} value={renter.id}>
                                {renter.name}
                            </option>
                        ))}
                    </TextField>
            
                    <TextField
                        fullWidth
                        label="Locação correspondente"
                        variant="outlined"
                        value={cardTitle}
                        disabled
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Data do pagamento"
                        type="date"
                        variant="outlined"
                        value={inputPaymentDate}
                        onChange={(e) => setInputPaymentDate(e.target.value)}
                        error={Boolean(errors.inputPaymentDate)}
                        margin="normal"
                        slotProps={{
                            inputLabel: { shrink: true }
                        }}
                    />

                    <NumericFormat
                        customInput={TextField}
                        fullWidth
                        label="Valor do Pagamento"
                        variant="outlined"
                        value={inputPaymentValue}
                        onValueChange={(values) => {
                            setInputPaymentValue(values.value);
                        }}
                        error={Boolean(errors.inputPaymentValue)}
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
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
                            Atualizar Pagamento
                        </Button>
                    </Box>
                </Box>
            </Box>        
        );
}

export default InfoUpdate;