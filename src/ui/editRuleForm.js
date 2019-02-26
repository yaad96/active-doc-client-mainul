/**
 * Created by saharmehrpour on 2/23/18.
 */

import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import '../App.css';
import {
    Alert, DropdownButton, HelpBlock, MenuItem,
    Button, FormGroup, ButtonToolbar, Label, FormControl,
    Row, Col, Modal, Dropdown
} from 'react-bootstrap';
import {RootCloseWrapper} from "react-overlays";
import {MdEdit, MdAddBox} from 'react-icons/lib/md/index';
import {TiDelete, TiArrowMaximise} from "react-icons/lib/ti/index";
import {FaQuestionCircle, FaTag, FaMinusCircle, FaTimesCircle} from "react-icons/lib/fa/index";
import marked from "marked";
import Joyride, {ACTIONS, EVENTS} from 'react-joyride';

import RuleGeneratorGui from './ruleGenerationGUI/ruleGeneratorGui';
import verifyTextBasedOnGrammar from "./ruleGenerationText/languageProcessing";
import {
    matchMessages, receiveGuiTree, clearNewRuleForm,
    editRuleForm, submitNewRule, submitNewTag, updateRule
} from "../actions";
import {generateGuiTrees} from "./ruleGenerationText/generateGuiTree";
import RuleGeneratorText from "./ruleGenerationText/ruleGeneratorText";
import Utilities from '../core/utilities';
import {error_messages_IMarkdownString} from "./ruleGenerationText/textConstant";

import title_description_filled from '../resources/title_description_filled.png';
import auto_complete_filled from '../resources/auto_complete_filled.png';
import auto_complete_info_icon from '../resources/auto_complete_info_icon.png';
import auto_complete_info from '../resources/auto_complete_info.png';
import editor_error from '../resources/editor_error.png';
import editor_error_close_icon from '../resources/editor_error_close_icon.png';
import editor_error_minimize_icon from '../resources/editor_error_minimize_icon.png';
import editor_error_maximize_icon from '../resources/editor_error_maximize_icon.png';
import editor_hover from '../resources/editor_hover.png';
import gui_element_example from '../resources/gui_element_example.png';
import constraint_element from '../resources/constraint_element.png';
import element_of_interest from '../resources/element_of_interest.png';
import tags from '../resources/tags.png';
import new_tag from '../resources/new_tag.png';


class EditRuleForm extends Component {

