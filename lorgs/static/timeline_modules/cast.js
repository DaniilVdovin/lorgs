


class Cast extends Konva.Group {

    constructor(cast_data, config) {
        super(config)

        // Kova Attrs
        this.listening(true)
        this.transformsEnabled("position")

        this.name("Cast")

        // Internal Attrs
        // this.player = player
        this.added = false
        this.hovering = false

        // Spell Info
        this.spell_id = cast_data.spell_id;
        this.timestamp = cast_data.timestamp / 1000;
        // this.listening(true);
    }

    create() {
        // Cast Info
        const stage = this.getStage();

        this.spell = this.stage.spells[this.spell_id];
        if (this.spell === undefined) {
            // console.log(`spell ${this.spell_id} not found.`)
            this.remove()
            // this.visible(false)
            return
        }
        this.visible(this.spell.show)

        //     this.cast_cooldown.cache()

        // this.add(this.spell.cast_cooldown);
        // this.cast_duration = this.spell.cast_duration.clone()
        // this.cast_duration.cache()
        // this.add(this.cast_duration);

        // this.cast_icon = this.spell.cast_icon.clone()

        // this.cast_icon.filters([Konva.Filters.Grayscale]);
        // this.add(this.cast_icon);

        // this.cache()
        // this.filters([Konva.Filters.Blur])

        // this.spell_group = this.spell.group.clone()
        // this.add(this.spell_group);

        // this.cache()
        // this.group.cache();

        // this.on('mouseover', (event) => {
        //     console.log("hello!")
        // });
        this.on('mousedown', this.select);
        this.on('mouseover', () => {this.hover(true)});
        this.on('mouseout', () => {this.hover(false)});

        if (!this.spell) { return; }

        // Cast Cooldown
        this.cast_cooldown = this.spell.cast_cooldown.clone()
        if (this.spell.cooldown > 0) {
            this.add(this.cast_cooldown)
        }

        // Cast Duration
        this.cast_duration = this.spell.cast_duration.clone()
        if (this.spell.duration > 0) {
            this.add(this.cast_duration)
        }

        // Cast Icon
        this.cast_icon = this.spell.cast_icon.clone()
        this.add(this.cast_icon)

        // Timestamp
        this.cast_text = new Konva.Text({
            name: "cast_timestamp",
            text: toMMSS(this.timestamp),
            x: 27,
            y: 0,
            fontSize: 14,

            height: LINE_HEIGHT,
            verticalAlign: 'middle',

            fontFamily: "Lato",
            fill: "white",
            listening: false,
            transformsEnabled: "position",
            }
        )
        this.cast_text.perfectDrawEnabled(false);

        // this.cast_text.visible(this.visible())

        this.add(this.cast_text);
        this.y(1);
        // this.cache()

    }

    update() {

        // console.log("update scene")

        if (!this.spell) { return; }

        const update_vis = this.visible() != this.spell.show;
        this.visible(this.spell.show)

        if (!this.visible()) { return;}

        /*
        if (!this.visible) {
            this.remove()
            this.added = false
            return;
        }

        if (!this.added) {
            this.player.casts_group.add(this)
            this.added = true
        }
        */
        const stage = this.stage

        // console.log("cast update zoom", stage.zoom_changed)
        if (update_vis || stage.zoom_changed) {
            this.x(stage.scale_x * this.timestamp)
            this.cast_duration.width(this.spell.duration * stage.scale_x)
            this.cast_cooldown.width(this.spell.cooldown * stage.scale_x)
        }

        // const show = this.spell.show;
        // this.cast_duration.width(this.spell.duration * scale_x)
        this.cast_text.visible(stage.display_casttime)
        this.cast_cooldown.visible(stage.display_cooldown)
        this.cast_duration.visible(stage.display_duration)


        // default state
        this.cast_text.fontStyle("normal");
        // this.cast_text.fill("white");
        this.cast_duration.opacity(0.5)
        this.cast_cooldown.opacity(0.1)
        this.cast_icon.opacity(1.0)
        // this.cast_icon.saturation(0)
        this.cast_icon.strokeWidth(1)
        this.opacity(1.0)
        // this.blurRadius(0)


        if (stage.has_selection) {
            if (this.spell.selected) {
                // this.moveToTop()
                // this.cast_text.fill("lime")
                this.cast_text.fontStyle("bold");
                this.cast_duration.opacity(0.85)
                this.cast_cooldown.opacity(0.4)
            } else {
                this.opacity(.5)
                this.cast_text.fill("#ccc")
                this.cast_icon.opacity(0.5)

                // this.cast_icon.saturation(-10)
                this.cast_icon.strokeWidth(0)
                // this.blurRadius(2)
            }
        }
        else if (this.hovering) {
            this.cast_duration.opacity(0.75)
            this.cast_cooldown.opacity(0.3)
        }

        // this.cast_duration.fill(this.hovering ? "red": "green")
        // console.log("update", this.hovering, this.cast_duration.isCached())
        // return
        /*
        this.mode = (stage.has_selection && this.spell.selected) ? MODE_SELECTED : this.mode
        switch(this.mode) {

            case MODE_SELECTED:
            break

            case MODE_HOVER:
            break

            case MODE_DEFAULT:
            default:
                this.cast_text.fill("white")
                this.cast_text.fontStyle("normal");
                this.cast_duration.opacity(0.5)
        }

        if (stage.has_selection) {

            // style: selected spell
            if (this.spell.selected) {
                this.cast_text.fill("lime")
                this.cast_duration.opacity(CAST_DURATION_OPACITY_SELECTED)

            // style: un-selected spell
            } else {
                this.cast_text.fontStyle("italic");
                this.cast_duration.opacity(CAST_DURATION_OPACITY_DEFAULT)
            }
            return
        }
        */


        // this.spell_group.find(".duration").forEach(duration => {
        // })
        // this.spell_group.find(".cooldown").forEach(cooldown => {
        // })
        // this.spell_group.cache();
        // this.cache();
    }

    hover(state) {

        this.hovering = state;
        this.update()

        const casts_group = this.getParent();
        casts_group.cache()  // refresh cache for this group
        // console.log()

        const stage = this.getStage()
        stage.container().style.cursor = this.hovering ? "pointer" : "grab";

    }

    select() {

        const stage = this.getStage()

        stage.has_selection = false
        stage.spells.forEach(spell => {
            spell.selected = (spell == this.spell) && !this.spell.selected

            // if (spell == this.spell) {
            //     spell.selected = !spell.selected;
            //     console.log("new state", this.spell.selected)
            // } else {
            //     spell.selected = false;
            // }
            stage.has_selection = stage.has_selection || spell.selected;
        })

        // this.spell.selected = !this.spell.selected

        this.spell.selected = this.spell.selected || stage.has_selection
        // this.mode = this.spell.selected ? MODE_SELECTED : MODE_DEFAULT

        stage.update()
    }

}
