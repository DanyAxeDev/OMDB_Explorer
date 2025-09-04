import { Link } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import Movie from "../components/Movie";

export default function Favs() {
    const { favorites, clearFavorites, favoritesCount } = useFavorites();

    return (
        <div className="container">
            <div className="favs-container">
                {/* Header */}
                <header className="header">
                    <h1>❤️ Meus Favoritos</h1>
                    <p>Seus filmes favoritos salvos para assistir depois</p>

                    {/* Navegação */}
                    <nav className="nav-buttons">
                        <Link to="/" className="btn">
                            🔍 Busca
                        </Link>
                        <Link to="/favs" className="btn active">
                            ❤️ Favoritos ({favoritesCount})
                        </Link>
                    </nav>
                </header>

                {/* Controles */}
                {favoritesCount > 0 && (
                    <div className="favs-controls">
                        <div className="favs-stats">
                            <span>📊 Total: {favoritesCount} filme{favoritesCount !== 1 ? 's' : ''}</span>
                        </div>
                        <button
                            className="btn btn-danger"
                            onClick={clearFavorites}
                            title="Remover todos os favoritos"
                        >
                            🗑️ Limpar Todos
                        </button>
                    </div>
                )}

                {/* Lista de favoritos */}
                {favoritesCount > 0 ? (
                    <div className="movieList">
                        {favorites.map((movie, index) => (
                            <div key={movie.imdbID || index}>
                                <Movie movie={movie} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-favorites">
                        <div className="empty-state">
                            <div className="empty-icon">🤍</div>
                            <h3>Nenhum filme favorito ainda</h3>
                            <p>
                                Comece adicionando filmes aos seus favoritos!
                                Clique no coração nos cards de filmes ou na página de detalhes.
                            </p>
                            <Link to="/" className="btn">
                                🔍 Buscar Filmes
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