    constructor(props) {
        super(props);

        this.ruleIndex = props["ruleIndex"] !== undefined ? props["ruleIndex"] : -1;
        this.ruleI = null;
        this.newRuleRequest = this.ruleIndex === -1;

        if (!props["changeEditMode"])
            console.error(`'changeEditMode' is required in props when creating/editing a rule.`);


        /*
        This constant contains JSX and thus a react.Node
         */
        this.tourGuideSteps = [
            {
                target: `#title_description_div_${this.ruleIndex}`,
                title: 'Rule Title and Description',
                content: <span style={{textAlign: "left"}}>
                    <p>Each design rule should have a title by which it is displayed in the tool.
                        Design rule titles are often single-line statements about the rule.</p>
                    <p>More information about the rule and the rationale behind the decision,
                        can be expressed through design rule description.</p>
                    <p>Both <strong>title</strong> and <strong>description</strong> are mandatory
                        fields in generating new rule.</p>
                    <img className={"tutorialImage"} src={title_description_filled} alt={"Title Description Example"}/>
                </span>,
                disableBeacon: true
            }, //0

            {
                target: `#gui_div_${this.ruleIndex}`,
                title: 'GUI - Graphical User Interface for Writing Code',
                content: <span style={{textAlign: "left"}}>
                    <p>You can write the code you want to match in the project here.</p>
                    <p>The GUI includes elements whose attributes can be modified. These elements corresponds to Java pieces of code.</p>
                </span>,
                disableBeacon: true
            },  //1
            {
                target: `#id__${this.ruleIndex}__0-0-0`,
                title: 'GUI Elements',
                content: <span style={{textAlign: "left"}}>
                    <p>For example, element can be an <strong>annotation</strong></p>
                </span>,
                disableBeacon: true
            }, //2
            {
                target: `#id__${this.ruleIndex}__0-1-0`,
                title: 'GUI Elements',
                content: <span style={{textAlign: "left"}}>
                    <p>Or, <strong>visibility</strong> property.</p>
                </span>,
                disableBeacon: true
            }, //3
            {
                target: `#id__${this.ruleIndex}__0-2-0`,
                title: 'GUI Elements',
                content: <span style={{textAlign: "left"}}>
                    <p>Or, <strong>specifier</strong> property.</p>
                </span>,
                disableBeacon: true
            }, //4
            {
                target: `#id__${this.ruleIndex}__0-7-0`,
                title: 'GUI Elements',
                content: <span style={{textAlign: "left"}}>
                    <p>Or other properties displayed in a box.</p>
                    <p>Moving the cursor to the invisible element, make the element visible.</p>
                    <img className={"tutorialImage"} src={gui_element_example} alt={"GUI Element Example"}/>
                </span>,
                disableBeacon: true
            }, //5
            {
                target: `#id__${this.ruleIndex}__0`,
                title: 'GUI - Constraint Elements',
                content: <span style={{textAlign: "left"}}>
                    <p>To create a design rule, at least one element must be selected as constraint by double-clicking on the element.</p>
                    <p>Constraint elements are specified by <span style={{color: "#3333cc"}}>blue</span> color.</p>
                    <img className={"tutorialSmallImage"} src={constraint_element} alt={"Constraint Element Example"}/>
                </span>,
                disableBeacon: true
            }, //6
            {
                target: `#gui__star__${this.props.ruleIndex}__0`,
                title: 'GUI - Element of Interest',
                content: <span style={{textAlign: "left"}}>
                    <p>The GUI will select an Element of Interest automatically. However, if you desire to select a different element,
                        you may click on the star icon on the right-hand side of the desired element.</p>
                    <p>If an element is selected, the star and the border of the containing box have <span
                        style={{color: "#e5a727"}}>golden</span> color.</p>
                    <img className={"tutorialImage"} src={element_of_interest} alt={"Element of Interest Example"}/>
                </span>,
                disableBeacon: true
            },  //7

            {
                target: `#text_ui_div_${this.ruleIndex}`,
                title: "Writing a Design Rule",
                content: <span style={{textAlign: "left"}}>
                    <p>You can write design rules here.</p>
                    <p>The text editor includes features such as Auto-Complete which helps to write design rules.
                    It can be activated using <kbd>CTRL</kbd>+<kbd>Space</kbd></p>
                    <img className={"tutorialImage"} src={auto_complete_filled} alt={"Auto Complete Example"}/>

                </span>,
                disableBeacon: true
            }, //8
            {
                target: `#text_ui_div_${this.ruleIndex}`,
                title: "Text Editor - Auto Complete",
                content: <span style={{textAlign: "left"}}>
                    <p>Some suggestions include additional information which provides information on the suggestion.
                    It can be activated using <kbd>CTRL</kbd>+<kbd>Space</kbd> or <img style={{height: "1.1em"}}
                                                                                       src={auto_complete_info_icon}
                                                                                       alt={"Auto Complete Information Icon"}/></p>
                    <img className={"tutorialImage"} src={auto_complete_info}
                         alt={"Auto Complete Information Example"}/>
                </span>,
                disableBeacon: true
            }, //9
            {
                target: `#text_ui_div_${this.ruleIndex}`,
                title: "Text Editor - Auto Complete (Additional Information)",
                content: <span style={{textAlign: "left"}}>
                    <p>While writing the design rule, errors will be displayed below the error.</p>
                    <img className={"tutorialImage"} src={editor_error} alt={"Editor Error Example"}/>
                    <br/>
                    <p>Icons <img style={{height: "1.1em"}} src={editor_error_close_icon}
                                  alt={"Editor Error Close Icon"}/> and <img style={{height: "1.1em"}}
                                                                             src={editor_error_minimize_icon}
                                                                             alt={"Editor Error Minimize Icon"}/> are used to
                    close and minimize the error messages. To expand the minimized message click on<img
                            style={{height: "1.1em"}} src={editor_error_maximize_icon}
                            alt={"Editor Error Maximize Icon"}/>.</p>
                </span>,
                disableBeacon: true
            }, //10
            {
                target: `#text_ui_div_${this.ruleIndex}`,
                title: "Text Editor - Link to GUI",
                content: <span style={{textAlign: "left"}}>
                    <p>Hovering over the text in the editor will display information about the text and highlight the GUI element if applicable.</p>
                    <img className={"tutorialImage"} src={editor_hover} alt={"Auto Complete Hover Example"}/>
                </span>,
                disableBeacon: true
            }, //11

            {
                target: `#tag_div_${this.ruleIndex}`,
                content: <span style={{textAlign: "left"}}>
                    <p>Tags are used to organize design rules. Related design rules may have similar tags.</p>
                    <p><strong>Tags</strong> can be assigned to each design rule.</p>
                    <img className={"tutorialSmallImage"} src={tags} alt={"Tags Example"}/>
                    <p>New tags can be generated here as well.</p>
                    <img className={"tutorialImage"} src={new_tag} alt={"New Tag Example"}/>
                </span>,
                title: 'Rule Tags',
                disableBeacon: true
            }, //12
            {
                target: `#file_constraint_div_${this.ruleIndex}`,
                content: <span style={{textAlign: "left"}}>
                <h4>Select how the rules are verified.</h4>
                <p><b><em>"Rule must be applied on ALL Files/Folders"</em></b></p>
                <p>If the rule must be verified on <b>All</b> files and folders.</p>
                <p><b><em>"Rule must be applied on SPECIFIC Files/Folders"</em></b></p>
                <p>If the rule is checked on <b>SPECIFIC</b> files/folders.<br/>
                If the restriction is set to "Rule must be applied on Specific Files/Folders",
                at least one folder/file must be specified.</p>
                <p><b><em>Add files/folders</em></b></p>
                <p>Folder and file paths are determined respective to the project directory.
                For example in project "myProject", for file path ".../myProject/src/someFile.java",
                the relative path is "src/someFile.java"</p> </span>,
                title: 'Specifying File/Folder Constraints',
                disableBeacon: true
            }, //13
        ];
        // used as enum
        this.stepNames = {
            TITLE_DESCRIPTION: 0,
            GUI: 1,
            GUI_CONSTRAINT: 6,
            GUI_STAR: 7,
            TEXT_UI: 8,
            TAGS: 12,
            FILE_FOLDER: 13,
        };

        this.state = {
            // rule states
            title: props.title,
            description: props.description,
            ruleTags: props.ruleTags,
            folderConstraint: props.folderConstraint,
            filesFolders: props.filesFolders,
            tags: props.tags,

            // new tag states
            showNewTagModal: false,
            tagName: "",
            tagDetail: "",

            // error message
            showError: false,
            errorTitle: "",
            errorMessage: "",

            // GUI error message
            guiError: true,

            // styling for Monaco Editor
            monacoFormStatus: "has-error",
            errorPoint: -1,

            // tour guide states
            tourMainKey: 0,
            tourStepIndex: 0,
            tourShouldRun: false,
            isTourGuide: true,

            // editor states
            quantifierXPath: "",
            constraintXPath: "",
            editorError: "",
            showAlert: true,
            autoCompleteArray: []
        };

        // existing rule
        if (this.ruleIndex !== -1) {
            let indices = props.rules.map(d => d.index);
            let arrayIndex = indices.indexOf(this.ruleIndex);
            if (arrayIndex === -1)
                console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
            else {
                this.ruleI = props.rules[arrayIndex];
                this.state.title = this.ruleI.rulePanelState.title;
                this.state.description = this.ruleI.rulePanelState.description;
                this.state.ruleTags = this.ruleI.rulePanelState.ruleTags;
                this.state.folderConstraint = this.ruleI.rulePanelState.folderConstraint;
                this.state.filesFolders = this.ruleI.rulePanelState.filesFolders;
                this.state.tags = props.tags;
                // updating the rule
                this.state.quantifierXPath = this.ruleI.rulePanelState.quantifierXPath;
                this.state.constraintXPath = this.ruleI.rulePanelState.constraintXPath;
                this.state.autoCompleteArray = this.ruleI.rulePanelState.autoCompleteArray;

                this.state.monacoFormStatus = "has-success";
            }
        }
        // new rule
        else {
            this.state.title = props.title;
            this.state.description = props.description;
            this.state.ruleTags = props.ruleTags;
            this.state.folderConstraint = props.folderConstraint;
            this.state.filesFolders = props.filesFolders;
            this.state.tags = props.tags;

            this.state.quantifierXPath = props.quantifierXPath;
            this.state.constraintXPath = props.constraintXPath;
            this.state.autoCompleteArray = props.autoCompleteArray;
        }

    }

