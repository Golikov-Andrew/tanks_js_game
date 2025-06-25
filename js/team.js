class Team {
    constructor(app, title, color, players_list) {
        this.app = app
        this.title = title
        this.color = color
        this.players = (players_list !== undefined) ? players_list : []
        this.points = 0
    }
    add_player(player){
        this.players.push(player)
        player.attach_to_team(this)
    }
}