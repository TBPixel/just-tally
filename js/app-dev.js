
// Data
var data = [];

// Tally
var Tally = React.createClass({

  _handleClick: function( value ) {
    var newCount = this.props.count + value;
    this.props._handleChange( this.props.id, newCount );
  },

  render: function() {
    return (
      <div className="tally-node">
        <div className="meta-data">
          <span className="count">{this.props.count}</span>
          <span className="name">{this.props.name}</span>
        </div>
        <div className="minus" onClick={this._handleClick.bind(null, this.props.minus)}><span className="fa fa-minus"></span></div>
        <div className="plus" onClick={this._handleClick.bind(null, this.props.plus)}><span className="fa fa-plus"></span></div>
      </div>
    );
  }
});

// Add Tally
var AddTally = React.createClass({

  _handleSubmit: function(e) {
    e.preventDefault();

    function defaultValue(v, d) {
      if ( v !== undefined && v !== "")
        return v;
      else
        return d;
    }

    var form = e.target,
      inputs = form.querySelectorAll('.name, .initialCount, .minus, .plus');

    var newTally = {};

    newTally.id = Date.now();
    newTally.name = defaultValue(inputs[0].value, "Tally");
    newTally.initialCount = Number(defaultValue(inputs[1].value, 0));
    newTally.count = newTally.initialCount;
    newTally.minus = Number(defaultValue(inputs[2].value, -1));
    newTally.plus = Number(defaultValue(inputs[3].value, 1));

    this.props._handleNewTally( newTally );
  },

  render: function() {
    var show = function(parent) {

      if (parent.props.showCreateTallyMenu) return "create-tally show";
      else return "create-tally";
    };
    return (
      <div className={show(this)}>
        <form className="new-tally" onSubmit={this._handleSubmit}>
          <input type="text" className="name" placeholder="Tally Name" />
          <input type="number" className="initialCount" placeholder="Initial Count" />
          <input type="number" className="minus" placeholder="Decrement" />
          <input type="number" className="plus" placeholder="Increment" />
          <input type="submit" value="Create Tally" />
        </form>
      </div>
    );
  }
});

// Confirmation Prompt
var ResetPrompt = React.createClass({

  _handleClick: function( bool ) {

    if (bool)
      this.props._handleMasterReset( bool );

    this.props._toggleConfirmation();
  },

  render: function() {

    var show = function(parent) {

      if (parent.props.showConfirmation) return "reset-prompt show";
      else return "reset-prompt";
    };

    return (
      <div className={show(this)}>
        <div className="cancel" onClick={this._handleClick.bind(null, false)}><span className="fa fa-times"></span></div>
        <div className="confirm" onClick={this._handleClick.bind(null, true)}><span className="fa fa-check"></span></div>
      </div>
    );
  }
});

// TallyMenu
var TallyMenu = React.createClass({

  getInitialState: function() {
    return { showConfirmation: false, showCreateTallyMenu: false }
  },

  _toggleConfirmation: function() {
    this.setState({ showConfirmation: !this.state.showConfirmation });
  },

  _toggleTallyMenu: function() {
    this.setState({ showCreateTallyMenu: !this.state.showCreateTallyMenu })
  },

  render: function() {
    var toggleTallyMenuClass = function(parent) {
      if (parent.state.showCreateTallyMenu) return "fa fa-chevron-down";
      else return "fa fa-plus";
    };
    return (
      <div className="tally-menu">
        <div className="addTally" onClick={this._toggleTallyMenu}><span className={toggleTallyMenuClass(this)}></span></div>
        <AddTally 
          showCreateTallyMenu={this.state.showCreateTallyMenu} 
          _toggleTallyMenu={this._toggleTallyMenu} 
          _handleNewTally={this.props._handleNewTally} />
        <div className="masterReset" onClick={this._toggleConfirmation}><span className="fa fa-refresh"></span></div>
        <ResetPrompt 
          showConfirmation={this.state.showConfirmation} 
          _toggleConfirmation={this._toggleConfirmation}
          _handleMasterReset={this.props._handleMasterReset} />
      </div>
    );
  }
});

// TallyList
var TallyList = React.createClass({

  render: function() {
    var tallyNodes = this.props.data.map(function(tally, i) {
      return (
        <Tally 
          key={i} 
          id={i} 
          name={tally.name} 
          initialCount={tally.initialCount} 
          count={tally.count} 
          minus={tally.minus} 
          plus={tally.plus} 
          _handleChange={this.props._handleChange} />
      );
    }, this);
    return (
      <div className="tally-list">
        {tallyNodes}
      </div>
    );
  }
});

var TallyBox = React.createClass({

  getInitialState: function() {
    return { data: [] };
  },

  componentDidMount: function() {
    this.setState({ data: data });
  },

  _handleChange: function( key, newCount ) {
    data[key].count = newCount;
    this.setState({data: data});
  },

  // Create Tally Menu
  _handleNewTally: function( newTallyObject ) {
    data.push(newTallyObject);

    // Update State
    this.setState({data: data});
  },

  // Master Reset Menu
  _handleMasterReset: function( confirm ) {

    if ( confirm ) {
      for( var i = 0; i < data.length; i++) {
        data[i].count = data[i].initialCount;
      }
    }

    // Update State
    this.setState({data: data});
  },

  render: function() {
    return (
      <div className="tally-box">
        <TallyList 
          data={data} 
          _handleChange={this._handleChange} />

        <TallyMenu 
          _handleNewTally={this._handleNewTally} 
          _handleMasterReset={this._handleMasterReset} />
      </div>
    );
  }
});

ReactDOM.render(
  <TallyBox data={data} />,
  document.getElementById('content')
);