    render() {
        return (
            <div className={"rulePanelDiv" + (this.ruleIndex === -1 ? " edit-bg" : "")}>
                <div style={{float: 'right'}}>
                    <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                      onClick={() => this.setState({
                                          tourShouldRun: true,
                                          isTourGuide: true
                                      })}/>
                    <MdEdit size={20} className={"mdEdit"}
                            onClick={() => this.changeEditMode()}/>
                </div>
                {this.renderTitleAndDescription()}
                {this.renderTags()}
                <div style={{paddingTop: '10px', clear: 'both'}}>
                    {this.renderFileConstraints()}
                    {this.renderTutorial()}
                    {this.renderTextUI()}
                    {this.renderGUI()}
                    <ButtonToolbar className={"submitButtons"}>
                        <Button bsStyle="primary"
                                onClick={() => this.newRuleRequest ? this.onSubmitNewRule() : this.onSubmitUpdatedRule()}>
                            Submit</Button>
                        <Button bsStyle="default" onClick={() => this.changeEditMode()}>Cancel</Button>
                        {!this.newRuleRequest ? null :
                            <Button bsStyle="default"
                                    onClick={() => {
                                        this.props.onClearForm();
                                    }}>Clear Form</Button>}
                    </ButtonToolbar>
                </div>

                {this.renderNewTagModalDialog()}
                {this.renderErrorInSubmission()}
                {this.renderTourGuide()}
            </div>
        );
    }

    /**
     * render the textareas for title and description
     */
    renderTitleAndDescription() {
        return (
            <div id={`title_description_div_${this.ruleIndex}`}>
                <FormGroup validationState={(this.state.title === "") ? "error" : "success"}>
                    <FormControl componentClass="textarea" placeholder="Rule title. (Required)"
                                 style={{fontWeight: "bold", resize: "vertical"}}
                                 value={this.state.title}
                                 onChange={(e) => {
                                     this.setState({title: e.target.value});
                                 }}
                                 onKeyUp={(e) => {
                                     e.target.style.cssText = 'height:0';
                                     e.target.style.cssText = 'overflow:hidden;height:' + e.target.scrollHeight + 'px';
                                 }}
                                 onBlur={() => this.onEditNewRuleForm()}/>
                </FormGroup>
                <FormGroup validationState={(this.state.description === "") ? "error" : "success"}>
                    <FormControl componentClass="textarea"
                                 style={{resize: "vertical"}}
                                 placeholder="Description, high level details about the rule. (Required)"
                                 value={this.state.description}
                                 onChange={(e) => {
                                     this.setState({description: e.target.value})
                                 }}
                                 onKeyUp={(e) => {
                                     e.target.style.cssText = 'height:0';
                                     e.target.style.cssText = 'overflow:hidden;height:' + e.target.scrollHeight + 'px';
                                 }}
                                 onBlur={() => this.onEditNewRuleForm()}/>
                </FormGroup>
            </div>
        )
    }


    /**
     * render tag badges
     */
    renderTags() {
        return (
            <div style={{paddingTop: '10px', clear: 'both'}} id={`tag_div_${this.ruleIndex}`}>
                {this.state.ruleTags.map((d, i) => {
                    return (
                        <div className={"tagLabel"} key={i}>
                            <Label style={{paddingRight: "1px"}}>{d}
                                <TiDelete size={23}
                                          className={"tiDelete"}
                                          onClick={() => {
                                              const tags = this.state.ruleTags;
                                              tags.splice(i, 1);
                                              this.setState({tags}, this.onEditNewRuleForm);
                                          }}/>
                            </Label>
                        </div>)
                })}
                <CustomDropDown
                    menuItems={this.props.tags.map(d => d.tagName).filter(d => this.state.ruleTags.indexOf(d) === -1).concat(["New Tag"])}
                    onSelectFunction={(evt) => {
                        if (evt === "New Tag") {
                            this.setState({showNewTagModal: true})
                        }
                        else {
                            const tags = this.state.ruleTags;
                            tags.push(evt);
                            this.setState({tags}, this.onEditNewRuleForm)
                        }
                    }}/>
                <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                  onClick={() => this.setState({
                                      tourShouldRun: true,
                                      isTourGuide: false,
                                      tourStepIndex: this.stepNames.TAGS
                                  })}/>
            </div>
        );
    }


