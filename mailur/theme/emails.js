import React from "react";

class EmailList extends React.Component {
    render() {
        let v = this.props;

        return (
        <ul className="emails">
        {v.items.map(function(item) {
            return <EmailLine key={item.id} {...item} />;
        })}
        </ul>
        )
    }
}

class EmailLine extends React.Component {
    render() {
    let v = this.props;
    return (
    <li className="email">
    <ul className="email-line">
        {
            v.draft
            ? <li className="email-draft">Draft</li>
            : <li className="email-pin" title="Toggle Pin"></li>
        }
        <li className="email-pick"><input type="checkbox" className="mousetrap"/></li>
        <li
            className="email-pic email-info"
            style={{backgroundImage: `url(${v.fr.image})`}}
        ></li>
        <li className="email-from email-info" title={v.fr.full}>{v.fr.short}</li>
        <li className={'email-subj email-info' + v.subj_changed ? ' email-subj-changed' : ''}>
            <a href="#">{v.subj_human}</a>
        </li>
        <li className="email-preview email-info">{v.preview}</li>
        <li className="email-expander email-info">&nbsp;</li>
        <li className="email-time" title="{v.time}">{v.time_human}</li>
    </ul>
    </li>
    )}
}

if (emails) {
    let items = emails['emails?']['items'];
    React.render(<EmailList items={items}/>, document.querySelector('.body'))
}
