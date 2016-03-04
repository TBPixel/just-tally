
// Data
"use strict";

var data = [];

// Tally
var Tally = React.createClass({
  displayName: "Tally",

  _handleClick: function _handleClick(value) {
    var newCount = this.props.count + value;
    this.props._handleChange(this.props.id, newCount);
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "tally-node" },
      React.createElement(
        "div",
        { className: "meta-data" },
        React.createElement(
          "span",
          { className: "count" },
          this.props.count
        ),
        React.createElement(
          "span",
          { className: "name" },
          this.props.name
        )
      ),
      React.createElement(
        "div",
        { className: "minus", onClick: this._handleClick.bind(null, this.props.minus) },
        React.createElement("span", { className: "fa fa-minus" })
      ),
      React.createElement(
        "div",
        { className: "plus", onClick: this._handleClick.bind(null, this.props.plus) },
        React.createElement("span", { className: "fa fa-plus" })
      )
    );
  }
});

// Add Tally
var AddTally = React.createClass({
  displayName: "AddTally",

  _handleSubmit: function _handleSubmit(e) {
    e.preventDefault();

    function defaultValue(v, d) {
      if (v !== undefined && v !== "") return v;else return d;
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

    this.props._handleNewTally(newTally);
  },

  render: function render() {
    var show = function show(parent) {

      if (parent.props.showCreateTallyMenu) return "create-tally show";else return "create-tally";
    };
    return React.createElement(
      "div",
      { className: show(this) },
      React.createElement(
        "form",
        { className: "new-tally", onSubmit: this._handleSubmit },
        React.createElement("input", { type: "text", className: "name", placeholder: "Tally Name" }),
        React.createElement("input", { type: "number", className: "initialCount", placeholder: "Initial Count" }),
        React.createElement("input", { type: "number", className: "minus", placeholder: "Decrement" }),
        React.createElement("input", { type: "number", className: "plus", placeholder: "Increment" }),
        React.createElement("input", { type: "submit", value: "Create Tally" })
      )
    );
  }
});

// Confirmation Prompt
var ResetPrompt = React.createClass({
  displayName: "ResetPrompt",

  _handleClick: function _handleClick(bool) {

    if (bool) this.props._handleMasterReset(bool);

    this.props._toggleConfirmation();
  },

  render: function render() {

    var show = function show(parent) {

      if (parent.props.showConfirmation) return "reset-prompt show";else return "reset-prompt";
    };

    return React.createElement(
      "div",
      { className: show(this) },
      React.createElement(
        "div",
        { className: "cancel", onClick: this._handleClick.bind(null, false) },
        React.createElement("span", { className: "fa fa-times" })
      ),
      React.createElement(
        "div",
        { className: "confirm", onClick: this._handleClick.bind(null, true) },
        React.createElement("span", { className: "fa fa-check" })
      )
    );
  }
});

// TallyMenu
var TallyMenu = React.createClass({
  displayName: "TallyMenu",

  getInitialState: function getInitialState() {
    return { showConfirmation: false, showCreateTallyMenu: false };
  },

  _toggleConfirmation: function _toggleConfirmation() {
    this.setState({ showConfirmation: !this.state.showConfirmation });
  },

  _toggleTallyMenu: function _toggleTallyMenu() {
    this.setState({ showCreateTallyMenu: !this.state.showCreateTallyMenu });
  },

  render: function render() {
    var toggleTallyMenuClass = function toggleTallyMenuClass(parent) {
      if (parent.state.showCreateTallyMenu) return "fa fa-chevron-down";else return "fa fa-plus";
    };
    return React.createElement(
      "div",
      { className: "tally-menu" },
      React.createElement(
        "div",
        { className: "addTally", onClick: this._toggleTallyMenu },
        React.createElement("span", { className: toggleTallyMenuClass(this) })
      ),
      React.createElement(AddTally, {
        showCreateTallyMenu: this.state.showCreateTallyMenu,
        _toggleTallyMenu: this._toggleTallyMenu,
        _handleNewTally: this.props._handleNewTally }),
      React.createElement(
        "div",
        { className: "masterReset", onClick: this._toggleConfirmation },
        React.createElement("span", { className: "fa fa-refresh" })
      ),
      React.createElement(ResetPrompt, {
        showConfirmation: this.state.showConfirmation,
        _toggleConfirmation: this._toggleConfirmation,
        _handleMasterReset: this.props._handleMasterReset })
    );
  }
});

// TallyList
var TallyList = React.createClass({
  displayName: "TallyList",

  render: function render() {
    var tallyNodes = this.props.data.map(function (tally, i) {
      return React.createElement(Tally, {
        key: i,
        id: i,
        name: tally.name,
        initialCount: tally.initialCount,
        count: tally.count,
        minus: tally.minus,
        plus: tally.plus,
        _handleChange: this.props._handleChange });
    }, this);
    return React.createElement(
      "div",
      { className: "tally-list" },
      tallyNodes
    );
  }
});

var TallyBox = React.createClass({
  displayName: "TallyBox",

  getInitialState: function getInitialState() {
    return { data: [] };
  },

  componentDidMount: function componentDidMount() {
    this.setState({ data: data });
  },

  _handleChange: function _handleChange(key, newCount) {
    data[key].count = newCount;
    this.setState({ data: data });
  },

  // Create Tally Menu
  _handleNewTally: function _handleNewTally(newTallyObject) {
    data.push(newTallyObject);

    // Update State
    this.setState({ data: data });
  },

  // Master Reset Menu
  _handleMasterReset: function _handleMasterReset(confirm) {

    if (confirm) {
      for (var i = 0; i < data.length; i++) {
        data[i].count = data[i].initialCount;
      }
    }

    // Update State
    this.setState({ data: data });
  },

  render: function render() {
    return React.createElement(
      "div",
      { className: "tally-box" },
      React.createElement(TallyList, {
        data: data,
        _handleChange: this._handleChange }),
      React.createElement(TallyMenu, {
        _handleNewTally: this._handleNewTally,
        _handleMasterReset: this._handleMasterReset })
    );
  }
});

ReactDOM.render(React.createElement(TallyBox, { data: data }), document.getElementById('content'));