    /**
     * render the drop down for the file/folder constraint
     */
    renderFileConstraints() {
        return (
            <div id={`file_constraint_div_${this.ruleIndex}`}>
                <FormGroup
                    validationState={(this.state.folderConstraint === "" || (this.state.folderConstraint === "FOLDER" && this.state.filesFolders.length === 0)) ? "error" : "success"}>
                    <div>
                        <HelpBlock>
                            <ButtonToolbar>
                                <DropdownButton
                                    title={this.state.folderConstraint === "" ? "Select Restrictions on Files/Folders" : this.state.folderConstraint === "NONE" ? "Rule must be applied on ALL Files/Folders" : "Rule must be applied on Specific Files/Folders"}
                                    style={{color: (this.state.folderConstraint === "" || (this.state.folderConstraint === "FOLDER" && this.state.filesFolders.length === 0)) ? "#a94442" : "#3c763d"}}
                                    id={"drop_down"}>
                                    <MenuItem eventKey={"FOLDER"} onSelect={(evt) => {
                                        this.setState({folderConstraint: evt}, this.onEditNewRuleForm);
                                    }}>Rule must be applied on SPECIFIC Files/Folders
                                    </MenuItem>
                                    <MenuItem eventKey={"NONE"} onSelect={(evt) => {
                                        this.setState({folderConstraint: evt, filesFolders: []}, this.onEditNewRuleForm)
                                    }}>Rule must be applied on ALL Files/Folders
                                    </MenuItem>
                                </DropdownButton>
                                <Button disabled={this.state.folderConstraint !== "FOLDER"}
                                        onClick={() => {
                                            const filesFolders = this.state.filesFolders;
                                            filesFolders.push("");
                                            this.setState({filesFolders}, this.onEditNewRuleForm);
                                        }}
                                >Add files/folders
                                </Button>

                                <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                                  onClick={() => this.setState({
                                                      tourShouldRun: true,
                                                      isTourGuide: false,
                                                      tourStepIndex: this.stepNames.FILE_FOLDER,
                                                  })}/>
                            </ButtonToolbar>

                        </HelpBlock>
                    </div>
                </FormGroup>
                <div>
                    {this.state.filesFolders.map((d, i) => {
                        return (
                            <Row key={i} style={{paddingBottom: "5px"}}>
                                <Col sm={11} md={10}>
                                    <FormGroup
                                        validationState={this.state.filesFolders[i] === "" ? "error" : "success"}>
                                        <FormControl id={"filesFolders_textarea_" + i} type="text"
                                                     placeholder="relative File/Folder path"
                                                     value={this.state.filesFolders[i]}
                                                     onChange={(e) => {
                                                         const filesFolders = this.state.filesFolders;
                                                         filesFolders[i] = e.target.value;
                                                         this.setState({filesFolders});
                                                     }}
                                                     onBlur={() => this.onEditNewRuleForm()}/>
                                    </FormGroup>
                                </Col>
                                <Col sm={1} md={1} style={{paddingTop: "5px"}}>
                                    <TiDelete size={25}
                                              className={"tiDelete"}
                                              onClick={() => {
                                                  const filesFolders = this.state.filesFolders;
                                                  filesFolders.splice(i, 1);
                                                  this.setState({filesFolders}, this.onEditNewRuleForm);
                                              }}/>
                                </Col>
                            </Row>
                        )
                    })}
                </div>
            </div>
        )
    }


    /**
     * render the turorial steps above the text editor
     * @returns {XML}
     */
    renderTutorial() {
        return (
            <div>
                <div className={"tutorialText"}>
                    <strong>Step 1:</strong> Write the code you want to match in code using the GUI.
                    <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                      onClick={() => this.setState({
                                          tourShouldRun: true,
                                          isTourGuide: false,
                                          tourStepIndex: this.stepNames.GUI
                                      })}/>
                </div>
                <div className={"tutorialText"}>
                    <strong>Step 2:</strong> Specify what must be true by switching the conditions to
                    'constraints' by double-clicking on elements. Constraint elements are shown in <span
                    style={{color: "#3333cc"}}>blue</span>.
                    <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                      onClick={() => this.setState({
                                          tourShouldRun: true,
                                          isTourGuide: false,
                                          tourStepIndex: this.stepNames.GUI_CONSTRAINT
                                      })}/>
                </div>
                <div className={"tutorialText"}>
                    <strong>Step 3: [Optional]</strong> Edit the rule text by adding parentheses and changing
                    and' to 'or'.
                    <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                      onClick={() => this.setState({
                                          tourShouldRun: true,
                                          isTourGuide: false,
                                          tourStepIndex: this.stepNames.TEXT_UI
                                      })}/>
                </div>
            </div>
        )
    }

    /**
     * render Text UI
     */
    renderTextUI() {
        return (
            <div style={{paddingTop: '10px', clear: 'both'}} id={`text_ui_div_${this.ruleIndex}`}>
                <RuleGeneratorText autoCompleteArray={this.state.autoCompleteArray}
                                   ruleIndex={this.ruleIndex}
                                   errorPoint={this.state.errorPoint}
                                   formStatus={this.state.monacoFormStatus}
                                   onBlur={(newAutoCompleteText) => {
                                       verifyTextBasedOnGrammar(newAutoCompleteText)
                                           .then((data) => {
                                               if (this._mounted)
                                                   this.setState({
                                                       monacoFormStatus: "has-success",
                                                       errorPoint: -1,
                                                       autoCompleteArray: data.wordArray,
                                                       quantifierXPath: data.quantifierXPath,
                                                       constraintXPath: data.constraintXPath,
                                                       editorError: ""
                                                   });

                                               // compute and dispatch gui tree for quantifier and constraint
                                               generateGuiTrees(data.grammarTree)
                                                   .then((tree) => this.props.onReceiveGuiTree(this.ruleIndex, tree, data.wordArray, data.quantifierXPath, data.constraintXPath))
                                           })
                                           .catch((error) => {
                                               this.processLanguageProcessingError(error);
                                               this.setState({
                                                   autoCompleteArray: newAutoCompleteText.split(" ").map(d => {
                                                       return {id: "", text: d}
                                                   }),
                                                   monacoFormStatus: "has-error"
                                               })
                                           });
                                   }}
                                   onError={(errorIndex) => this.processLanguageProcessingError("ERROR_INDEX", errorIndex)}
                />
                {this.renderAutoCompleteError()}
            </div>
        )
    }

    /**
     * render GUI
     */
    renderGUI() {
        return (
            <div id={`gui_div_${this.ruleIndex}`}>
                {this.renderGuiError()}
                <div className={"generateRuleGuiDiv" + (this.state.guiError ? " has-error" : "")}>
                    <RuleGeneratorGui ruleIndex={this.ruleIndex} className={"generateRuleGui"}
                                      onError={(error) => error !== this.state.guiError ? this.setState({guiError: error}) : {}}/>
                </div>
            </div>
        )
    }

