import * as React from "react";

import { OrderItem, OrderList } from "../../../../types";
import * as validators from "../../../../helpers/text-input-validators";

import { Modal, ModalButton } from "../../../../components/modal";
import { TextInput, TextInputValidator } from "../../../../components/text-input";

export type AddNewItemFormSubmitHandler = (item: OrderItem) => void;

interface OwnProps {
    onSubmit: AddNewItemFormSubmitHandler;
    onCloseRequest: () => void;
    visible: boolean;
    list: OrderList;
}

interface OwnState {
    name: string;
    price: number;
    quantity: number;
    href: string;
    visible: boolean;
}

const inputSchema = {
    name: { label: "Bottle name", required: true },
    price: { label: "Price per unit", validator: validators.numberValidator, required: true },
    quantity: { label: "Quantity", validator: validators.integerValidator, required: true },
    href: { label: "Http/https link to bottle", validator: validators.hrefValidator, required: true }
}

export class AddNewItemForm extends React.Component<OwnProps, OwnState> {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            price: 0,
            quantity: 1,
            href: "",
            visible: false
        }

        this._handleInputChange = this._handleInputChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleClose = this._handleClose.bind(this);
    }

    public render(): JSX.Element {
        let saveButtonEnabled = this._allInputsValid();

        const inputs = Object.keys(this.state)
            .filter(name => {
                return (name in inputSchema)
            })
            .map((name, index) => {
                const schema = inputSchema[name];
                const { label, validator, required } = schema;

                return (
                    <TextInput
                        key={index}
                        name={name}
                        label={label}
                        onChange={this._handleInputChange}
                        validator={validator}
                        required={required}
                    />
                )
            });

        const modalButtons: ModalButton[] = [{
            text: "Save",
            disabled: !saveButtonEnabled,
            primary: true,
            onClick: (evt) => this._handleSubmit(evt)
        }];

        return (
            <Modal heading={`Add new item (${this.props.list.name})`} visible={this.state.visible} onCloseRequest={this._handleClose} buttons={modalButtons}>
                <form onSubmit={this._handleSubmit}>
                    {inputs}
                </form>
            </Modal>
        )
    }

    public componentWillReceiveProps(newProps: OwnProps) {
        if (newProps.visible !== this.props.visible) {
            this.setState({ visible: newProps.visible });
        }
    }

    private _handleSubmit(evt) {
        evt.preventDefault();
        this.props.onSubmit(this.state);
    }

    private _allInputsValid(): boolean {
        const { name, price, quantity, href } = this.state;

        const nameOk = name !== "";
        const hrefOk = href !== "";
        const priceOk = typeof price === "number" && price > 0;
        const quantityOk = typeof quantity === "number" && price > 0;

        return nameOk && hrefOk && priceOk && quantityOk;
    }

    private _handleInputChange(value: string, name: string) {
        if (name === "quantity") {
            const intValue = parseInt(value, 10) || 0;
            this.setState({ [name]: intValue } as any);
        } else if (name === "price") {
            const decValue = parseFloat(value) || 0;
            this.setState({ [name]: decValue } as any);
        } else {
            this.setState({ [name]: value } as any)
        }
    }

    private _handleClose() {
        this.setState({ visible: false });
        this.props.onCloseRequest();
    }

}