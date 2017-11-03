class Client{

    constructor(pseudo, socket){
        this.pseudo = pseudo;
        this.socket=socket;

    }
    getPseudo(){
        return this.pseudo;
    }
    getSocket(){
        return this.socket;
    }
}

module.exports = Client;