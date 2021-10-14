import React from 'react'
import { useDispatch } from 'react-redux'
import { set_filters } from '../../../store/ui'
import ButtonGroup from '../shared/ButtonGroup'
import DurationInputGroup from "../../shared/DurationInputGroup"


/**
 * Group to set the min/max killtime-filter
 *
 * @returns {ReactComponent}
 */
export default function FilterKilltimeGroup() {

    const dispatch = useDispatch()

    // Callback when values get changed
    function onChange({min, max}: {min: number, max: number}) {
        dispatch(set_filters({killtime: {min, max}}))
    }

    // Render
    return (
        <ButtonGroup name="Killtime" side="right">
            <DurationInputGroup onChange={onChange} className="input-group-sm killtime_input" />
        </ButtonGroup>
    )
}
