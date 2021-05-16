/**
 * Created by saharmehrpour on 9/6/17.
 */

import React, {Component, Fragment} from "react";
import "../App.css";

import RulePanel from "./rulePanel";
import {connect} from "react-redux";
import {Button} from "react-bootstrap";
import MdPlaylistAdd from "react-icons/lib/md/playlist-add";
import {changeEditMode} from "../actions";

class RuleTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newRule: false,
            indicesOfRulesToDisplay: [],
            hash0: ""
        };
    }

    render() {
        return (
            <Fragment>
                {this.state.hash0 === "rules" ?
                    (!this.state.newRule ? (
                        <div style={{paddingBottom: "10px", clear: "both"}}>
                            <Button onClick={() => this.props.onChangeEditMode()} style={{padding: "0 5px"}}>
                                <MdPlaylistAdd size={35}/>
                                Add a New Rule
                            </Button>
                        </div>
                    ) : (
                        <div style={{paddingBottom: "5px"}}>
                            <RulePanel ruleIndex={-1}/>
                        </div>
                    ))
                    : null}
                <div>
                    {this.state.indicesOfRulesToDisplay.map((d, i) =>
                        (<div key={i} style={{paddingBottom: "5px"}}>
                            <RulePanel ruleIndex={d}/>
                        </div>)
                    )}
                </div>
                {this.state.hash0 !== "rules" && this.state.indicesOfRulesToDisplay.length === 0 ? (
                    <div>
                        <h4>There are no rules to display.</h4>
                    </div>
                ) : null}
            </Fragment>
        );
    }

    //componentDidUpdate doesn't work
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState(nextProps);
    }

}

// map state to props
function mapStateToProps(state) {

    let props = {
        newRule: state.rulePadState.isEditMode,
        indicesOfRulesToDisplay: state.ruleTable.map(d => d.index),
        hash0: state.currentHash[0]
    };


    if (state.currentHash[0] === "tag")
        props.indicesOfRulesToDisplay = state.ruleTable
            .filter((d) => d["tags"].indexOf(state.currentHash[1]) !== -1)
            .map(d => d.index);

    else if (state.currentHash[0] === "violatedRules")
        props.indicesOfRulesToDisplay = state.ruleTable
            .filter(d => d["xPathQueryResult"].map(dd => dd["data"].violated).reduce((a, b) => { return a + b }, 0) !== 0)
            .map(d => d.index);

    return props;
}

function mapDispatchToProps(dispatch) {
    return {
        onChangeEditMode: () => dispatch(changeEditMode(-1, true))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RuleTable);
