"use strict"

import {updateDoc, arrayUnion, getDoc, onSnapshot} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js"
import {printUserGames, printUser, printWishlistGames, printForm, clearAll } from "./printData.js"
import { getGameById } from "./apiRequests.js"

//Function that return div element with the personal data of a user
export const getUserInfo = async (userRef) => {
    let userDoc = await getDoc(userRef)
    let userInfo = document.createElement("div")
    userInfo.setAttribute("class","user-info")
    userInfo.innerHTML = printUser(userDoc.data())
    return userInfo
}

//Function that prints the games of the user updated in realtime and add an Event in the del buttons
export const getUserGames = async  (userRef) => {
    const getUserGames = onSnapshot(userRef, userDoc => {
        //Clear the content
        document.getElementById("games-container").innerHTML = "<h3 class='listTitle'>Juegos</h3>"
        document.getElementById("wishlist-container").innerHTML = "<h3 class='wishTitle'>Wishlist</h3>"

        //Create the element and print the content 
        let games = document.createElement("div")
        games.setAttribute("id","games")
        games.innerHTML += printUserGames(userDoc.data().games)
        document.getElementById("games-container").appendChild(games)

        let gamesWish = document.createElement("div")
        gamesWish.setAttribute("id","wishlist")
        gamesWish.innerHTML += printWishlistGames(userDoc.data().wishlist)
        document.getElementById("wishlist-container").appendChild(gamesWish)

        //Add del event after the insertion in the DOM
        delEventButton(userRef,"games")
        updateEventButton(userRef)
        delEventButton(userRef,"wishlist")
        moveEventButton(userRef)
    })
}

//Function that prints the games in the wishlist of the user updated in realtime and add Events to their buttons
export const getUserWishlist =  async (userRef) => {
    const getUserWishlist = onSnapshot(userRef, userDoc => {
        //Clear the content
        document.getElementById("wishlist-container").innerHTML = "<h3>Wishlist</h3>"
        
        //Create the element and print the content
        let gamesWish = document.createElement("div")
        gamesWish.setAttribute("id","wishlist")
        gamesWish.innerHTML += printWishlistGames(userDoc.data().wishlist)
        document.getElementById("wishlist-container").appendChild(gamesWish)
                
        //Add del event after the insertion in the DOM
        delEventButton(userRef,"wishlist")
        moveEventButton(userRef)
    })
}


//Function that adds a game to the list of games of the user(Limit to user logged)
export const addGame = async (userRef, game, list) => {
    if(Object.entries(game).length !== 0 ){
        if(list == "games"){
            updateDoc(userRef,{
                games: arrayUnion(game)
            })
        } else if (list == "wishlist"){
            updateDoc(userRef,{
                wishlist: arrayUnion(game)
            })
        }
    }
}

//Function that delete a game of the list of the user
const delGame = async (userRef, gameId, list) => {
    let userDoc = await getDoc(userRef)
    if(list == "games"){
        let newGames = userDoc.data().games.filter((f) =>{
            return f.id != gameId
        })
        updateDoc(userRef, {
            games: newGames
        })
    } else if (list =="wishlist"){
        let newWishGames = userDoc.data().wishlist.filter((f) =>{
            return f.id != gameId
        })
        updateDoc(userRef, {
            wishlist: newWishGames
        })
    }
}

//Function that adds the functionallity to delete buttons
const delEventButton = (userRef, list) => {
    document.getElementsByName("del").forEach(button => {
        button.addEventListener("click", e => {
            delGame(userRef, e.target.parentNode.id, list)
        }, false)
    })
}

//Function that adds the functionallity to move buttons
const moveEventButton = async  (userRef)=> {
    let userDoc = await getDoc(userRef)
    document.getElementsByName("moveList").forEach( button => {
        button.addEventListener("click", e => {
            userDoc.data().wishlist.map( game => {
                if(game.id == e.target.parentNode.id){
                    delGame(userRef, e.target.parentNode.id, "wishlist")
                    addGame(userRef, game, "games")
                }
            })
        })
    })
}

//Function that adds the functionallity to update the data of a game
const updateEventButton = async  (userRef) => {
    let userDoc = await getDoc(userRef)
    let updateContainer = document.createElement("div")
    updateContainer.setAttribute("class","form-container")
    //EventListener for each button in the list of games
    document.getElementsByName("update").forEach(button => {
        button.addEventListener("click", e => {
            userDoc.data().games.map(game => {

                //When the id matches, print the form with the data of the game
                if(game.id == e.target.parentNode.id){
                    updateContainer.innerHTML = printForm(game)
                    clearAll()
                    document.getElementById("form-update").appendChild(updateContainer)
                    document.getElementById("submit").addEventListener("click", ()=>{
                        updateGame(userRef, userDoc, game)
                        clearAll()
                        getUserGames(userRef)
                    })
                }
            })
        })
    })

}

//For each button in the games showed add an event that save the game in GAMES
export const addEventButton = (nameValue, userRef) => {
    document.getElementsByName("add").forEach(button => {
        button.addEventListener("click", async (e) => {
            nameValue == "" ? nameValue = e.target.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML.toString() : nameValue
            const gameToAdd = await getGameById(nameValue, e.target.parentNode.id);
            addGame(userRef, gameToAdd, "games");
            clearAll();
            getUserGames(userRef);
        }, false);
    });
}

//For each button in the games showed add an event that save the game in WISHLIST
export const wishEventButton = (nameValue, userRef) => {
    document.getElementsByName("addWish").forEach( button => {
        button.addEventListener("click", async e => {
            nameValue == "" ? nameValue = e.target.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.innerHTML.toString() : nameValue
            const gameToAdd = await getGameById(nameValue ,e.target.parentNode.id)
            addGame(userRef,gameToAdd,"wishlist")
            clearAll()
            getUserGames(userRef)
        }, false)
    })
}

//Function that updates the data of a game with a form
const updateGame = (userRef, userDoc, game) => {
    //Get the values of the form
    let updatedName = document.getElementById("form-name").value.toString()
    let updatedGenres = document.getElementById("form-genres").value.split(",")
    let updatedImage = document.getElementById("form-image").value.toString()
    
    //Create a new Object to insert
    let updatedGame = {
        "id": game.id,
        "name": updatedName,
        "genres": updatedGenres,
        "image": updatedImage,
        "metacritic": game.metacritic,
        "released": game.released
    }
    
    //Update the game with the id of the modified one
    const updatedGames = userDoc.data().games.map( oldGame => {
        return oldGame.id == updatedGame.id ? updatedGame : oldGame
    })

    //Update the list of games whith the new one
    updateDoc(userRef, {
        games: updatedGames
    })
}

//Function that returns a new Object user
export const createUser = user => {
    return {
        "id": user.localId,
        "name": user.displayName,
        "creationDate": user.createdAt,
        "lastSessionDate": user.lastLoginAt,
        "image": user.photoUrl,
        "games": [],
        "wishlist": []
    }
}

