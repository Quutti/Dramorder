import * as React from "react";

import { OrderList } from "../../../../types";
import { Modal, ModalButton } from "../../../../components/modal";
import { Summary } from "../../../../components/summary";
import { TextInput } from "../../../../components/text-input";
import { Checkbox } from "../../../../components/checkbox";

export type EditListModalSubmit = (newName: string) => void;

interface OwnProps {
    active: boolean;
    list: OrderList;
    onCloseRequest: () => void;
    onSubmit: EditListModalSubmit;
    onRemoveRequest: () => void;
}

interface OwnState {
    active: boolean;
    removeChecked: boolean;
    name: string;
}

export class EditListModal extends React.Component<OwnProps, OwnState> {

    constructor(props) {
        super(props);

        this.state = {
            active: false,
            removeChecked: false,
            name: ""
        }

        this._handleClose = this._handleClose.bind(this);
        this._handleOnChange = this._handleOnChange.bind(this);
        this._handleCheckboxChange = this._handleCheckboxChange.bind(this);
        this._handleSaveButtonClick = this._handleSaveButtonClick.bind(this);
        this._handleRemoveButtonClick = this._handleRemoveButtonClick.bind(this);
    }

    public render(): JSX.Element {

        const { active, list } = this.props;

        const modalButtons: ModalButton[] = [{
            text: "Save",
            primary: true,
            disabled: this._disableSaveButton(),
            onClick: this._handleSaveButtonClick
        }, {
            text: "Cancel",
            dismiss: true
        }];

        return (
            <Modal heading={`Edit list ${list.name}`} visible={active} onCloseRequest={this._handleClose} buttons={modalButtons}>
                <form>
                    <TextInput
                        label="Name"
                        name="name"
                        required={true}
                        value={this.state.name}
                        onChange={this._handleOnChange} />

                    <Summary>

                        <Checkbox
                            name="delete"
                            onChange={this._handleCheckboxChange}
                            label="Remove this list (this action cannot be reverted!)" />

                        {this.state.removeChecked && <button className="btn btn-primary" onClick={this._handleRemoveButtonClick}>Remove</button>}

                    </Summary>
                </form>
            </Modal>
        )

    }

    public componentWillReceiveProps(newProps: OwnProps) {
        if (this.props.active !== newProps.active) {
            this.setState({ active: newProps.active })
        }

        if (newProps.active) {
            this.setState({ name: newProps.list.name });
        }
    }

    private _handleClose() {
        this.props.onCloseRequest();
    }

    private _handleOnChange(value: string, name: string) {
        this.setState({ name: value });
    }

    private _handleCheckboxChange(value: boolean, name: string) {
        this.setState({ removeChecked: value });
    }

    private _disableSaveButton(): boolean {
        return !this.state.name;
    }

    private _handleSaveButtonClick() {
        const { name } = this.state;
        if (name) {
            this.props.onSubmit(name);
        }
    }

    private _handleRemoveButtonClick() {
        this.props.onRemoveRequest();
    }

}