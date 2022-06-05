"use strict"

//Function that print name, picture and lastSessionDate of an user (Fix date (parse) )
export const printUser = (user) => {    
    let mili = parseInt(user.lastSessionDate)
    let lastSession = new Date(mili)
    return `<img src=${user.image} alt=Profile class="profilePic">
            <p class="userName">${user.name}</p>
            <p class="userLastSession">${lastSession.toDateString()}</p>`
}

//Function to print the games of the user
export const printUserGames = (games) => {
    let userGames = "";
    games.map( game => {
        userGames += `<div id=${game.id} class=game-card>
                        <img src=${game.image} alt="Image" height="175px" width="300px">
                        <p class=game-name>${game.name}</p> <p class=meta>${game.metacritic}</p>
                        <input type='button' name='del' value='Eliminar'>
                        <input type='button' name='update' value='Actualizar'>
                        <div class=show-more>
                            <p>Fecha de Salida: ${game.released}</p>
                            <p>Generos: ${game.genres.toString()}</p>
                        </div>
                    </div>`
    })
    return userGames;
}

//Function to print the games in the wishlist of the user
export const printWishlistGames = (games) => {
    let wishGames = ""
    games.map( game => {
        wishGames += `<div id=${game.id} class=game-card>
                        <img src=${game.image} alt="Image" height="175px" width="300px">
                        <p class=game-name>${game.name}</p> <p class=meta>${game.metacritic}</p>
                        <input type='button' name='del' value='Eliminar'>
                        <input type='button' name='moveList' value='Mover'>
                        <div class=show-more>
                            <p>Fecha de Salida ${game.released}</p>
                            <p>Generos ${game.genres.toString()}
                        </div>
                    </div>`
    })
    return wishGames
}
//Function that print the games searched in the API
export const printApiGames = (games) => {
    let apiGames = ""
    games.map( game => {
        apiGames += `<div id=${game.id} class=game-card>
                        <img src=${game.image} alt="Image" height="175px" width="300px">
                        <p class=game-name>${game.name}</p> <p class=meta>${game.metacritic}</p>
                        <input type='button' name='add' value='Añadir'>
                        <input type='button' name='addWish' value='Whislist'>
                        <div class=show-more>
                            <p>Release Dare ${game.released}</p>
                            <p>Genres ${game.genres.toString()}
                        </div>
                    </div>`
    })
    return apiGames
}

//Function that prints a form to update a game
export const printForm = (gameToUpdate) => {
    let form = ""
    form = `<form id="form">
                <label for="name">Nombre:</label>
                <input type="text" name="name" id="form-name" value="${gameToUpdate.name}" required>
                <label for="genres">Generos:</label>
                <textarea name="genres" id="form-genres" rows="4" cols="30" required>${gameToUpdate.genres.toString()}</textarea>
                <label for="image">Imagen:</label>
                <input type="text" name="image" id="form-image" value="${gameToUpdate.image}">
                <input type="button" id="submit" value="Aplicar Cambios">
            </form>`
    return form
}

//Function to clear all the containers in the web
export const clearAll = () => {
    document.getElementById("games-container").innerHTML = ""
    document.getElementById("wishlist-container").innerHTML = ""
    document.getElementById("form-update").innerHTML = ""
    document.getElementById("api-games").innerHTML = ""
}