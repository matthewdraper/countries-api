import React, { Component } from 'react';

class Error extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let classes = [
            'alert', 'alert-danger'
        ];

        if(!this.props.text) {
            classes.push('d-none');
        }

        return (
            <div class={'alert-wrapper'}>
                <div className={classes.join(' ')}>{this.props.text}</div>
            </div>
        );
    }

}


export default Error;
