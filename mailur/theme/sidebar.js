import React from "react";
import Mousetrap from "mousetrap";

/* Keyboard shortcuts */
let hotkeys = [
    [['s a', '* a'], 'Select all conversations', function() {
        $('.email .email-pick input').prop('checked', true);
    }],
    [['s n', '* n'], 'Deselect all conversations', function() {
        $('.email .email-pick input').prop('checked', false);
    }],
    [['s r', '* r'], 'Select read conversations', function() {
        $('.email:not(.email-unread) .email-pick input').prop('checked', true);
    }],
    [['s u', '* u'], 'Select unread conversations', function() {
        $('.email.email-unread .email-pick input').prop('checked', true);
    }],
    [['s p', '* s'], 'Select pinned conversations', function() {
        $('.email.email-pinned .email-pick input').prop('checked', true);
    }],
    [['s shift+p', '* t'], 'Select unpinned conversations', function() {
        $('.email:not(.email-pinned) .email-pick input').prop('checked', true);
    }],
    [['m !', '!'], 'Report as spam', function() {
        mark({action: '+', name: '\\Spam'});
    }],
    [['m #', '#'] , 'Delete', function() {
        mark({action: '+', name: '\\Trash'});
    }],
    [['m u', 'm shift+r'], 'Mark as unread', function() {
        mark({action: '+', name: '\\Unread'}, function() {});
    }],
    [['m r', 'm shift+u'], 'Mark as read', function() {
        mark({action: '-', name: '\\Unread'}, function() {});
    }],
    [['m i', 'm shift+a'], 'Move to Inbox', function() {
        mark({action: '+', name: '\\Inbox'});
    }],
    [['m a', 'm shift+i'], 'Move to Archive', function() {
        mark({action: '-', name: '\\Inbox'});
    }],
    [['m l'], 'Edit labels', function() {
        $('.email-labels-edit input').focus();
    }],
    [['r r'], 'Reply', function() {
        location.href = $('.email:last').data('reply-url');
    }],
    [['r a'], 'Reply all', function() {
        location.href = $('.email:last').data('replyall-url');
    }],
    [['c'], 'Compose', function() {
        location.href = '/compose/';
    }],
    [['g i'], 'Go to Inbox', goToLabel('\\Inbox')],
    [['g d'], 'Go to Drafts', goToLabel('\\Drafts')],
    [['g s'], 'Go to Sent messages', goToLabel('\\Sent')],
    [['g u'], 'Go to Unread conversations', goToLabel('\\Unread')],
    [['g p'], 'Go to Pinned conversations', goToLabel('\\Pinned')],
    [['g a'], 'Go to All mail', goToLabel('\\All')],
    [['g !'], 'Go to Spam', goToLabel('\\Spam')],
    [['g #'], 'Go to Trash', goToLabel('\\Trash')],
    [['?'], 'Toggle keyboard shortcut help', function() {
        $('.help-toggle').click();
    }]
];
let helpText = hotkeys.map(function(item) {
  return <div key={item[0][0]}><b>{item[0][0]}</b>: {item[1]}</div>;
});
for (let item of hotkeys) {
  Mousetrap.bind(item[0], item[2], 'keyup');
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state= {help: false};
    this.helpShow = (function() {
      Mousetrap.bind('esc', this.helpHide);
      this.setState({help: true})
    }).bind(this);
    this.helpHide = (function() {
      Mousetrap.unbind('esc');
      this.setState({help: false})
    }).bind(this);
  }
  render() {
    let v = this.props,
        labels = v['labels?'].items;

    return (<div>
      <div className="help" style={{display: this.state.help ? 'block' : 'none'}}>
        <h3>
          Keyboard shortcuts
          <a className="help-close" onClick={this.helpHide} title="Close">X</a>
        </h3>
        {helpText}
      </div>,
      <div className="sidebar">
        <b>{v.username} ({v.email ? v.email : <a href="/gmail/">connect</a>})</b>
        <nav>
          <a href="/logout/" className="logout" title="Logout"></a>
          <a href="#" onClick={this.helpShow} className="help-toggle" title="Keyboard shortcut help"></a>
          {v.email ? <a href="/compose/" className="compose-new">Compose</a> : ''}
        </nav>
        {labels && (<div>
          <form className="search-form" action="/search/">
            <input name="q" type="text" defaultValue={v.search_query}/>
            <button type="submit" className="search"></button>
          </form>
          <ul className="labels">
            {labels.map(function(i) {return (
              <li key={i.name}><a href={i.url}>
                {i.unread ? <b>{i.name} ({i.unread})</b> : i.name}
              </a></li>
            )})}
          </ul>
        </div>)}
      </div>
      {!labels && (
        <div className="body">
          {
            v.email
            ? 'Please wait for complete synchronization.'
            : <a href="/gmail/">Please, connect your gmail account.</a>
          }
        </div>
      )}
    </div>)
  }
}

function mark() {}
function goToLabel(label) {
    return function() {
        location.href = '/emails/?in=' + label;
    };
}

export function render(data) {
  React.render(<Sidebar {...data} />, document.querySelector('body'));
}
