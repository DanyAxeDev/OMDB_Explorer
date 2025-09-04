import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";

export default function Details() {
    const { title } = useParams()

    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [imageError, setImageError] = useState(false)

    const { isFavorite, toggleFavorite } = useFavorites();
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;

    useEffect(() => {
        const searchDetails = async () => {
            setLoading(true)
            setImageLoaded(false) // Reset do estado da imagem
            setImageError(false) // Reset do estado de erro da imagem
            try {
                const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`)

                if (!response.ok) {
                    throw new Error("Falha na requisição")
                }

                const data = await response.json()
                setMovie(data)
            } catch (e) {
                console.log(e)
                setError(e.message)
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }

        if (title) {
            searchDetails()
        }
    }, [title])

    const handleToggleFavorite = () => {
        if (movie) {
            toggleFavorite(movie);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <h2>🎬 Carregando...</h2>
                    <p>Buscando detalhes do filme</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container">
                <div className="error">
                    <h2>❌ Erro</h2>
                    <p>{error}</p>
                    <Link to="/" className="btn">Voltar para busca</Link>
                </div>
            </div>
        )
    }

    if (!movie) {
        return (
            <div className="container">
                <div className="error">
                    <h2>❌ Filme não encontrado</h2>
                    <p>Não foi possível encontrar os detalhes deste filme</p>
                    <Link to="/" className="btn">Voltar para busca</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <div className="details-container">
                {/* Header */}
                <div className="details-header">
                    <h1 className="details-title">{movie.Title}</h1>
                    <div className="details-header-actions">
                        <button
                            className={`favorite-btn details-favorite-btn ${isFavorite(movie.imdbID) ? 'favorited' : ''}`}
                            onClick={handleToggleFavorite}
                            title={isFavorite(movie.imdbID) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                            {isFavorite(movie.imdbID) ? '❤️ Favorito' : '🤍 Adicionar aos Favoritos'}
                        </button>
                        <Link to="/" className="btn">
                            ← Voltar para busca
                        </Link>
                    </div>
                </div>

                {/* Conteúdo principal */}
                <div className="details-content">
                    {/* Poster */}
                    <div className="details-poster-container">
                        {!imageLoaded && (
                            <div className="details-poster-placeholder">
                                <div className="loading-spinner-small"></div>
                                <span>Carregando poster...</span>
                            </div>
                        )}

                        {movie.Poster !== "N/A" && !imageError ? (
                            <img
                                src={movie.Poster}
                                alt={movie.Title}
                                className="details-poster"
                                onLoad={() => {
                                    setImageLoaded(true);
                                    setImageError(false);
                                }}
                                onError={() => {
                                    setImageLoaded(true);
                                    setImageError(true);
                                }}
                                style={{
                                    opacity: imageLoaded ? 1 : 0,
                                    transition: 'opacity 0.3s ease'
                                }}
                            />
                        ) : (
                            <div className="details-poster-placeholder no-image-placeholder">
                                <div className="image-icon">
                                    🎬
                                </div>
                                <span>Sem Imagem</span>
                            </div>
                        )}
                    </div>

                    {/* Informações */}
                    <div className="details-info">
                        {/* Informações básicas */}
                        <div className="details-section">
                            <h3>📖 Sinopse</h3>
                            <p>{movie.Plot || "Sinopse não disponível"}</p>
                        </div>

                        {/* Informações técnicas */}
                        <div className="details-section">
                            <h3>🎯 Informações Técnicas</h3>
                            <p><strong>Ano:</strong> {movie.Year}</p>
                            <p><strong>Gênero:</strong> {movie.Genre || "Não informado"}</p>
                            <p><strong>Duração:</strong> {movie.Runtime || "Não informado"}</p>
                            <p><strong>Classificação:</strong> {movie.Rated || "Não informado"}</p>
                        </div>

                        {/* Avaliações */}
                        <div className="details-section">
                            <h3>⭐ Avaliações</h3>
                            <p><strong>IMDB Rating:</strong> {movie.imdbRating || "Não avaliado"}</p>
                            <p><strong>IMDB Votes:</strong> {movie.imdbVotes || "Não informado"}</p>
                            {movie.Metascore && <p><strong>Metascore:</strong> {movie.Metascore}</p>}
                        </div>

                        {/* Equipe */}
                        <div className="details-section">
                            <h3>🎭 Equipe</h3>
                            <p><strong>Diretor:</strong> {movie.Director || "Não informado"}</p>
                            <p><strong>Roteiro:</strong> {movie.Writer || "Não informado"}</p>
                            <p><strong>Elenco:</strong> {movie.Actors || "Não informado"}</p>
                        </div>

                        {/* Informações adicionais */}
                        {movie.Awards && movie.Awards !== "N/A" && (
                            <div className="details-section">
                                <h3>🏆 Prêmios</h3>
                                <p>{movie.Awards}</p>
                            </div>
                        )}

                        {movie.Production && movie.Production !== "N/A" && (
                            <div className="details-section">
                                <h3>🎬 Produção</h3>
                                <p>{movie.Production}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}