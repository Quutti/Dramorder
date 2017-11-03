import * as React from "react";


export type LoginFormSubmitHandler = (password: string) => void;

interface OwnProps {
    onSubmit: LoginFormSubmitHandler;
}

interface OwnState {
    password: string;
}

export class LoginForm extends React.Component<OwnProps, OwnState> {

    constructor(props) {
        super(props);
        this.state = { password: "" };

        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
    }

    public render(): JSX.Element {
        return (
            <form onSubmit={this._handleSubmit}>
                <div className="form-group">
                    <input className="form-control" type="password" onChange={this._handleInputChange} />
                </div>
                <div>
                    <button className="btn btn-primary" type="submit">Log in</button>
                </div>
            </form>
        )
    }

    private _handleSubmit(evt) {
        evt.preventDefault();
        this.props.onSubmit(this.state.password);
    }

    private _handleInputChange(evt) {
        this.setState({
            password: evt.target.value
        });
    }

}