    /**
     * render AutoComplete Alert for displaying errors
     * @return {XML}
     */
    renderAutoCompleteError() {
        return (
            <Fragment>
                {this.state.editorError === "" ? null : !this.state.showAlert ? null : (
                    <Alert bsStyle={this.state.editorError.alertType}>
                        <div>
                            <div className={"controlButtonDiv"}>
                                <div className={"controlButton"}>
                                    <FaMinusCircle size={20} onClick={() => this.setState({showAlert: false})}/>
                                </div>
                                <div className={"controlButton"}>
                                    <FaTimesCircle size={20} onClick={() => this.setState({editorError: ""})}/>
                                </div>
                            </div>
                            <div>
                                {/*<h4>{this.state.editorError.errorType}</h4>*/}
                                <h6 dangerouslySetInnerHTML={{__html: marked(this.state.editorError.message)}}/>
                                <h6 style={{fontWeight: "bold"}}>{this.state.editorError.inputText}</h6>
                            </div>
                        </div>
                    </Alert>

                )}
                {this.state.showAlert || this.state.editorError === "" ? null : (
                    <Alert bsStyle={this.state.editorError.alertType}>
                        <div className={"controlButtonDiv controlButton"}>
                            <TiArrowMaximise size={30} onClick={() => this.setState({showAlert: true})}/>
                        </div>
                    </Alert>
                )}
            </Fragment>
        )
    }


    /**
     * render GUI errors.
     */
    renderGuiError() {
        return !this.state.guiError ? null : (
            <div className={"guiMessages has-error"} id={`gui_error_${this.ruleIndex}`}>
                <span>Select at least one element as a constraint.</span>
                <FaQuestionCircle size={20} className={"faQuestionCircle"}
                                  onClick={() => this.setState({
                                      tourShouldRun: true,
                                      isTourGuide: false,
                                      tourStepIndex: this.stepNames.GUI_CONSTRAINT
                                  })}/>
            </div>
        )
    }

