import { Box, Button, Grid, Typography } from "@mui/material";
import { app, auth } from "../../firebaseConfig";
import { getDatabase, ref, get } from "firebase/database";
import { useState, useEffect } from "react";
import CardItem from "../Card/CardItem";
import CustomContainer from "../Container/CustomContainer";
import ResponsiveAppBar from "../Menu/ResponsiveAppBar";

function Dashboard() {
    const [cardArray, setCardArray] = useState([]);
    const [user, setUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cardArray.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(cardArray.length / itemsPerPage);

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
                        {currentItems.map((card) => (
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

                <Box display="flex" justifyContent="center" my={2}>
                    <Button 
                        variant="contained"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <Typography mx={2}>{currentPage} de {totalPages}</Typography>
                    <Button 
                        variant="contained"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                        disabled={currentPage === totalPages}
                    >
                        Próxima
                    </Button>
                </Box>
            </CustomContainer>
        </Box>
    );
}

export default Dashboard;