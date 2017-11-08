import * as React from "react";

import { TextInput } from "../../../../components/text-input";

interface OwnProps {
    onSubmit: (newListName: string) => void;
}

interface OwnState {
    name: string;
}

export class AddNewListForm extends React.Component<OwnProps, OwnState> {

    constructor(props) {
        super(props);

        this.state = {
            name: ""
        }

        this._handleInputOnChange = this._handleInputOnChange.bind(this);
        this._handleAddClick = this._handleAddClick.bind(this);
    }

    public render(): JSX.Element {

        return (
            <form>
                <div className="form-row align-items-center">
                    <div className="col-auto">
                        <TextInput
                            name="listName"
                            required={true}
                            placeholder="Name for the new list"
                            onChange={this._handleInputOnChange}
                            marginBottom={0} />
                    </div>
                    <div className="col-auto">
                        <button
                            type="submit"
                            disabled={!this.state.name}
                            onClick={this._handleAddClick}
                            className="btn btn-primary">Add new list</button>
                    </div>
                </div>
            </form>
        )

    }


    private _handleInputOnChange(value: string) {
        this.setState({ name: value });
    }

    private _handleAddClick(evt) {
        evt.preventDefault();

        const { name } = this.state;
        if (name) {
            this.props.onSubmit(name);
        }
    }
}