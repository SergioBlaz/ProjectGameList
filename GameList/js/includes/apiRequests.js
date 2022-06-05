//Recibe la id del juego y realiza una petición para devolver sus datos
const apiKey = `a8bfe2b5d66e46adb29d7ff7d07037aa`

//Function that returns 
export const getGamesByName = async (name) => {
    const apiResponse = await fetch(
        `https://api.rawg.io/api/games?key=${apiKey}&search=${name}&search_exact=true&page=1&page_size=15&metacritic=10,100`,
        )
    const apiJson = await apiResponse.json()

    //Save the data of the response in a object.
    const listResult = []
    apiJson.results.map((game) => {
        
        let genres = []
        game.genres.map( genre => {
            genres.push(genre.name) 
        })

        listResult.push({
            "id": game.id,
            "name": game.name,
            "genres": genres,
            "image": game.background_image,
            "metacritic": game.metacritic,
            "released": game.released
        })

    })
    return listResult
}

export const getGameById = async (name, id) => {
    const apiResponse = await fetch(
    `https://api.rawg.io/api/games?key=${apiKey}&search=${name}&metacritic=10,100&page=1&page_size=10`,
    )
    const apiJson = await apiResponse.json()
    //Map the results by name and and check if the id matches, then return only one game
    let gameAdd = {}
    let genres = []
    apiJson.results.map(games => {
        
        if(games.id.toString() == id){
            
            games.genres.map( genre => {
                genres.push(genre.name) 
            })

            gameAdd = {
                "id": games.id,
                "name": games.name,
                "genres": genres,
                "image": games.background_image,
                "metacritic": games.metacritic,
                "released": games.released
            }
        }
    })
    
    return gameAdd
}