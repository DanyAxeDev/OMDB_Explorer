import { Link } from "react-router-dom";
import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";

const Movie = ({ movie }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();

    // Validação para evitar erros quando movie for undefined
    if (!movie) {
        return null;
    }

    if (movie.Response === "False") {
        return (
            <div className="movie-card">
                <div className="movie-poster-container">
                    <div className="movie-poster-placeholder error-placeholder">
                        <span>❌</span>
                    </div>
                </div>
                <div className="movie-info">
                    <p style={{ color: 'var(--error)' }}>Erro: {movie.Error}</p>
                </div>
            </div>
        )
    }

    const handleImageLoad = () => {
        setImageLoaded(true);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageLoaded(true);
        setImageError(true);
    };

    const handleToggleFavorite = (e) => {
        e.preventDefault(); // Previne navegação quando clica no botão
        e.stopPropagation(); // Previne propagação do evento
        toggleFavorite(movie);
    };

    return (
        <div className="movie-card">
            <div className="movie-poster-container">
                {!imageLoaded && (
                    <div className="movie-poster-placeholder loading-placeholder">
                        <div className="loading-spinner-small"></div>
                        <span>Carregando...</span>
                    </div>
                )}

                {movie.Poster !== "N/A" && !imageError ? (
                    <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="movie-poster"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        style={{
                            opacity: imageLoaded ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                        }}
                    />
                ) : (
                    <div className="movie-poster-placeholder no-image-placeholder">
                        <div className="image-icon">
                            🎬
                        </div>
                        <span>Sem Imagem</span>
                    </div>
                )}
            </div>
            <div className="movie-info">
                <h3 className="movie-title">{movie.Title}</h3>
                <p className="movie-year">📅 {movie.Year}</p>
                <div className="movie-actions">
                    <Link to={`/details/${encodeURIComponent(movie.Title)}`} className="movie-link">
                        🎬 Ver Detalhes
                        <span style={{ fontSize: '1.2rem' }}>→</span>
                    </Link>
                    <button
                        className={`favorite-btn ${isFavorite(movie.imdbID) ? 'favorited' : ''}`}
                        onClick={handleToggleFavorite}
                        title={isFavorite(movie.imdbID) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        style={{
                            cursor: 'pointer',
                            zIndex: 10,
                            position: 'relative',
                            pointerEvents: 'auto'
                        }}
                    >
                        {isFavorite(movie.imdbID) ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Movie