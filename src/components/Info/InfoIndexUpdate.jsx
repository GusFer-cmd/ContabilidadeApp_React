import { app, auth } from "../../firebaseConfig";
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDatabase, ref, get, remove } from "firebase/database";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack
} from '@mui/material';
import ResponsiveAppBar from "../Menu/ResponsiveAppBar";

function InfoIndexUpdate() {
  const { cardId } = useParams();
  const [infoArray, setInfoArray] = useState([]);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);
    

  const fetchData = async () => {
    const db = getDatabase(app);

    const infosRef = ref(db, "infos");
    const cardsRef = ref(db, "cards");
    const rentersRef = ref(db, "renters");

    try {
      const [infosSnap, cardsSnap, rentersSnap] = await Promise.all([
        get(infosRef),
        get(cardsRef),
        get(rentersRef),
      ]);

      if (infosSnap.exists()) {
        const infos = infosSnap.val();
        const cards = cardsSnap.exists() ? cardsSnap.val() : {};
        const renters = rentersSnap.exists() ? rentersSnap.val() : {};

        const filteredInfos = Object.entries(infos)
          .filter(([key, value]) => value.card_id === cardId)
          .map(([key, value]) => ({
            ...value,
            infoId: key,
            cardTitle: cards[value.card_id]?.title || 'Título não encontrado',
            renterName: renters[value.renter_id]?.name || 'Nome não encontrado',
          }));

        setInfoArray(filteredInfos);
      } else {
        alert("Nenhum dado encontrado.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    const [year, month, day] = dateString.split("-");
    const date = new Date(year, month - 1, day);
    return format(date, "dd MMMM yyyy", { locale: ptBR });
 };

  const handleCreate = () => {
    navigate(`/info/create/${cardId}`);
  };
    
   const handleEdit = (firebaseId) => {
        navigate(`/info/${cardId}/${firebaseId}`);
   };

  const handleRemove = async (infoId) => {
    const db = getDatabase(app);
    const dbRef = ref(db, "infos/" + infoId);
    await remove(dbRef);
    fetchData();
  };

  return (
    <Box>
      <ResponsiveAppBar user={user} />
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Lista de Pagamentos
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchData}
          >
            Exibir Pagamentos
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreate}
          >
            Criar Pagamento
          </Button>
        </Box>

        {infoArray.length > 0 ? (
          <Paper elevation={3} sx={{ p: 2 }}>
            <List>
              {infoArray.map((item, index) => (
                <ListItem key={index} divider
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEdit(item.infoId)} 
                      >
                        Editar
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        onClick={() => handleRemove(item.infoId)}
                      >
                        Remover
                      </Button>
                    </Stack>
                  }>
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <>
                        <div><strong>Arquivo:</strong> {item.cardTitle}</div>
                        <div><strong>Locatário:</strong> {item.renterName}</div>
                        <div><strong>Data do pagamento:</strong> {formatDate(item.payment_date)}</div>
                        <div><strong>Valor do Pagamento:</strong> {'R$ ' + item.payment_value}</div>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        ) : (
          <Typography variant="body1" color="text.primary">
            Nenhum pagamento carregado ainda.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default InfoIndexUpdate;