    /**
     * render the dialog for adding a new tag
     * it is displayed when the 'New Tag' is clicked on
     * @returns {XML}
     */
    renderNewTagModalDialog() {
        return (
            <Modal show={this.state.showNewTagModal} onHide={() => this.setState({showNewTagModal: false})}
                   backdrop={"static"} keyboard={true}>
                <Modal.Header closeButton>
                    <Modal.Title>New Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup validationState={(this.state.tagName === "") ? "error" : "success"}>
                        <FormControl type="text" placeholder="Tag name. (Required)"
                                     style={{fontWeight: "bold"}}
                                     value={this.state.tagName}
                                     onChange={(e) => {
                                         this.setState({tagName: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </FormGroup>
                    <FormGroup validationState={(this.state.tagDetail === "") ? "error" : "success"}>
                        <FormControl componentClass="textarea"
                                     placeholder="Description, high level details about the tag. (Required)"
                                     value={this.state.tagDetail}
                                     onChange={(e) => {
                                         this.setState({tagDetail: e.target.value})
                                     }}
                                     onKeyUp={(e) => {
                                         e.target.style.cssText = 'height:auto; padding:0';
                                         e.target.style.cssText = 'height:' + this.scrollHeight + 'px';
                                     }}/>
                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={() => this.onSubmitNewTag()}>Save</Button>
                    <Button onClick={() => this.setState({showNewTagModal: false})}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        )
    }


    /**
     * render the modal for printing messages when errors appear for submission
     * @return {XML}
     */
    renderErrorInSubmission() {
        return (
            <Modal show={this.state.showError} onHide={() => this.setState({showError: false})}
                   backdrop={"static"} keyboard={true}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.errorTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.errorMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.setState({showError: false})}>OK</Button>
                </Modal.Footer>
            </Modal>
        )
    }

    /**
     * render step-by-step tour guide
     * @returns {XML}
     */
    renderTourGuide() {
        return (
            <Joyride
                key={this.state.tourMainKey}
                run={this.state.tourShouldRun}
                steps={this.tourGuideSteps}

                showSkipButton={this.state.isTourGuide}
                showProgress={this.state.isTourGuide}
                continuous={this.state.isTourGuide}
                hideBackButton={!this.state.isTourGuide}

                stepIndex={this.state.tourStepIndex}
                disableCloseOnEsc={true}
                spotlightPadding={5}

                callback={(tourData) => {
                    if (tourData.action === ACTIONS.CLOSE) {
                        this.setState({
                            tourMainKey: this.state.tourMainKey + 1,
                            tourShouldRun: false,
                            tourStepIndex: this.state.isTourGuide ? this.state.tourStepIndex : 0
                        });
                    }
                    else if (tourData.type === EVENTS.TOUR_END) {
                        this.setState({
                            tourMainKey: this.state.tourMainKey + 1,
                            tourStepIndex: 0,
                            tourShouldRun: false
                        });
                    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(tourData.type)) {
                        let nextIndex = tourData.index + (tourData.action === ACTIONS.PREV ? -1 : 1);
                        this.setState({tourStepIndex: nextIndex});
                    }

                }}

                floaterProps={{disableAnimation: true}}

                styles={{
                    options: {
                        primaryColor: '#000',
                        width: 900,
                        zIndex: 1000,
                    }
                }}
            />
        )
    }

    //componentDidUpdate doesn't work
    componentWillReceiveProps(nextProps) {
        if (nextProps.message === "RECEIVE_EXPR_STMT_XML") {
            this.matchSentAndReceivedMessages(nextProps);
        }

        else {
            if (nextProps.ruleIndex !== this.ruleIndex) {
                this.ruleIndex = nextProps.ruleIndex;
                let indices = nextProps.rules.map(d => d.index);
                let arrayIndex = indices.indexOf(this.ruleIndex);
                if (arrayIndex === -1)
                    console.log(`error: rule with index ${this.ruleIndex} is not found in the ruleTable.
                Only ${indices.toString()} are found as indices.`);
                else
                    this.ruleI = nextProps.rules[arrayIndex];
            }

            // existing rule
            if (this.ruleIndex !== -1) {
                this.setState({
                    title: this.ruleI.rulePanelState.title,
                    description: this.ruleI.rulePanelState.description,
                    ruleTags: this.ruleI.rulePanelState.ruleTags,
                    folderConstraint: this.ruleI.rulePanelState.folderConstraint,
                    filesFolders: this.ruleI.rulePanelState.filesFolders,
                    tags: this.ruleI.rulePanelState.tags,

                    autoCompleteArray: this.ruleI.rulePanelState.autoCompleteArray,
                    quantifierXPath: this.ruleI.rulePanelState.quantifierXPath,
                    constraintXPath: this.ruleI.rulePanelState.constraintXPath,
                    editorError: nextProps.message === "CLEAR_NEW_RULE_FORM" ? "" : this.state.editorError,

                    monacoFormStatus: nextProps.message === "CLEAR_NEW_RULE_FORM" ? "has-error" : nextProps.message === "CHANGE_AUTOCOMPLETE_TEXT_FROM_GUI" ? "has-warning" : this.state.monacoFormStatus,
                    errorPoint: -1
                });
            }
            // new rule
            else {
                this.setState({
                    title: nextProps.title,
                    description: nextProps.description,
                    ruleTags: nextProps.ruleTags,
                    folderConstraint: nextProps.folderConstraint,
                    filesFolders: nextProps.filesFolders,
                    tags: nextProps.tags,

                    autoCompleteArray: nextProps.autoCompleteArray,
                    quantifierXPath: nextProps.quantifierXPath,
                    constraintXPath: nextProps.constraintXPath,
                    editorError: nextProps.message === "CLEAR_NEW_RULE_FORM" ? "" : this.state.editorError,

                    monacoFormStatus: nextProps.message === "CLEAR_NEW_RULE_FORM" ? "has-error" : nextProps.message === "CHANGE_AUTOCOMPLETE_TEXT_FROM_GUI" ? "has-warning" : this.state.monacoFormStatus,
                    errorPoint: -1
                });
            }
        }
    }

    // _mounted is added to remove the warning caused by setting states
    // in Promise.then() function in onBlur
    componentDidMount() {
        this._mounted = true
    }

    componentWillUnmount() {
        this._mounted = false
    }


    /**
     * Match nextProps.sentMessages and nextProps.receivedMessages using messageIDs, update XPaths
     * and send actions to update store
     */
    matchSentAndReceivedMessages(nextProps) {
        let sentMessages = nextProps.sentMessages.map(a => ({...a})); // clone
        let receivedMessages = nextProps.receivedMessages.map(a => ({...a})); // clone
        let quantifierXPath = this.state.quantifierXPath.slice(0);
        let constraintXPath = this.state.constraintXPath.slice(0);

        sentMessages.sort((a, b) => a["messageID"] - b["messageID"]);
        receivedMessages.forEach(a => a["messageID"] = +a["messageID"]);
        receivedMessages.sort((a, b) => a["messageID"] - b["messageID"]);

        let matchedIndices = {sent: [], received: []};

        let otherIndex = 0;
        for (let index = 0; index < sentMessages.length; index++) {
            if (otherIndex >= receivedMessages.length) break;
            for (let j = otherIndex; j < receivedMessages.length; j++) {
                // matched messages
                if (+sentMessages[index]["messageID"] === +receivedMessages[j]["messageID"]) {
                    let resultXPath = this.traverseReceivedXml(receivedMessages[j]["xmlText"], sentMessages[index]);
                    // replace all occurrences of textAndXPath.originalText
                    let copiedQXPath = quantifierXPath.split(sentMessages[j]["lookFor"]);
                    quantifierXPath = copiedQXPath.join(resultXPath);
                    let copiedCXPath = constraintXPath.split(sentMessages[j]["lookFor"]);
                    constraintXPath = copiedCXPath.join(resultXPath);

                    matchedIndices.sent.push(index);
                    matchedIndices.received.push(j);

                    otherIndex = j + 1;
                    break;
                }
            }
        }
        // remove matched messages from list of messages
        for (let i = matchedIndices.sent.length - 1; i >= 0; i--)
            sentMessages.splice(matchedIndices.sent[i], 1);
        for (let i = matchedIndices.received.length - 1; i >= 0; i--)
            receivedMessages.splice(matchedIndices.received[i], 1);

        // at least one message is responded
        if (matchedIndices.sent.length > 0)
            this.props.onMatchMessages(this.ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath);
    }


    /**
     * check validity of an xml and generate the xpath query
     * @param xmlText
     * @param sentMessageData
     * @returns string xpath
     * derived from the originalText
     */
    traverseReceivedXml(xmlText, sentMessageData) { //todo use sentMessageData.query

        let exprValidation = sentMessageData["query"];
        let parser = new DOMParser();

        function nsResolver(prefix) {
            let ns = {'src': 'http://www.srcML.org/srcML/src'};
            return ns[prefix] || null;
        }

        // checks validity of the XML
        let xml = parser.parseFromString(xmlText, "text/xml");
        if (!xml.evaluate) {
            console.log("error in xml.evaluate");
            return "";
        }


        let validNodes = xml.evaluate(exprValidation, xml, nsResolver, XPathResult.ANY_TYPE, null);
        let resultValidNode = validNodes.iterateNext();
        if (!resultValidNode) {
            console.log("error");
            return "";
        }

        /**
         * recursive function
         * traverse the state_children of a parent node to generate xpath query conditions
         * @param parentNode
         * @returns string
         */
        let traverseChildren = (parentNode) => {
            let res = [];
            let children = parentNode.childNodes;
            for (let i = 0; i < children.length; i++) {

                if (children[i].nodeName === "#text") {
                    if (children.length === 1)
                        res.push("text()=\"" + children[i].nodeValue + "\"");
                }
                else {
                    res.push(traverseChildren(children[i]));
                }
            }
            return "src:" + parentNode.nodeName + "[" + res.join(' and ') + "]";
        };

        // result xpath: 'src:expr[....]' where 'src:expr[' and the final ']' is extra.
        let resultXPath = traverseChildren(resultValidNode);
        resultXPath = resultXPath.substring(9, resultXPath.length - 1);
        return resultXPath;
    }


    /**
     * process the error received by running verifyTextBasedOnGrammar on autoComplete text
     * @param error
     * @param errorIndex
     */
    processLanguageProcessingError(error, errorIndex = 400) {
        // console.log(error);
        switch (error) {
            case "ERROR_INDEX":
                if (errorIndex === -1)
                    this.setState({editorError: ""});
                else
                    this.setState({
                        editorError: {
                            errorType: "AutoComplete Error",
                            message: error_messages_IMarkdownString[errorIndex].value,
                            inputText: "",
                            alertType: "danger"
                        }
                    });
                break;
            case "EMPTY_FIELD":
                this.setState({
                    editorError: {
                        errorType: "Empty Field",
                        message: "The design rule input should not be empty",
                        inputText: "",
                        alertType: "warning"
                    }
                });
                break;
            case "NO_INPUT_AFTER_REPLACING_PHRASES":
                this.setState({
                    editorError: {
                        errorType: "Incorrect Input",
                        message: "The used phrases are incorrect. Try using different phrases.",
                        inputText: "",
                        alertType: "danger"
                    },
                    errorPoint: 1
                });
                break;
            case "NO_INPUT_AFTER_LEMMATIZATION":
                this.setState({
                    editorError: {
                        errorType: "Incorrect Input",
                        message: "The words used in the design rule are not compatible with CoreNLP library.",
                        inputText: "",
                        alertType: "danger"
                    },
                    errorPoint: 1
                });
                break;
            /**
             * {grammarErrors: [{rec, sym, line, col, msg, e}]}
             * or
             * {xpathTraverseErrors: errorMessage}
             */
            default:
                if (error.grammarErrors) {
                    let grammarError = error.grammarErrors[0];
                    this.setState({
                        editorError: {
                            errorType: "Grammar Error",
                            message: "The input text after the following sub-text is NOT according to the grammar:",
                            inputText: "\"" + error.inputText.slice(0, grammarError.col) + "\"",
                            alertType: "danger"
                        },
                        errorPoint: grammarError.col
                    });
                }
                else
                    this.setState({
                        editorError: {
                            errorType: "error",
                            message: "",
                            inputText: "",
                            alertType: "danger"
                        },
                        errorPoint: 1
                    });
                break;
        }
    }


    /**
     * change edit mode, set the states
     */
    changeEditMode() {
        this.props["changeEditMode"]();
    }

    /**
     * submit the updated rule (with the given Index)
     */
    onSubmitUpdatedRule() {
        let rule = {
            index: this.ruleIndex,
            title: this.state.title,
            description: this.state.description,
            tags: this.state.ruleTags,
            ruleType: {
                constraint: this.state.folderConstraint,
                checkFor: this.state.filesFolders.filter((d) => d !== ""),
                type: "WITHIN"
            },
            quantifier: {detail: "", command: "src:unit/" + this.ruleI.rulePanelState.quantifierXPath},
            constraint: {detail: "", command: "src:unit/" + this.ruleI.rulePanelState.constraintXPath},
            grammar: this.ruleI.rulePanelState.autoCompleteArray.map(d => d.text).join(" ")
        };

        if (this.props.numberOfSentMessages !== 0) {
            this.setState({
                errorTitle: "Error in Submitting the Rule",
                errorMessage: "Please wait for the server to respond to " + this.props.numberOfSentMessages + " sent messages for retrieving XPath. " +
                "If the error appeared by mistake, reset the form by 'clear' button.",
                showError: true
            });
            return;
        }

        if (rule.index === "" || rule.title === "" || rule.description === "") {
            this.setState({
                errorTitle: "Error in Submitting the updated Rule",
                errorMessage: "Make sure to enter 'title' and 'description' for the rule.",
                showError: true
            });
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            this.setState({
                errorTitle: "Error in Submitting the updated Rule",
                errorMessage: "Make sure to specify the folder 'restriction'. " +
                "If the constraint is set to 'Specific Files/Folders', at least one file/folder must be specified.",
                showError: true
            });
            return;
        }

        if (this.ruleI.rulePanelState.quantifierXPath === "" || this.ruleI.rulePanelState.constraintXPath === "") {
            this.setState({
                errorTitle: "Error in Submitting the updated Rule",
                errorMessage: "Please specify a valid design rule according to the grammar.",
                showError: true
            });
            return;
        }

        let isChanged = (rule.title !== this.ruleI.title) ||
            (rule.description !== this.ruleI.description) ||
            (JSON.stringify(rule.tags) !== JSON.stringify(this.ruleI.tags)) ||
            (rule.ruleType.constraint !== this.ruleI.ruleType.constraint) ||
            (JSON.stringify(rule.ruleType.checkFor) !== JSON.stringify(this.ruleI.ruleType.checkFor)) ||
            (rule.grammar !== this.ruleI.grammar) ||
            (rule.constraint.command !== this.ruleI.constraint.command) ||
            (rule.quantifier.command !== this.ruleI.quantifier.command);

        if (isChanged) {
            this.props.onUpdateRule(rule);
            Utilities.sendToServer(this.props.ws, "MODIFIED_RULE", rule);
        }
        this.changeEditMode();
    }

    /**
     * submit a new rule
     */
    onSubmitNewRule() {
        let rule = {
            index: Math.floor(new Date().getTime() / 1000),
            title: this.state.title,
            description: this.state.description,
            tags: this.state.ruleTags,
            ruleType: {
                constraint: this.state.folderConstraint,
                checkFor: this.state.filesFolders.filter((d) => d !== ""),
                type: "WITHIN"
            },
            quantifier: {detail: "", command: "src:unit/" + this.props.quantifierXPath},
            constraint: {detail: "", command: "src:unit/" + this.props.constraintXPath},
            grammar: this.props.autoCompleteArray.map(d => d.text).join(" ")
        };

        if (this.props.numberOfSentMessages !== 0) {
            this.setState({
                errorTitle: "Error in Submitting the new Rule",
                errorMessage: "Please wait for the server to respond to " + this.props.numberOfSentMessages + " sent messages for retrieving XPath. " +
                "If the error appeared by mistake, reset the form by 'clear' button.",
                showError: true
            });
            return;
        }

        if (rule.index === "" || rule.title === "" || rule.description === "") {
            this.setState({
                errorTitle: "Error in Submitting the new Rule",
                errorMessage: "Make sure to enter 'title' and 'description' for the rule.",
                showError: true
            });
            return;
        }

        if (rule.ruleType.constraint === "" || (rule.ruleType.constraint === "FOLDER" && rule.ruleType.checkFor.length === 0)) {
            this.setState({
                errorTitle: "Error in Submitting the new Rule",
                errorMessage: "Make sure to specify the folder 'restriction'. " +
                "If the constraint is set to 'Specific Files/Folders', at least one file/folder must be specified.",
                showError: true
            });
            return;
        }

        if (rule.quantifierXPath === "" || rule.constraintXPath === "") {
            this.setState({
                errorTitle: "Error in Submitting the new Rule",
                errorMessage: "Please specify a valid design rule according to the grammar.",
                showError: true
            });
            return;
        }

        this.props.onSubmitNewRule(rule);
        Utilities.sendToServer(this.props.ws, "NEW_RULE", rule);
        this.changeEditMode();
    }

    /**
     * adding a new tag
     * In tagJson, the property is 'detail'
     */
    onSubmitNewTag() {
        if (this.state.tagName === "" || this.state.tagDetail === "") {
            this.setState({
                errorMessage: "Please specify non-empty name and description for the new tag.",
                showError: true
            });
            return;
        }
        if (this.state.tags.filter(tag => tag.tagName === this.state.tagName).length > 0) {
            this.setState({
                errorTitle: "Error in Submitting the new Tag",
                errorMessage: `"${this.state.tagName}" already exists with description "${this.state.tagDetail}'". 
                If the new tag is different, please select a different name.`,
                showError: true
            });
            return;
        }
        // todo it doesn't check for duplicate tags
        let tag = {tagName: this.state.tagName, detail: this.state.tagDetail};
        this.props.onSubmitNewTag(tag);
        Utilities.sendToServer(this.props.ws, "NEW_TAG", tag);
    }

    /***
     * This function calls a dispatcher for redux
     * to update the content of the form in the main state
     */
    onEditNewRuleForm() {
        this.props.onEditForm(
            this.ruleIndex,
            this.state.title,
            this.state.description,
            this.state.ruleTags,
            this.state.folderConstraint,
            this.state.filesFolders
        );
    }

}

function mapStateToProps(state) {
    return {
        rules: state.ruleTable,
        tags: state.tagTable,
        ws: state.ws,

        // for new rule
        title: state.newOrEditRule.title,
        description: state.newOrEditRule.description,
        ruleTags: state.newOrEditRule.ruleTags,
        folderConstraint: state.newOrEditRule.folderConstraint,
        filesFolders: state.newOrEditRule.filesFolders,

        autoCompleteArray: state.newOrEditRule.autoCompleteArray,
        quantifierXPath: state.newOrEditRule.quantifierXPath,
        constraintXPath: state.newOrEditRule.constraintXPath,
        message: state.message,

        sentMessages: state.newOrEditRule.sentMessages,
        receivedMessages: state.newOrEditRule.receivedMessages,
        // for submitting the rule
        numberOfSentMessages: state.newOrEditRule.sentMessages.length
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onSubmitNewRule: (newRule) => dispatch(submitNewRule(newRule)),
        onUpdateRule: (updatedRule) => dispatch(updateRule(updatedRule)),
        onSubmitNewTag: (newTag) => dispatch(submitNewTag(newTag)),
        onClearForm: () => dispatch(clearNewRuleForm()),
        onEditForm: (ruleIndex, title, description, ruleTags, folderConstraint, filesFolders) => {
            dispatch(editRuleForm(ruleIndex, title, description, ruleTags, folderConstraint, filesFolders))
        },
        onReceiveGuiTree: (ruleIndex, treeData, autoCompleteArray, quantifierXPath, constraintXPath) => {
            dispatch(receiveGuiTree(ruleIndex, treeData, autoCompleteArray, quantifierXPath, constraintXPath))
        },
        onMatchMessages: (ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath) => {
            dispatch(matchMessages(ruleIndex, sentMessages, receivedMessages, quantifierXPath, constraintXPath))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditRuleForm);


/* custom dropdown for tags */

class CustomDropDown extends Component {
    constructor(props) {
        super(props);

        if (!props.menuItems || !props.onSelectFunction)
            return new Error(`'menuItems' and 'onSelectFunction' are required in props`);

        this.state = {
            menuItems: props.menuItems,
            onSelectFunction: props.onSelectFunction,
            id: props.id ? props.id : "dropdown-custom-menu",
            open: false
        }
    }

    render() {
        return (
            <RootCloseWrapper onRootClose={() => this.setState({open: false})}>
                <Dropdown id={this.state.id} open={this.state.open}
                          onToggle={() => this.setState({open: !this.state.open})}>
                    <CustomToggle bsRole="toggle">
                        <span className={"faTag"}>Assign Tags
                            <FaTag size={25} className={"faTag"}/>
                        </span>
                    </CustomToggle>
                    <CustomMenu bsRole="menu">
                        {this.state.menuItems.map((el, i) =>
                            (<MenuItem eventKey={el} key={i}
                                       onSelect={this.state.onSelectFunction}
                            >{(() => el !== "New Tag" ? el :
                                <Fragment><MdAddBox size={20} className={"mdAddBox"}/> {el}</Fragment>)()}
                            </MenuItem>)
                        )}
                    </CustomMenu>
                </Dropdown>
            </RootCloseWrapper>
        )
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            menuItems: nextProps.menuItems,
            onSelectFunction: nextProps.onSelectFunction,
            id: nextProps.id ? nextProps.id : "dropdown-custom-menu"
        });

    }
}

class CustomMenu extends Component {

    render() {
        const {children} = this.props;
        return (<div className="dropdown-menu">{React.Children.toArray(children)}</div>);
    }
}

class CustomToggle extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onClick(e);
    }

    render() {
        return (<a href="" onClick={this.handleClick}>{this.props.children}</a>);
    }
}