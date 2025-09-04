import { createContext, useContext, useState, useEffect } from 'react';

const FAVORITES_KEY = 'omdb-favorites';

const FavoritesContext = createContext();

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Carregar favoritos do localStorage na inicialização
    useEffect(() => {
        const savedFavorites = localStorage.getItem(FAVORITES_KEY);
        if (savedFavorites) {
            try {
                const parsed = JSON.parse(savedFavorites);
                setFavorites(parsed);
            } catch (error) {
                console.error('Erro ao carregar favoritos:', error);
                setFavorites([]);
            }
        }
    }, []);

    // Salvar favoritos no localStorage sempre que a lista mudar
    useEffect(() => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }, [favorites]);

    // Adicionar filme aos favoritos
    const addToFavorites = (movie) => {
        if (!movie || !movie.imdbID) {
            console.error('Filme inválido para adicionar aos favoritos');
            return false;
        }

        // Verificar se o filme já está nos favoritos
        const isAlreadyFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);

        if (!isAlreadyFavorite) {
            setFavorites(prev => [...prev, movie]);
            return true; // Indica que foi adicionado com sucesso
        }

        return false; // Indica que já estava nos favoritos
    };

    // Remover filme dos favoritos
    const removeFromFavorites = (imdbID) => {
        setFavorites(prev => prev.filter(fav => fav.imdbID !== imdbID));
    };

    // Verificar se um filme está nos favoritos
    const isFavorite = (imdbID) => {
        return favorites.some(fav => fav.imdbID === imdbID);
    };

    // Alternar status de favorito (adicionar se não estiver, remover se estiver)
    const toggleFavorite = (movie) => {
        if (!movie || !movie.imdbID) {
            console.error('Filme inválido para alternar favorito:', movie);
            return false;
        }

        if (isFavorite(movie.imdbID)) {
            removeFromFavorites(movie.imdbID);
            return false; // Indica que foi removido
        } else {
            addToFavorites(movie);
            return true; // Indica que foi adicionado
        }
    };

    // Limpar todos os favoritos
    const clearFavorites = () => {
        setFavorites([]);
    };

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        favoritesCount: favorites.length
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};
