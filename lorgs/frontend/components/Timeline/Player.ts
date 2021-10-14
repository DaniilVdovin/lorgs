
import Konva from "konva"
import * as constants from "./constants"
import Cast from "./Cast"
import type Actor from "../../types/actor"
import type PlayerRow from "./PlayerRow"


export default class Player extends Konva.Group {

    row : PlayerRow
    casts: Cast[]
    player_data: Actor

    constructor(row: PlayerRow, player_data: Actor) {
        super()
        this.row = row
        this.transformsEnabled("position")

        this.clip({
            x: 0,
            y: 1,
            width: this.row.duration * constants.DEFAULT_ZOOM,
            height: constants.LINE_HEIGHT,
        })

        this.player_data = player_data

        // load casts
        this.casts = (player_data.casts || []).map(cast_data => new Cast(cast_data))
        this.casts = this.casts.filter(cast => cast.spell)

        this.layout_children()
    }

    layout_children() {

        this.casts.forEach(cast => {

             if (cast.spell && cast.visible()) {

                // add cast if its not added yet
                if (cast.getParent() == undefined) {
                    this.add(cast)
                }

                // move one after the other to the top/
                // assuming they are sorted by time.. this should fix overlaps
                cast.moveToTop()

            } else { // dont show

                // remove cast if its currently added
                if (cast.getParent() != undefined) {
                    cast.remove()
                }
            }
        })
    }

    schedule_cache() {

        this.clearCache() // clear to make sure we update (even if eg: all children are hidden)
        if (this.hasChildren()) {
            this.cache() // TODO: add throttle?
        }
        return
    }

    //////////////////////////////
    // Events
    //

    _handle_spell_display() {
        this.layout_children()
    }

    _handle_zoom_change(scale_x: number) {
        this.clipWidth(this.row.duration * scale_x)
    }

    handle_event(event_name: string, payload: any) {
        if (event_name === constants.EVENT_ZOOM_CHANGE) { this._handle_zoom_change(payload)}
        this.casts.forEach(cast => cast.handle_event(event_name, payload))

        // after cast update, so we can handle the cast visibility in there
        if (event_name === constants.EVENT_SPELL_DISPLAY) {this._handle_spell_display()}

        this.schedule_cache()
    }
}
