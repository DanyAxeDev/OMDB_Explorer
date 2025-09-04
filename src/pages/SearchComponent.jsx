import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Movie from "../components/Movie";
import { useFavorites } from "../context/FavoritesContext";

const SearchComponent = () => {
    const [movieName, setMovieName] = useState("")
    const [movies, setMovies] = useState([])
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { favoritesCount } = useFavorites();
    const apiKey = import.meta.env.VITE_OMDB_API_KEY;

    const handleMovieNamechange = (event) => setMovieName(event.target.value)

    const apiCall = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${movieName}&page=${page}`)

            if (!response.ok) {
                throw new Error("Falha na requisição")
            }

            const data = await response.json()

            // Verificar se a API retornou erro (filme não encontrado)
            if (data.Response === "False") {
                setMovies([])
                setError(data.Error || "Filme não encontrado")
                return
            }

            // Se encontrou filmes, definir a lista
            setMovies(data.Search || [])
        } catch (e) {
            console.log(e)
            setError(e.message)
            setMovies([])
        } finally {
            setLoading(false)
        }
    }

    const nextPage = () => {
        setPage(page + 1)
    }

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    useEffect(() => {
        // Só faz a busca quando a página muda E há um termo de busca
        if (movieName.trim() !== "" && page >= 1) {
            apiCall()
        }
    }, [page])

    useEffect(() => {
        // Quando o nome do filme muda, reseta para página 1 mas não faz busca automática
        setPage(1)
        setMovies([]) // Limpa os filmes quando muda o termo de busca
    }, [movieName])

    if (error) {
        return (
            <div className="container">
                <div className="error">
                    <h2>❌ Erro</h2>
                    <p>{error}</p>
                    <button className="btn" onClick={() => setError(null)}>Tentar novamente</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <h2>🎬 Carregando...</h2>
                    <p>Buscando filmes para você</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            {/* Header */}
            <header className="header">
                <h1>🎬 OMDB Explorer</h1>
                <p>Descubra milhares de filmes e séries em nossa base de dados</p>

                {/* Navegação */}
                <nav className="nav-buttons">
                    <Link to="/" className="btn active">
                        🏠 Busca
                    </Link>
                    <Link to="/favs" className="btn">
                        ❤️ Favoritos ({favoritesCount})
                    </Link>
                </nav>
            </header>

            {/* Container de busca */}
            <div className="inputContainer">
                <div className="search-row">
                    <input
                        type="text"
                        placeholder="Digite o nome do filme que deseja buscar..."
                        value={movieName}
                        onChange={handleMovieNamechange}
                        className="search"
                        onKeyPress={(e) => e.key === 'Enter' && apiCall()}
                    />
                    <button className="buttonSearch" onClick={apiCall}>
                        🔍 Buscar
                    </button>
                </div>
            </div>

            {/* Lista de filmes */}
            {movies && movies.length > 0 && (
                <>
                    <div className="movieList">
                        {movies.map((movie, index) => (
                            <div key={movie.imdbID || index}>
                                <Movie movie={movie} />
                            </div>
                        ))}
                    </div>

                    {/* Navegação de páginas */}
                    <div className="pagination">
                        {page > 1 && (
                            <button className="btn pagination-btn prev-btn" onClick={prevPage}>
                                ← Página Anterior
                            </button>
                        )}
                        <span className="page-info">Página {page}</span>
                        <button className="btn pagination-btn next-btn" onClick={nextPage}>
                            Próxima Página →
                        </button>
                    </div>
                </>
            )}

            {/* Estado inicial ou filme não encontrado */}
            {!movies || movies.length === 0 ? (
                <div className="initial-state">
                    <>
                        <h3>🎭 Comece sua busca</h3>
                        <p>Digite o nome de um filme acima para começar a explorar nossa vasta coleção de filmes e séries</p>
                    </>
                </div>
            ) : null}
        </div>
    )
}

export default SearchComponent