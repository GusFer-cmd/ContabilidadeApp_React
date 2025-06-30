import { Box, Grid, Typography } from "@mui/material";
import { app, auth } from "../../firebaseConfig";
import { getDatabase, ref, get } from "firebase/database";
import { useState, useEffect } from "react";
import CardItem from "../Card/CardItem";
import CustomContainer from "../Container/CustomContainer";
import ResponsiveAppBar from "../Menu/ResponsiveAppBar";

function Dashboard() {
    const [cardArray, setCardArray] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(setUser);
    }, []);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "cards");
        try {
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                const cards = Object.entries(data).map(([id, value]) => ({
                id,
                ...value,
                }));
                setCardArray(cards);
            } else {
                setCardArray([]);
                console.log("Nenhum dado encontrado.");
            }
            } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Box>
            <ResponsiveAppBar user={user} />
            <CustomContainer>
                {cardArray.length === 0 ? (
                    <Typography variant="h6" align="center" py={4}>
                        Nenhum imóvel carregado ainda
                    </Typography>
                ) : (
                    <Grid container spacing={2} py={2}>
                        {cardArray.map((card) => (
                            <Grid item xs={12} sm={6} md={4} key={card.id}>
                                <CardItem 
                                    title={card.title} 
                                    description={card.description} 
                                    firebaseId={card.id}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </CustomContainer>
        </Box>
    );
}

export default Dashboard;