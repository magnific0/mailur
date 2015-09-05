import React from "react";

class Sidebar extends React.Component {
  render() {
    let v = this.props,
        labels = v['labels?'].items;

    return (<div>
      <div className="sidebar">
        <b>{v.username} ({v.email ? v.email : <a href="/gmail/">connect</a>})</b>
        <nav>
          <a href="/logout/" className="logout" title="Logout"></a>
          <a href="#" className="help-toggle" title="Keyboard shortcut help"></a>
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

export function render(data) {
  React.render(<Sidebar {...data} />, document.querySelector('body'));
}
